#!/usr/bin/osascript -l JavaScript
// find_duplicate_photos.js
// https://n8henrie.com/2021/02/find-duplicate-photos-in-macos-photosapp/
//
// Quickstart:
//   - Copy this into a file, e.g. `find_duplicate_photos.js`
//      - Alternatively, check the post above for a download link
//   - Modify the configuration in the `CUSTOMIZE` section if desired
//   - Make executable: `chmod +x find_duplicate_photos.js`
//   - Select a set of photos in Photos.app
//   - ./find_duplicate_photos.js
//   - Process the suspected duplicates in `Duplicates/timestamp`
//
//  Alternatively, users not comfortable with the command line can:
//    - open `Script Editor.app` on their Mac
//      - `/System/Applications/Utilities/Script Editor.app` on Big Sur
//    - create a new script
//    - Change the language to JavaScript if they see `AppleScript` displayed
//      near the top left
//    - Copy and paste the contents of this script
//    - You will need to compile with `command` + `k` (or the hammer button) in
//      between each run or else you will get `Error: SyntaxError: Can't create
//      duplicate variable:`
//
// Uses `criteria` in the `CUSTOMIZE` section to find likely duplicates from a
// selected set of photos in MacOS Photos.app and moves those duplicates to an
// album named by the unix timestamp at the time of running within a folder
// named `Duplicates`. These can then be inspected, and a duplicate can be
// deleted if desired with `command` + `delete`. NB: Both copies of the
// duplicate are put into the album to facilitate inspection, be careful not to
// accidentally delete both. Once you are done processing duplicates, right
// click and delete the Duplicates folder, which should not delete the
// remaining media items contained therein.
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
// Runs in under 14 minutes for my library of 20,233 pictures on my 2014 MBA.
//
// Tested on MacOS 11.1, Photos 6.0

'use strict'

// CUSTOMIZE
let dupFolderName = "Duplicates"
let criteria = [
    "filename",
    "size",
    // "favorite",
    // "width",
    // "pcls", // not sure what this is
    // "location", // [123.456, -78.9]
    // "keywords",
    // "height",
    // "description",
    // "altitude",
    // "name", // often not set, not the same as filename
    // "date",
]
// END CUSTOMIZE

function getDetails(photo)  {
    let properties = photo.properties()

    var details = {}
    for (let criterion of criteria) {
        details[criterion] = properties[criterion]
    }

    return JSON.stringify(details)
}

function run(argv) {
    let ts = Date.now().toString()

    const photos = Application('Photos')
    var selection = photos.selection()
    if (selection.length < 2) {
        throw new Error("Not enough photos selected")
    }

    var seendetails = new Set()
    var duplicatedetails = new Set()
    var alldetails = []
    for (var idx in selection) {
        if (idx % 1000 == 0) {
            console.log("Gathering set of duplicates: " + idx + " / " + selection.length)
        }
        var photo = selection[idx]
        var details = getDetails(photo)

        if (seendetails.has(details)) {
            duplicatedetails.add(details)
        }
        seendetails.add(details)
        alldetails.push(details)
    }

    var duplicates = []
    for (var idx in selection) {
        if (idx % 1000 == 0) {
            console.log("Comparing against duplicates: " + idx + " / " + selection.length)
        }
        var details = alldetails[idx]
        if (duplicatedetails.has(details)) {
            var photo = selection[idx]
            duplicates.push(photo)
        }
    }
    console.log("Found " + duplicates.length + " suspected duplicates")
    if (duplicates.length == 0) {
        return
    }

    let duplicates_folder = photos.folders.byName(dupFolderName)
    if (!duplicates_folder.exists()) {
        photos.make({new: "folder", named: dupFolderName})
    }
    let album = duplicates_folder.albums.byName(ts)
    if (!album.exists()) {
        photos.make({new: "album", named: ts, at: duplicates_folder})
    }

    photos.add(duplicates, {to: album})
    console.log("Duplicates added to " + dupFolderName + "/" + ts)
}
