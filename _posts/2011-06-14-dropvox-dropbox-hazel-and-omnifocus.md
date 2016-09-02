---
id: 57
title: DropVox, DropBox, Hazel, and OmniFocus
date: 2011-06-14T02:39:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=57
permalink: /2011/06/dropvox-dropbox-hazel-and-omnifocus/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2011/06/dropvox-dropbox-hazel-and-omnifocus.html
blogger_images:
  - 1
dsq_thread_id:
  - 812645444
disqus_identifier: 57 http://n8henrie.com/?p=57
tags:
- applescript
- automation
- dropbox
- GTD
- iPhone
- Mac OSX
- mobile
- OmniFocus
- productivity
- SMRT
categories:
- tech
---
This will probably not make any sense to the majority of my friends and family, but an inexpensive but ingenious iPhone app DropVox has inspired me to make a quick post to highlight how I put it to use.  First, a very quick introduction to each of the components; honestly they each deserve their own post, but time constraints… you know.

## <a href="http://www.omnigroup.com/products/omnifocus" title="OmniFocus" target="_blank">OmniFocus</a>

For starters, I use OmniFocus as my primary task manager.  If you haven’t checked it out, the main reasons I love it are:

Excellent cloud sync with native iPhone app

- Quick Entry Shortcut
- Context support
- Start date support
- Repeating tasks support
- Scriptable (see below)
- Stable

The biggest thing it lacks IMO is task sharing.  However, I don’t expect many of my peers to plunk down the cash for OF in the first place, so I use <a href="http://www.6wunderkinder.com/wunderlist" title="Wunderlist" target="_blank">WunderList</a> (free) for shared tasklists.

The OmniFocus iPhone app has great features like “Map” mode, where you can assign locations to contexts, and it will sort your available tasks by distance from you, as will as letting you take pictures and voice memos and attach them to your tasks.

## <a href="http://www.noodlesoft.com/hazel.php" title="Hazel" target="_blank">Hazel</a>

Hazel is like folder actions on steroids.  (“Folder actions” is a neat tool that Apple built into OSX that lets you “do something” every time a file is added to a particular folder.)  I use it to do things like “take every file I’ve downloaded or on my desktop that is over 1h old and <5MB and copy it to a particular folder in my DropBox ("DumpBox").  Then take any file in that folder that's over 2w old and trash it.  In combo with DropBox iPhone (or webapp), this has come in handy countless times, almost eliminating those "Dang, wish I had that file I just downloaded!" moments.  Of note, Hazel can also do cool things like run an applescript or set a Growl notification when it is invoked.

## <a href="https://www.dropbox.com/" title="DropBox" target="_blank">DropBox</a>

If you don’t know about DropBox… well, you’ll have to read about it somewhere else.  I’ll just quickly note that DropBox + GoodReader (iPhone) + Hazel make a killer combo for remote-controlling my MBP from my iPhone.  For example, I can upload a file via GoodReader to a DBox folder that matches a Hazel script which runs an applescript… possibilities are endless.

## <a href="http://www.irradiatedsoftware.com/dropvox/" title="DropVox" target="_blank">DropVox</a>

DropVox (iOS) does one thing… awesome.  I have it set so that I click (press?) the app, it launches straight to recording mode.  I speak, click stop — it automatically uploads to a preset DropBox folder.  Just like that.  The newest update even lets it upload in the background.  Beautiful.

## Putting it all together…

While OmniFocus iPhone is overall excellent, its voice memo implementation is lacking.  Not only does it take a bit longer to press ~3 buttons (including some scrolling) to get to the OF voice recorder, most importantly, I have to look at my iPhone to do it.  Compared with 1-click DropVox — well, there is no comparison, I guess.  However, I want those voice memos to get into OF so I remember to process them.  Can you see where this is going?

DropVox uploads to a particular DropBox folder, which syncs to my Mac, which Hazel monitors and runs an applescript (below) that imports it into OmniFocus.  Best part is, if my MBP isn’t running or isn’t on WiFi at the time, DropBox just holds onto everything until later.

## Shortcomings:

- The voice memo isn’t transcribed
- The voice memo isn’t playable by OF iPhone (which only likes some weird Apple loops format)

Together, this means that I have to manually process the audio files the next time I’m at my MBP (using spacebar to “quick look”).  Worth it for me.  An alternative is to use <a href="http://www.reqall.com/" title="ReQall" target="_blank">ReQall</a> or <a href="https://accounts.google.com/ServiceLogin?service=grandcentral&passive=1209600&continue=https://www.google.com/voice&followup=https://www.google.com/voice&ltmpl=open" title="Google Voice" target="_blank">Google Voice</a> and an email-to-Dropbox service (<a href="http://sendtodropbox.com" title="SendToDropbox" target="_blank">SendToDropbox</a>), as I’ve detailed ad nauseam at the OmniGroup forums in <a href="http://forums.omnigroup.com/showthread.php?t=11543" title="Voice to OmniFocus" target="_blank">this thread</a>.

Anyway, this post has taken too much time as is.  I have my surgery shelf Friday.  Time to hit the books!

## Applescript

(Note that I have Hazel trash the original file after running this script.)

<script src="http://pastebin.com/embed_js.php?i=i0gErCpx"></script>
