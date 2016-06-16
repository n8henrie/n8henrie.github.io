---
id: 1837
title: My GoodMorning.app Automator Routine
date: 2012-12-16T10:05:23+00:00
author: n8henrie
excerpt: Most Apple computers released after 2005 (OSX 10.4) include "Automator.app," which you can use to – you guessed it – do things automatically. It has a user-friendly interface that most people could learn without much trouble.
layout: post
guid: http://www.n8henrie.com/?p=1837
permalink: /2012/12/my-goodmorning-app-automator-routine/
al2fb_facebook_link_id:
  - 506452318_10151289800747319
al2fb_facebook_link_time:
  - 2012-12-16T17:05:25+00:00
al2fb_facebook_link_picture:
  - featured=http://www.n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 977676720
---
**Bottom Line:** This post is about an Automator script that I have run every day before I wake up to make sure my computer is up and running by the time I am.
  
<!--more-->

Most Apple computers released after 2005 (OSX 10.4) include &#8220;Automator.app,&#8221; which you can use to – you guessed it – do things automatically. It has a user-friendly interface that most people could learn without much trouble.

One of the first things I did with Automator was to make a &#8220;GoodMorning&#8221; script that gets a few things going before I wake up. Honestly, one of the main motivators for me was to make getting up and out of the house as quick as possible during my clinical rotations. However, [Checklist Manifesto](http://www.amazon.com/gp/product/0312430000/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0312430000&linkCode=as2&tag=n8henriecom-20) style, I _do_ generally like to glance over my task list and calendar before I leave the house. This script helped make sure that those apps were already launched and on-screen, ready for a once-over before I head out the door.

Also, if you can&#8217;t tell, I love to tinker.

Here&#8217;s the gist of the Automator workflow, let me know if you have questions on any of the steps, and I can go into specifics.

  1. &#8220;Set Computer Volume&#8221; – Makes sure my slumber isn&#8217;t prematurely disturbed by any sounds.
  2. &#8220;Quit Application&#8221; Flux.app – An app that tints my screen at night to supposedly not disturb melatonin / biorhythm as much.
  3. &#8220;Run AppleScript&#8221; UpdateiOSApps.scpt – see [my post on automating iOS app updates](http://www.n8henrie.com/2012/12/applescript-to-update-ios-apps-in-itunes/).
  4. &#8220;Launch Application&#8221; OmniFocus.app
  5. &#8220;Launch Application&#8221; Calendar.app
  6. &#8220;Get Specified URLs&#8221; omnifocus:///perspective/Due – A special URL supported by OmniFocus that goes to my &#8220;Due&#8221; tasks
  7. &#8220;Display Webpages&#8221; – Needed to use #6.
  8. &#8220;Run AppleScript&#8221; Sync iOS Devices.scpt – see [my post on syncing iOS devices with AppleScript](http://www.n8henrie.com/2011/12/applescript-to-sync-ios-devices-in/).
  9. &#8220;Run AppleScript&#8221; tell application &#8220;OmniFocus&#8221; to activate – makes sure my tasklist is frontmost. If I only have time to glance at one thing before running out the door to the hospital, this is it.

That&#8217;s it! Previously, I had running Mail.app in there, but my school discontinued IMAP support for our school email, so that&#8217;s no longer necessary. There are a few ways to get this to run automatically. One is to save it as a calendar alarm (one of the options in the Save dialog), which makes a special &#8220;Automator&#8221; calendar with events that run the workflow. The big advantages of doing it this way is the simplicity of scheduling custom repeats and changing times; if you want it to run M-F at 04:00 and S/Su at 07:00, most people can figure out how to do that on a calendar.

Currently, I have it running with a custom LaunchAgent .plist that is scheduled by a process called launchd. It&#8217;s a bit more work this way, but I had some trouble getting the scripts to run after updated from 10.7 to 10.8 due to some security settings. One quick tip here: save the workflow as an application and direct the .plist to the &#8220;Application Stub&#8221; in the application contents (right click -> show contents). Here: &#8230;/GoodMorning.app/Contents/MacOS/Application Stub .