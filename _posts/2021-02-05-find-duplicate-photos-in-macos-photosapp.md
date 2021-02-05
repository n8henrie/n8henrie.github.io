---
title: Find Duplicate Photos in MacOS Photos.app
date: 2021-02-05T13:22:00-07:00
author: n8henrie
layout: post
permalink: /2021/02/find-duplicate-photos-in-macos-photosapp/
categories:
- tech
excerpt: "Use this script to search for likely duplicate photos in Photos.app."
tags:
- applescript
- automation
- iPhoto
- javascript
- Mac OSX
- photo
---
**Bottom Line:** Use this script to search for likely duplicate photos in
Photos.app.
<!--more-->

My old Macbook Air is running painfully low on storage space this days, so I
dug into the AppleScript / JavaScript for Automation (JXA) interface for
Photos.app to try to put together a way to find duplicate photos.

I don't write much JavaScript, but I find it much easier to work with than
AppleScript.

I recently learned about adding the `#!/usr/bin/osascript -l JavaScript`
shebang, which allows you to store these scripts in a regular old `.js` file
(or whatever extension you prefer), give it executable permissions with `chmod
+x`, then you can run it from the command line like any other script. Works
great and really helpful for keeping in version control!

```javascript
#!/usr/bin/osascript -l JavaScript
// find_duplicate_photos.js
// https://n8henrie.com/2021/02/find-duplicate-photos-in-macos-photosapp/
//
// Quickstart:
//   - Copy this into a file, e.g. `find_duplicate_photos.js`
//   - Make executable: `chmod +x find_duplicate_photos.js`
//   - Optionally change criteria that suggests a duplicate in `getDetails`
//   - Select a set of photos in Photos.app
//   - ./find_duplicate_photos.js
//   - Process the suspected duplicates in `Duplicates/timestamp`
//
// Uses the criteria in `getDetails` to find likely duplicates from a selected
// set of photos in MacOS Photos.app. Moves those duplicates to an album named
// by the unix timestamp at the time of running within a folder named
// `Duplicates`. These can then be inspected, and a duplicate can be deleted if
// desired with `command delete`. NB: Both copies of the duplicate are put
// into the album to facilitate inspection, be careful not to accidentally
// delete both. Once you are done processing duplicates, right click and delete
// the Duplicates folder, which should not delete the remaining media items
// contained therein.
//
// I don't write much JavaScript, but I much prefer it to AppleScript. This
// should be non-destructive, but use it at your own risk. Make sure you have
// tested and working backups.
//
// Runs in just under 15 minutes for my library of 20,233 pictures on my 2014
// MBA.
//
// Tested on MacOS 11.1, Photos 6.0

'use strict'

function getDetails(photo)  {
    return JSON.stringify({
            "filename": photo.filename(),
            "size": photo.size(),
            // "date": photo.date(),
            // "favorite": photo.favorite(),
            // "name": photo.name(),
            // "description: photo.description(),
        })
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

    let duplicates_folder = photos.folders.byName("Duplicates")
    if (!duplicates_folder.exists()) {
        photos.make({new: "folder", named: "Duplicates"})
    }
    let album = duplicates_folder.albums.byName(ts)
    if (!album.exists()) {
        photos.make({new: "album", named: ts, at: duplicates_folder})
    }

    photos.add(duplicates, {to: album})
}
```
