---
id: 17
title: 'Set a Running App’s Priority on your Mac'
date: 2012-06-09T01:11:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=17
permalink: /2012/06/set-running-apps-priority-on-your-mac/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/06/set-running-apps-priority-on-your-mac.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 811661374
disqus_identifier: 17 http://n8henrie.com/?p=17
---
I use <a href="http://handbrake.fr/" target="_blank">Handbrake</a> to convert video files all the time.  It works great.  Unfortunately, converting videos takes a lot of computer power, and my trust Macbook Pro is getting a little old (nearly 3 years since I bought it — that’s like middle aged in computer years).  That means that when I try to convert a video and simultaneously work on other stuff, things get a little choppy, and sometimes downright unusable.

Luckily, OSX has a built-in command in Terminal that lets you reset an app’s priority.  It’s called the “renice” command, and <a href="http://forums.macrumors.com/archive/index.php/t-126007.html" target="_blank">here’s a thread all about it</a>.  While I’m learning to use Terminal, I still find a <a href="http://en.wikipedia.org/wiki/Graphical_user_interface" target="_blank">GUI</a> much easier.  Unfortunately, several of the apps featuring a GUI won’t run on OSX Lion.  However, I found an Applescript in <a href="http://hintsforums.macworld.com/showthread.php?t=1310" target="_blank">this thread</a> that seems to do the trick!

I changed a few things and packaged it up as both an Applescript (for those of you that might want to tweak it more), and an application (for those of you that want to just click and have it work).  Seems to be working — I turned Handbrake down to 10, and I’m suddenly able to get work done in the meantime.  My understanding is that this will make the conversion slower while I’m working on my comp, but that when things quiet down, it will go back to full throttle using Handbrake, since there are no active higher priority jobs.  Note the range **from -20 to 20**, where positive numbers will _decrease_ the priority and negative numbers _increase_ the priority, with the default priority right in the middle at 0. 

Feel free to comment below, and enjoy!

Downloads:  
<a href="http://cl.ly/0v0m1H0W2X0X1K2u010e" target="_blank">Set App Priority.scpt</a>  
<a href="http://cl.ly/1g0o3M2n0v3h0K152E3V" target="_blank">Set App Priority.app</a>

<div>
</div>