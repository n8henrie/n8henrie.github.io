---
id: 41
title: Applescript to Sync iOS Devices in iTunes
date: 2011-12-09T23:56:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=41
permalink: /2011/12/applescript-to-sync-ios-devices-in/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2011/12/applescript-to-sync-ios-devices-in.html
blogger_images:
  - 1
dsq_thread_id:
  - 812402995
---
<div>
  Found a <i>great</i> applescript the other day, and thought I might as well start posting my favorites / most useful scripts that I come  across.  I found this one [<a href="http://hints.macworld.com/article.php?story=20080423220708741">here</a>] at Macworld.  Super simple little script, just triggers a sync on any iOS devices you have connected to iTunes.  So far it seems to work great, even over WiFi, and simultaneously triggers both my iPhone and iPad to sync.
</div>

<div>
</div>

<div>
  I stick all these scripts into a specific folder (which I keep in my <a href="https://www.dropbox.com/">Dropbox</a> to sync across devices and keep a version history), and I use <a href="http://qsapp.com/">QuickSilver</a> to call them.  With this one, for example, I can just call QuickSilver and type &#8220;Sync iOS&#8221; (which is what I named the script) and push enter.  Significantly easier than 
</div>

<div>
</div>

  1. running iTunes
  2. switching windows from whatever I&#8217;m doing
  3. clicking on my phone
  4. clicking &#8220;sync&#8221;
  5. clicking on my iPad
  6. clicking &#8220;sync&#8221;
  7. returning to whatever window I was working in

<div>
  As an additional benefit, I can schedule this script to run at a given time, when triggered by another program, or however I want with tools like <a href="http://code.google.com/p/cronnix/">Cronnix</a>, <a href="http://www.noodlesoft.com/hazel.php">Hazel</a>, etc.  Anyways, here&#8217;s the script:
</div>

> tell application &#8220;iTunes&#8221;  
> repeat with s in sources  
> if (kind of s is iPod) then update s  
> end repeat  
> end tell

Oh, one last thing.  If you copy this script into ~/library/itunes/scripts (this folder might not exist, I had to create it), it will conveniently show up in your iTunes menu (see below).  Because this folder won&#8217;t be indexed in QuickSilver, you can either just put an _extra_ copy there and keep the other somewhere that QuickSilver searches, or add that folder in your QuickSilver catalog. 

<div style="clear: both; text-align: center;">
  <a href="http://www.n8henrie.com/uploads/2012/09/ScreenShot2011-12-09at5.16.27PM.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="31" src="http://www.n8henrie.com/uploads/2012/09/ScreenShot2011-12-09at5.16.27PM.jpg" width="320" /></a>
</div>

<div>
</div>