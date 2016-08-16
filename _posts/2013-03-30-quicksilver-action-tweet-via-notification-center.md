---
id: 2101
title: 'Quicksilver Action: Tweet via Notification Center'
date: 2013-03-30T14:34:01+00:00
author: n8henrie
excerpt: I like Safari’s “Share via Twitter” button that lets you Tweet a URL, so I wrote a Quicksilver action to do something similar.
layout: post
guid: http://n8henrie.com/?p=2101
permalink: /2013/03/quicksilver-action-tweet-via-notification-center/
dsq_thread_id:
  - 1175792823
disqus_identifier: 2101 http://n8henrie.com/?p=2101
tags:
- applescript
- Mac OSX
- Quicksilver
- Twitter
categories:
- tech
---
**Bottom Line:** I like Safari’s “Share via Twitter” button that lets you Tweet a URL, so I wrote a Quicksilver action to do something similar. <!--more-->

In brief, Safari has one of OSX’s nifty “Share” buttons that lets you Tweet the URL you’re viewing. I want this in Chrome, but you have to install 3rd party extensions to get this. I don’t feel like requiring a 3rd party extension for this simple task, so I searched around and <a target="_blank" href="http://hints.macworld.com/article.php?story=20120819231916737">found a bit of AppleScript</a> that made me realize it would be pretty easy to write with some [UI Scripting](http://n8henrie.com/2013/03/a-strategy-for-ui-scripting-in-applescript/).

Additionally, [Quicksilver has some new tricks up its sleeve](http://n8henrie.com/2013/03/template-for-writing-quicksilver-actions-in-applescript/) with custom AppleScript actions, so I thought this would make a good opportunity to see what’s new. Basically, the action takes a URL from Quicksilver’s first pane, activates the “Click to Tweet” button in the Notification Center, pastes the URL, and scrolls back to the beginning of the URL so you can add the text of your Tweet.

Because Twitter automatically URL shortens, pasting in a shortened URL (say with bitly or goo.gl or what have you) does not save any extra characters as compared to pasting in the full URL. However, using a shortened URL may be nice for tracking clicks. I [recently posted an AppleScript](http://n8henrie.com/2013/03/bitly-applescript-url-shortener/) to grab the URL from Chrome or Safari, shorten via bitly, and return the shortened URL to Quicksilver. It works great with this Tweet via NC action, since it returns the shortened URL to the first pane, which is what Tweet via NC requires.