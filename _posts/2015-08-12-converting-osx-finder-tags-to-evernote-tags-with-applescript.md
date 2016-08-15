---
id: 2749
title: Converting OSX Finder Tags to Evernote Tags with AppleScript
date: 2015-08-12T13:32:20+00:00
author: n8henrie
excerpt: "Here's a quick and dirty AppleScript to import files to Evernote and preserve their OS X Finder tags."
layout: post
guid: http://n8henrie.com/?p=2749
permalink: /2015/08/converting-osx-finder-tags-to-evernote-tags-with-applescript/
dsq_thread_id:
  - 4026763541
disqus_identifier: 2749 http://n8henrie.com/?p=2749
---
**Bottom Line:** Here’s a quick and dirty AppleScript to import files to Evernote and preserve their OS X Finder tags.<!--more-->

Several years ago I posted [this AppleScript for importing OpenMeta-tagged files to Evernote](http://n8henrie.com/2012/06/converting-openmeta-tags-to-evernote) with <a href="http://www.noodlesoft.com/hazel.php" target="_blank" title="Noodlesoft - Hazel">Hazel</a>. It’s not been particularly popular, which just over 1,000 unique pageviews since posted in 2012, but hopefully it’s been helpful to some.


![]({{ site.url }}/uploads/2015/08/20150812_20150812-ScreenShot-539.jpg)

At the time, I had been using an app called Leap to add OpenMeta tags to files. Apple gave <a href="https://support.apple.com/en-us/HT202754" target="_blank">Finder the ability to tag files</a> with Mavericks in 2013, which changed things considerably — no longer do people need to use a 3rd party app to tag files in Finder. However, by that time I’d already migrated to Evernote, so I didn’t pay too much attention.

However, a few days ago, I got [a request for help](http://n8henrie.com/2012/06/converting-openmeta-tags-to-evernote/#comment-2184494834) in adapting my prior AppleScript to convert Finder tags to Evernote tags. At first I thought it was going to be fairly complicated, but I ended up getting it figured out with not much effort, so I thought I’d publish it in a new post.

Once again, it’s intended for use with <a href="http://www.noodlesoft.com/hazel.php" target="_blank" title="Noodlesoft - Hazel">Hazel</a>, which can monitor a folder and will pass in files individually as `theFile`. You could probably just have a Hazel rule for `tags` -> `is not blank`.

I put in a few lines for debugging and testing in `Script Editor.app` to make sure it seems to be working, most importantly line 2, where you can put in the path to a test file (that has Finder tags) and see that it gets imported into Evernote appropriately.

I hardly know any Ruby, so please excuse how sloppy that part came out, and feel free to recommend improvements in the comment section below.
