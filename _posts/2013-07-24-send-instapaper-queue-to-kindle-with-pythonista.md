---
id: 2326
title: Send Instapaper Queue to Kindle with Pythonista
date: 2013-07-24T10:15:47+00:00
author: n8henrie
excerpt: Trigger Instapaper to send your unread list to your Kindle with this Pythonista script.
layout: post
guid: http://n8henrie.com/?p=2326
permalink: /2013/07/send-instapaper-queue-to-kindle-with-pythonista/
yourls_shorturl:
  - http://n8henrie.com/n8urls/5t
dsq_thread_id:
  - 1527134585
---
**Bottom Line:** Trigger Instapaper to send your unread list to your Kindle with this Pythonista script.<!--more-->

<a target="_blank" href="https://itunes.apple.com/us/app/instapaper/id288545208?mt=8&#038;at=10l5H6" title="Instapaper">Instapaper</a> is one of my all-time favorite apps (click the tag above to see prior posts). One of its best features is that you can set it up to automatically send your unread list to your Kindle via email at predefined intervals (e.g. when you get to x unread items, at a certain frequency). The format is pleasantly readable and navigable, and I recommend you look into it if you don&#8217;t have it set up&#8230; because I won&#8217;t be covering it in this post.

You can also trigger it to send your unread list manually; I do this frequently the morning before departing on a trip, to make sure my Kindle has the most up-to-date Instapaper list possible. I wrote the script below to facilitate triggering Instapaper to send its queue to my Kindle. I consider it an improvement in three major ways. It is:

  * faster
  * not reliant on the web interface (can be tough on a mobile device)
  * compatible with <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Pythonista">Pythonista</a> on my iOS devices

The code is below; it seems to work on my Mac (Python 2.7.5) as well as my iPhone as long as I set the password in the script (currently set to use Pythonista&#8217;s keychain to retrieve the pass, which obviously won&#8217;t work as is on OSX). Be forewarned that it can take several minutes after triggering the action for the article to show up on the Kindle. I think the lag is on Amazon&#8217;s end &#8212; give it at least 30 minutes before deciding it didn&#8217;t work.