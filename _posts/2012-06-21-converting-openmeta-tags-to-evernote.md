---
id: 15
title: Converting OpenMeta Tags to Evernote Tags
date: 2012-06-21T01:48:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=15
permalink: /2012/06/converting-openmeta-tags-to-evernote/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/06/converting-openmeta-tags-to-evernote.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 813171675
disqus_identifier: 15 http://n8henrie.com/?p=15
tags:
- applescript
- automation
- Mac OSX
- productivity
categories:
- tech
---
**Bottom line:** This is an Applescript I pieced together from forum posts and tweaked to get it to **import files with OpenMeta tags into Evernote while retaining the file tags and created / modified dates.**

<!--more-->

I find it useful to have an “everything bucket” archive where I can stick my files that are not in active use and may _or may not_ ever be useful again. Things like receipts, warranty paperwork, tax documents, instruction manuals, old reference files for schoolwork, and tons of other random tidbits go in here. That’s why it’s an **everything** bucket – because anytime I need one of those old files, I know exactly where it will be.

### Folders vs Tags

Some people can get away with a folder. However, once you get up to several hundred files, it can be difficult to efficiently find the file you need. You can use hierarchical folders, but then you have to decide how to divide things up. You could make folders based on the date a file was created or last needed, but what if you don’t remember this info by the time you need it? I tried using folders like “School” “Financial” “Personal” “Taxes” etc., but then I’d have to decide whether things like my medical school loans go in “school” or in “financial”, and I’d encounter the same predicament when trying to find those files.

That’s why I prefer a tag-based solution. You can think of tags as “the ability to put a file in multiple folders simultaneously.” So the loans can be found both under the “school” tag, and the “financial” tag – whichever I feel like searching under. The biggest problem with tags is that _file tagging support isn’t built-in to Mac OSX_. This means you have to find a third party app to do the tagging. This also means that if that app quits being supported in the future, you might be hosed (probably not losing your files, of course, but possibly losing their structure of organization). Many of these apps use a popular open-source project called <a target="_blank" href="http://code.google.com/p/openmeta/">OpenMeta</a> to do the tagging. If someone wants to explain this better, feel free to comment below, but I’m going to leave it at that for now.

### Evernote and OpenMeta

I’ve been using a tagging app that I like for a couple years, but it lacks mobile access and a few other features I’d like to have, so I decided to give <a target="_blank" href="http://evernote.com">Evernote</a> another shot. I’ve tried Evernote previously, and it didn’t quite _click_ for me, but it’s come a long way since then. One problem with switching to Evernote is that it doesn’t natively support importing OpenMeta tags. This means I would lose all of my file organization in the switch. Luckily, after quite a bit of Google work and hours of tweaking, I was able to modify a few Applescripts that I found posted around the web and fashion a script that would read the OpenMeta tags, import the files, and re-tag them. Because I’m using the free version of Evernote, which puts a relatively small data limit on uploads for free users, I made a local-only notebook in Evernote and used it for the initial bulk import of files. Do this by editing the “targetNotebook” line in the script. Now, I can drag and drop notes (files) from this local Evernote notebook to a synchronized one if I want mobile access to that note.

Now, I’m a heavy user and supporter of <a target="_blank" href="http://www.noodlesoft.com/" title="Hazel">Noodlesoft Hazel</a>, which I have set up to monitor my everything bucket. When it finds a new file, it runs the script below (as an embedded script), which imports the file into Evernote, including all the OpenMeta tags, and it also retains the file modification and creation dates (which I found very handy). This script depends on <a target="_blank" href="http://code.google.com/p/openmeta/downloads/list" title="OpenMeta">having OpenMeta installed</a> and having tagged your files with an app that uses OpenMeta tags.

For those of you that don’t use Hazel… I recommend you give it a shot. If you’ve gotten to this point in this post… you’d probably like it. If it’s not your thing, feel free to adapt the script below to fit your needs. I pieced it together from forum posts and claim no rights to it.

_Most importantly, make sure you test out the script and get it working properly on your system before you mess with important files. I had plenty of quirks to get it to work well for me, so please use caution and judgment – side effects may include data loss, weight gain, hours of sleep you can never get back, etc._

Download this script [here](http://cl.ly/0U1g1e1L3D2v0h1F2P1l).

```applescript
--Find original post here: http://n8henrie.com/2012/06/converting-openmeta-tags-to-evernote/
-- set theFile to alias “YourHDName:Users:YourUserName:Path:To:TestFile.pdf” –uncomment this line  for testing in Applescript Editor!
local importedFrom, targetNotebook, openmeta, tagtext, taglist, tid
--Which notebook do you want the notes to end up in? **Case Sensitive**
set targetNotebook to “Inbox”
--Add a tag to tell what app the files were imported from
set importedFrom to “from_Leap”
--Set openmeta location to wherever you have installed openmeta
set openmeta to “/usr/local/bin/openmeta”
--Get tags as one big string
set tagtext to do shell script openmeta & ” -t -p ” & quoted form of POSIX path of theFile
--Remove file path from tags (don’t know why openmeta includes this as a tag)
set filePath to POSIX path of theFile
set pathOffset to offset of filePath in tagtext
set tagtext to (strings 1 thru (pathOffset – 2) of tagtext) & ” ” & importedFrom
set tid to AppleScript‘s text item delimiters
set AppleScript‘s text item delimiters to {” “}
set taglist to the words of tagtext
-- display dialog “taglist: ” & return & taglist & return & return & “tagtext: ” & return & tagtext
--Change the TIDs back
set AppleScript‘s text item delimiters to tid
--preserve the original created and modified dates of the files
tell application “Finder”
set createdFileDate to (the creation date of (theFile as alias))
set modFileDate to (the modification date of (theFile as alias))
end tell
tell application “Evernote”
launch
set theItem to create note from file theFile notebook targetNotebook tags taglist created createdFileDate
set (modification date of theItem) to modFileDate
end tell
```
