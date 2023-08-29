#!/usr/bin/osascript -l JavaScript
// findJpgHeicDuplicates.js
// https://n8henrie.com/2021/02/remove-duplicate-jpg-or-heic-photos-from-macos-photosapp/
//
// Quickstart:
//   - Copy this into a file, e.g. `findJpgHeicDuplicates.js`
//      - Alternatively, check the post above for a download link
//   - Make executable: `chmod +x findJpgHeicDuplicates.js`
//   - Modify the configuration in the `CUSTOMIZE` section if desired
//     - This is where you can configure getting rid of `.jpg` vs `.heic`
//   - Select a set of photos in Photos.app
//   - Run `./findJpgHeicDuplicates.js`
//   - Process the suspected duplicates in `Duplicates/timestamp`
//
//  Alternatively, users not comfortable with the command line can:
//    - open `Script Editor.app` on their Mac
//      - `/System/Applications/Utilities/Script Editor.app` on Big Sur
//    - create a new script
//    - Change the language to JavaScript (if `AppleScript` is displayed near
//      the top left)
//    - Copy and paste the contents of this script
//    - You will need to compile with `command` + `k` (or the hammer button) in
//      between each run or else you will get `Error: SyntaxError: Can't create
//      duplicate variable:`
//
// Apple's newish `.heic` image format compresses photos somewhat smaller than
// jpg with some loss of minor details. Unfortunately, many users like myself
// end up with numerous duplicate photos as a result -- half .jpg and half
// .heic -- which nullifies the space savings.
//
// This script uses filename (sans extension), the photo's timestamp*, and
// configurable fields in `criteria` (found in the `CUSTOMIZE` section) to find
// likely .heic/.jpg duplicates from a selected set of photos in MacOS
// Photos.app. If it finds a likely duplicate with at least one copy of the
// desired extension, it then moves all copies of the UNdesired filetype to an
// album named by the unix timestamp at the time of running within a folder
// named `Duplicates`. These can then be inspected, and if desired batch
// deleted with `command` + `delete`.
//
// * +/- 10 seconds, since most of my `.heic` files are timestamped ~1 second
//   after the `.jpg`
//
// Note that if adding many photos to an album at once, Photos.app may prompt
// for confirmation before doing so. Therefore, if you leave this script
// running and aren't there to accept the confirmation prompt, the script may
// time out while waiting for a response. Additionally, if your Mac sleeps
// while this is running, it may not work properly -- I recommend running
// `caffeinate -d` from the command prompt or using an application like
// `Caffeine` to disable sleep if you're going to run it while AFK. Thankfully,
// it seems that as long as you confirm the action it will often still work.
//
// I don't write much JavaScript, but I much prefer it to AppleScript. This
// should be non-destructive, but use it at your own risk. Make sure you have
// tested and working backups.
//
// Runs in about 19 minutes for my library of 20,233 pictures on my 2014 MBA.
//
// Tested on:
// - MacOS 11.1, Photos 6.0
// - MacOS 13, Photos 8.0

'use strict'

// CUSTOMIZE
let getRidOfExtension = "jpg" // Only get rid of photos with this extension
let dupFolderName = "Duplicates"
let logInterval = 100

let criteria = [
    // "favorite",
    "width",
    // "pcls", // not sure what this is
    // "size", // not recommended -- heic and jpg will have different sizes
    // "location", // [123.456, -78.9]
    // "keywords",
    "height",
    // "description",
    // "altitude",
    // "name", // often not set, not the same as filename
]
// END CUSTOMIZE

function log(obj) {
    console.log(JSON.stringify(obj))
}

function getDetails(photo) {
    let properties = photo.properties()

    let details = {
        "extension": properties["filename"].toLowerCase().split(".").slice(-1)[0],
        "timestamp": properties["date"].getTime() / 1000, // in seconds
    }

    for (let criterion of criteria) {
        details[criterion] = properties[criterion]
    }
    return details
}

function run(argv) {
    let tsForAlbum = Date.now().toString()

    const photos = Application('Photos')
    let selection = photos.selection()
    let selectionLength = selection.length
    if (selectionLength < 2) {
        throw new Error("Not enough photos selected")
    }

    let getRidOfExtensionLower = getRidOfExtension.toLowerCase()
    // { filename-sans-extension: [ {'selectionIdx': idx1, 'timestamp': ts, "extension": ext } ] }
    let photomap = {}
    let duplicates = []
    for (let selectionIdx in selection) {
        if (selectionIdx % logInterval == 0) {
            console.log("Processing " + selectionIdx + " of " + selectionLength)
        }
        let photo = selection[selectionIdx]

        // Skip it we can't get the filename; this can happen with photostream
        // items that are in your library because they were shared with you
        // (which you didn't take yourself)
        let filename
        try { filename = photo.filename() } catch (e) { continue }

        // This script only intended for jpg and heic
        let lowername = filename.toLowerCase()
        if (!(lowername.endsWith(".jpg") || lowername.endsWith(".heic"))) {
            continue
        }
        ``
        let details = getDetails(photo)
        details['selectionIdx'] = selectionIdx

        let stem = filename.replace(/(\.JPG$)|(\.HEIC$)/i, "")
        if (!(stem in photomap)) {
            photomap[stem] = [details]
            continue
        }

        photomap[stem].push(details)
        let sameStem = photomap[stem]

        // filter for timestamps within 10 seconds of the current photo
        let timestamp = details['timestamp']
        let similarTimes = sameStem.filter(otherDetails => {
            let ts = otherDetails['timestamp']
            if (Math.abs(timestamp - ts) < 10) {
                return true
            }
            return false
        })
        let detailsMatch = similarTimes.filter(otherDetails => {
            let keys = Object
                .keys(otherDetails)
                .filter(key => !(["timestamp", "extension", "selectionIdx"].includes(key)))
            for (let key of keys) {
                if (details[key] != otherDetails[key]) {
                    return false
                }
            }
            return true
        })

        // If filtering heic / jpg duplicates, we want to make sure there is at
        // least one of each filetype before we decide to filter the other out,
        // otherwise we might e.g. end up filtering both copies of duplicate
        // [jpg, jpg] (if configured to keep heic). Because this script only
        // puts *one* copy into the duplicates folder, which facilitates mass
        // deletion, this otherwise could end up causing unexpected data loss
        // if users aren't paying attention.
        let keepPhotos = detailsMatch.filter(each => each["extension"] != getRidOfExtensionLower)
        if (keepPhotos.length < 1) {
            continue
        }

        // Should always match itself
        if (detailsMatch.length > 1) {
            (
                detailsMatch
                    .filter(details => details['extension'] == getRidOfExtensionLower)
                    .map(details => {
                        let sidx = details['selectionIdx']
                        duplicates.push(selection[sidx])
                })
            )
        }
    }

    console.log("Found " + duplicates.length + " suspected duplicate[s]")
    if (duplicates.length == 0) {
        return
    }

    let duplicatesFolder = photos.folders.byName(dupFolderName)
    if (!duplicatesFolder.exists()) {
        photos.make({new: "folder", named: dupFolderName})
    }
    let album = duplicatesFolder.albums.byName(tsForAlbum)
    if (!album.exists()) {
        photos.make({new: "album", named: tsForAlbum, at: duplicatesFolder})
    }
    photos.add(duplicates, {to: album})
    console.log("Duplicates added to " + dupFolderName + "/" + tsForAlbum)
}
