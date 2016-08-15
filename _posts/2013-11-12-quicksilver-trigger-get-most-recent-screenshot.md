---
id: 2422
title: 'Quicksilver Trigger: Get Most Recent Screenshot'
date: 2013-11-12T11:03:24+00:00
author: n8henrie
excerpt: Use this Python script as a Quicksilver trigger to quickly get the most recent screenshot.
layout: post
guid: http://n8henrie.com/?p=2422
permalink: /2013/11/quicksilver-trigger-get-most-recent-screenshot/
dsq_thread_id:
  - 1960703908
disqus_identifier: 2422 http://n8henrie.com/?p=2422
---
**Bottom Line:** Use this Python script as a Quicksilver trigger to quickly get the most recent screenshot.<!--more-->

This is one of the more useful Python scripts I’ve written in a while. It simply returns to Quicksilver the most recently modified file with a given extension in a given directory. I use it to grab my most recent screenshot from a Dropbox folder I have set up to receive them. Set it up as a Quicksilver trigger with a hotkey, and it makes the process of

  * taking a screenshot
  * pulling it up into Quicksilver
  * either dragging it back out (onto a web form), or 
  * using Quicksilver to process the image

into a snap. For me, it certainly beats having to dig through to my screenshots folder, or having my screenshots clutter up my desktop.

It is written in Python 3 but could likely work in Python 2.7 without much modification. It does rely on either <a target="_blank" href="https://pypi.python.org/pypi/py-applescript/">py-applescript</a> or subprocess + <a target="_blank" href="http://qsapp.com/plugins.php">Quicksilver Command Line Tool Plugin</a>, and can be set to use either one with an option in the script.

I recommend you get the script running on its own (can be run independently in your code editor of choice), then add it as a Quicksilver trigger (action `Run [...]`) and benefit.