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
yourls_shorturl:
  - http://n8henrie.com/n8urls/4b
dsq_thread_id:
  - 977601006
---
**Bottom Line:** If you don&#8217;t like having to manually update iOS apps, here&#8217;s an AppleScript to automate the process.
  
<!--more-->

I&#8217;ve been thinking of trying to put together a script like this for a while. Unless I&#8217;m jailbroken, which I&#8217;m not at the moment, I really don&#8217;t ever hesitate to update my iOS apps. There are good reasons why you should not, on occasion (a buggy release that hasn&#8217;t been updated yet, a new version that loses features you need), so don&#8217;t go implementing this script without making sure you are okay with automatic app updates.

Additionally, the script is mostly using user interface (IU) scripting, which means it&#8217;s just telling OSX &#8220;where to click&#8221; and &#8220;what to type&#8221; instead of really telling it what to do programatically. This type of scripting is easy to break with updates, and doesn&#8217;t always work. For example, it&#8217;s the rough equivalent of telling your Mac &#8220;Okay, next go a little right. Now a little up. A little more right. Okay, click there!&#8221; and if any other application suddenly steals the screen&#8217;s focus, it can click in the wrong place. For these reasons, there are a lot of &#8220;delay&#8221; commands in this script (to give iTunes a chance to complete each step), and I&#8217;ve repeated a line to activate iTunes before nearly every action (to make sure it&#8217;s the frontmost app at the time of the click). As you can imagine, these UI Scripts don&#8217;t always work.

That said, it&#8217;s working for my in my testing. If you can improve on it (shouldn&#8217;t be hard), let me know.

I guess the other things to mention are:

  * After running this (and giving some time for the updated apps to download), I run a different script to automate syncing them over to my iPhone: [Applescript to Sync iOS Devices in iTunes](http://www.n8henrie.com/2011/12/applescript-to-sync-ios-devices-in/)
  * Both of these are included in my &#8220;GoodMorning.app&#8221; routine that I&#8217;ve put together with Automator, which I&#8217;ll briefly post about in a few minutes
  * To run an external AppleScript in Automator, I use this (as an embedded AppleScript)
  
    > try
  
    > run script &#8220;/POSIX/Path/To/Script.scpt&#8221;
  
    > end try 

Enough is enough. On to the script!

**Update May 25, 2013**: Script now hosted as a GitHub Gist <a href="https://gist.github.com/n8henrie/5649326" title="UpdateiOSApps.applescript at GitHub" target="_blank">here</a>.