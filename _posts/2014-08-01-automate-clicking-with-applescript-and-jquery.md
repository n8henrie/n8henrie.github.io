---
id: 2588
title: Automate Clicking Through Webpages with AppleScript and jQuery
date: 2014-08-01T11:04:04+00:00
author: n8henrie
excerpt: This AppleScript uses jQuery to click a submit button on a webpage over and over in the background while you keep browsing.
layout: post
guid: http://n8henrie.com/?p=2588
permalink: /2014/08/automate-clicking-with-applescript-and-jquery/
dsq_thread_id:
  - 2894796973
---
**Bottom Line:** This AppleScript uses jQuery to click a submit button on a webpage over and over in the background while you keep browsing.<!--more-->

Every once in a while, I run across some kind of website or online module where I have to click a `Submit` button on a page, wait 3 or 4 seconds for the next page to load, click `Submit` on the next page, wait again&#8230; repeat 5 or 10 times, and usually take some kind of quiz afterwards. Often, there are 10 or 15 of these modules.

Sometimes the content is excellent, new to me, and I learn a lot. On fortunately rare occasion, the content is old hat, and I really just need to click that `Submit` button a bunch of times to get to the darn quiz. On such occasions, the 4 seconds \* 8 pages \* 10 modules (in reality only 5 minutes or so) of wasted time _seems_ excruciating.

So, my ever-efficient solution was to spend a half hour writing a script to help automate the process.

  * <a href="http://xkcd.com/1319/" target="_blank">Relevant xkcd 1</a>
  * <a href="http://xkcd.com/1205/" target="_blank">Relevant xkcd 2</a>

I don&#8217;t know any javascript, so first, I figured out how to import jQuery into a page that didn&#8217;t already have it using Chrome&#8217;s javascript console (thanks to <a href="http://stackoverflow.com/questions/7474354/include-jquery-in-the-javascript-console" target="_blank">Stack Overflow</a>).

Then, I figured out how to select and click the `Submit` button in jQuery.

Next, I couldn&#8217;t find a good way to run a `while true` loop to have the jQuery continue to hit the button when the next page came up (I&#8217;m guessing because navigating to the next page reloaded the javascript stuff, purging the script I&#8217;d run previously). Instead, knowing that Chrome has decent AppleScript support, and that [it can run javascript through AppleScript](http://n8henrie.com/2014/07/get-google-cache-applescript/ "Get Google Cache AppleScript - n8henrie.com"), I figured AppleScript seemed like a reasonable way to get the job done. (It looks like `splinter` and `selenium` would have been an option in Python.)

All that was left was a little polish to make the script exit when the button is no longer found, notify the user at that point, and try to return to the tab in question.

The icing on the cake is that it seems to run just fine in the background, while you continue to browse in other tabs.

Hope you can find some use for it! If so, you may be interested in [one of my first scripts](http://n8henrie.com/2012/09/applescript-to-automate-checking-checkboxes-in-your-web-browser/), which automates checking a bunch of boxes (on a single webpage).