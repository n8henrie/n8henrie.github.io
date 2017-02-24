---
id: 1831
title: AppleScript to Update iOS Apps in iTunes
date: 2012-12-16T09:25:51+00:00
author: n8henrie
excerpt: "I've been thinking of trying to put together a script like this for a while. Unless I'm jailbroken, which I'm not at the moment, I really don't ever hesitate to update my iOS apps. There are good reasons why you should not, on occasion (a buggy release that hasn't been updated yet, a new version that loses features you need), so don't go implementing this script without making sure you are okay with automatic app updates."
layout: post
guid: http://www.n8henrie.com/?p=1831
permalink: /2012/12/applescript-to-update-ios-apps-in-itunes/
al2fb_facebook_link_id:
  - 506452318_10151289744337319
al2fb_facebook_link_time:
  - 2012-12-16T16:25:56+00:00
al2fb_facebook_link_picture:
  - featured=http://www.n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 977601006
disqus_identifier: 1831 http://n8henrie.com/?p=1831
tags:
- applescript
- automation
- iPad
- iPhone
- iTunes
- Mac OSX
categories:
- tech
---
**Bottom Line:** If you don’t like having to manually update iOS apps, here’s an AppleScript to automate the process.

<!--more-->

I’ve been thinking of trying to put together a script like this for a while. Unless I’m jailbroken, which I’m not at the moment, I really don’t ever hesitate to update my iOS apps. There are good reasons why you should not, on occasion (a buggy release that hasn’t been updated yet, a new version that loses features you need), so don’t go implementing this script without making sure you are okay with automatic app updates.

Additionally, the script is mostly using user interface (IU) scripting, which means it’s just telling OSX “where to click” and “what to type” instead of really telling it what to do programatically. This type of scripting is easy to break with updates, and doesn’t always work. For example, it’s the rough equivalent of telling your Mac “Okay, next go a little right. Now a little up. A little more right. Okay, click there!” and if any other application suddenly steals the screen’s focus, it can click in the wrong place. For these reasons, there are a lot of “delay” commands in this script (to give iTunes a chance to complete each step), and I’ve repeated a line to activate iTunes before nearly every action (to make sure it’s the frontmost app at the time of the click). As you can imagine, these UI Scripts don’t always work.

That said, it’s working for my in my testing. If you can improve on it (shouldn’t be hard), let me know.

I guess the other things to mention are:

  * After running this (and giving some time for the updated apps to download), I run a different script to automate syncing them over to my iPhone: [Applescript to Sync iOS Devices in iTunes](http://www.n8henrie.com/2011/12/applescript-to-sync-ios-devices-in/)
  * Both of these are included in my “GoodMorning.app” routine that I’ve put together with Automator, which I’ll briefly post about in a few minutes
  * To run an external AppleScript in Automator, I use this (as an embedded AppleScript)

```applescript
try
    run script “/POSIX/Path/To/Script.scpt”
end try
```

Enough is enough. On to the script!

**Update May 25, 2013**: Script now hosted as a GitHub Gist <a href="https://gist.github.com/n8henrie/5649326" title="UpdateiOSApps.applescript at GitHub" target="_blank">here</a>.
<script src="https://gist.github.com/n8henrie/5649326.js"></script>
