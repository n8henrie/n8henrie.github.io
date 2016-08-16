---
id: 2227
title: AppleScript to Export from iWork
date: 2013-05-02T23:16:07+00:00
author: n8henrie
excerpt: iWork is iWork… but truth be told, I need to export to some other format (.doc, .pdf, .csv, .xls, .ppt) much more often than I can actually use an iWork format for anything, or at least as the end product. I also dislike that there is no default keyboard shortcut for “Export.”
layout: post
guid: http://n8henrie.com/?p=2227
permalink: /2013/05/applescript-to-export-from-iwork/
dsq_thread_id:
  - 1256987071
disqus_identifier: 2227 http://n8henrie.com/?p=2227
tags:
- applescript
- Mac OSX
- Quicksilver
categories:
- tech
---
**Bottom Line:** I wrote an AppleScript to export from iWork (Pages, Numbers, Keynote) without having to touch the mouse or go through the menu. <!--more-->

iWork is iWork… but truth be told, I need to export to some other format (.doc, .pdf, .csv, .xls, .ppt) much more often than I can actually use an iWork format for anything, or at least as the end product. I also dislike that there is no default keyboard shortcut for “Export.”

As a workaround, I whipped up a quick AppleScript that uses UI Scripting to click the “Export” button of the frontmost iWork app, then it displays a list of export options. The beauty of it is that:

  * I can set it up as a <a target="_blank" href="http://qsapp.com/" title="Quicksilver - Mac OS X at your Fingertips">Quicksilver</a> trigger to launch it instantly without having to leave the keyboard.
  * I can type the first letter of the export type and the selection jumps to it.

You may still need to do some clicking around to set the options for whatever type you’ve chosen to export, but it will save you a bit of time. If this is something you do often, it may end up saving you some time in the long run, especially since you didn’t have to invest the 30 minutes or so it took me to write. <a target="_blank" href="http://xkcd.com/1205/">Based on xkcd</a>, I might even recoup that time… eventually.