---
id: 19
title: Applescript for Numbered Tasks in OmniFocus
date: 2012-04-30T16:00:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=19
permalink: /2012/04/applescript-for-numbered-tasks-in/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/04/applescript-for-numbered-tasks-in.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 812154017
disqus_identifier: 19 http://n8henrie.com/?p=19
tags:
- applescript
- automation
- OmniFocus
- productivity
categories:
- tech
---
I've <a href="http://www.n8henrie.com/search/label/OmniFocus" target="_blank">written a few times about OmniFocus</a>, my task manager of choice.  One of the things I love about it is that you can expand its impressive toolset with <a href="https://en.wikipedia.org/wiki/Applescript" target="_blank">Applescript</a>, which comes built-in to every Mac.  You can drag and drop your scripts into ~/Library/Scripts/Applications/OmniFocus and OmniFocus will even make them into handy buttons that you can put on your toolbar.

For example, in my medical school rotations, I am frequently assigned tasks that I have to accomplish a certain number of times.  To keep track of my progress, what I've previously done is the following.

1. Create a task and give it a descriptive name
1. Duplicate the task however many times I need to do it
1. Append a number to each
1. Group the tasks (edit -> outlining -> group)
1. Set the group to "sequential" instead of parallel

If I were assigned to do 10 History and Physicals by the end of a rotation, my resulting tasks might look something like this.

- History and Physical 1
- History and Physical 2
- History and Physical 3

Since I set them to *sequential*, OmniFocus will automatically hide all the unavailable ones so that only the "next" one shows up in my active perspective (assuming I have the filter set to "available").  This makes it as simple as can be to see that I need to work on "History and Physical 7" without crowding my active tasks with 8-10.  Without the numbering, I'd only see "History and Physical" tasks without the number to remind me how far along I am, how many more are left (I suppose I could number them 7 / 10 or something).

I use this workflow of creating numbered tasks often enough that I decided to try to write a little script for it.  10 tasks isn't so bad to do manually, but this seemed easy to automate.  Perhaps I'll use it more often now for tasks that may need to be done 100s of times.

I don't know a whole lot of Applescript, so please forgive me if this is horribly written, but it seems to work.  It simply prompts for a task name, how many times the task needs to be done, and has the option to include a task note, since I often include hyperlinks in tasks that have to be done online (like virtual cases).  The tasks are simply placed in the inbox, since I find it just as fast to "select all" and use the inspector or drag-and-drop to group, assign projects, contexts, time estimates, etc.  *Suggestions for improvement are much appreciated.  Please leave them in the comments section below.*

[Download this Applescript](http://cl.ly/2i0q1U1e1s0c322X3X2k)

```applescript
on run {}
set counter to 0
set theTask to text returned of (display dialog "This script will duplicate a task a given number of times and number the tasks accordingly." default answer "Please enter the name of the task.")
try
set repeatTimes to text returned of (display dialog "How many total times do you need to do this task?" default answer "Please enter a number with no text and no punctuation.") as integer
on error
display dialog "Whups, I don't think that worked.  Try an integer next time."
return
end try
set taskNote to text returned of (display dialog "If you'd like the task to have a note, enter it below." default answer "") as string
tell application "OmniFocus"
launch
tell document 1
repeat repeatTimes times
set counter to counter + 1
set taskName to {(theTask as string) & " " & (counter as string)} –Probably could add " / " & repeatTimes or something like that to show out of how many times total
set newTask to make new inbox task with properties {name:taskName, note:taskNote}
end repeat
end tell
end tell
end run
```

Feel free to use and modify.  If you do, I appreciate links back to my blog / original posts.  Hope some of you find this useful!
