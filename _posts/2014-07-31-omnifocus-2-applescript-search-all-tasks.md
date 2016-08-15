---
id: 2579
title: 'OmniFocus 2: AppleScript to Search All Tasks'
date: 2014-07-31T11:00:42+00:00
author: n8henrie
excerpt: A few tweaks to my OmniFocus 2 "Search All Tasks" AppleScript.
layout: post
guid: http://n8henrie.com/?p=2579
permalink: /2014/07/omnifocus-2-applescript-search-all-tasks/
dsq_thread_id:
  - 2889121412
disqus_identifier: 2579 http://n8henrie.com/?p=2579
---
**Bottom Line:** A few tweaks to my OmniFocus 2 &#8220;Search All Tasks&#8221; AppleScript.<!--more-->

Most of my readers know I&#8217;m a big fan of [OmniFocus](http://n8henrie.com/tag/omnifocus/ "OmniFocus - n8henrie.com"). Lately I&#8217;ve been trying to get used to <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus-2/id867299399?mt=12&uo=4&at=10l5H6" title="OmniFocus 2">OmniFocus 2</a>, with a few little bumps along the way. One issue was that I had an AppleScript to search all tasks that I used all the time in OmniFocus (1) that quit working.

The script is a standalone AppleScript that I run with a <a target="_blank" href="http://qsapp.com/" title="Quicksilver — Mac OS X at your Fingertips">Quicksilver</a> trigger, but would work equally well with whatever hotkey / keyboard shortcut setup you prefer. Because the script first activates OmniFocus, I can invoked this from whatever screen or app I&#8217;m using, and it appropriately bring OmniFocus into focus and finds the task in question. It&#8217;s without a doubt my most used OmniFocus script, so having it broken was a bummer.

Luckily for me, a few of the kind folks at the new OmniGroup forums <a target="_blank" href="https://discourse.omnigroup.com/t/applescript-request-one-click-search-all/3693">helped me out</a> and got it mostly working again. However, today I realized that, presumably due to the new way OmniFocus 2 separates the inbox from projects, the script was appropriately searching &#8220;all projects&#8221; but missing tasks in the inbox &#8212; which didn&#8217;t used to be a problem.

I decided to tinker around a bit, and as usual got frustrated with AppleScript (Python just makes everything else seem so difficult). Then, I realized that instead of trying to script all of the view options to ensure all tasks were visible (including the inbox), I could just make a new perspective, set all my view options with the GUI. Then, all I had to do was figure out how to activate the perspective in the script, which wasn&#8217;t too bad.

I added two new perspectives, one to search all tasks (including completed), and one to search only remaining tasks (default). As currently written, **you have to name the perspective the same thing as the button names in the script** (`Search Remaining` and `Search All` as currently written), but that could easily be changed if you wanted. The settings I used for my perspectives are in the comments at the top of the script.

It seems to work great and really simplifies the AppleScript. Only other thing I really changed was to move the dialog to the beginning of the script, so if you accidentally invoke it or change your mind, it will cancel before stealing your focus and activating OmniFocus.

Let me know what you think. Thanks to Sven Luetkemeier and Rob Trew for their effort on (much fancier) earlier versions.