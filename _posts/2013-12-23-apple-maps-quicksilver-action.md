---
id: 2424
title: Apple Maps Quicksilver Action
date: 2013-12-23T15:59:27+00:00
author: n8henrie
excerpt: "If you're running Mavericks, use Quicksilver to search for a location in Apple Maps with this AppleScript action."
layout: post
guid: http://n8henrie.com/?p=2424
permalink: /2013/12/apple-maps-quicksilver-action/
dsq_thread_id:
  - 2069597627
disqus_identifier: 2424 http://n8henrie.com/?p=2424
tags:
- applescript
- Mac OSX
- Quicksilver
categories:
- tech
---
**Bottom Line:** If you’re running Mavericks, use Quicksilver to search for a location in Apple Maps with this AppleScript action. <!--more-->

I really dig the new Apple Maps app in Mavericks. My favorite thing about it is being able to send a map directly to my iPhone or iPad in just a click or two. For me, the biggest barrier to using it more was having to start the app up before I type in my search. I usually have a web browser open, so it’s often easier to search Google Maps in the window in front of me rather than crank up a new app.

After thinking about how I could make Apple Maps quicker to use, I got searching and discovered that it supports a URL scheme, like many of the iOS apps I’ve been writing about recently. While I couldn’t find a way to launch the app and search directly from the AppleScript, and using the URL scheme directly seemed to require launching a web browser, I found a workaround in [Python](http://n8henrie.com/tag/python/ "My Python posts") that seems to do the trick. Because Python is installed by default on OSX systems, I imagine this should work for most Quicksilver users.

In the script below, you’ll need to change the default search location unless you’re in Albuquerque. You could also leave out the default location entirely to just search everywhere, but I prefer to leave the default since most of my searches are hoping to find something locally.

As with other Quicksilver actions, it should get installed to `~/Library/Application Support/Quicksilver/Actions` and will require a Quicksilver restart before it shows up in the second pane. Once installed, you can hit `.` (period) to enter text mode in Quicksilver, type your search in the first pane, then tab to the next pane and type “Apple Maps.” Hopefully you’ll find that it opens up with your search already filled in, ready to go. EDIT: You’ll also need to make sure the file extension is `.scpt` — the `.applescript` extension won’t work, if you’ve downloaded directly from GitHub.

<script src="https://gist.github.com/n8henrie/7551557.js"></script>
