---
id: 1818
title: 'Bug fix: Google Calendar Delegates and Calendar.app on Mountain Lion'
date: 2012-12-02T17:08:24+00:00
author: n8henrie
excerpt: "For the past several weeks, I've had an issue in Mountain Lion's Calendar.app (formerly iCal in previous versions of OSX) where my secondary Google calendars have been doing weird things."
layout: post
guid: http://www.n8henrie.com/?p=1818
permalink: /2012/12/google-calendar-delegates-and-mountain-lion-calendar/
al2fb_facebook_link_id:
  - 506452318_10151269218602319
al2fb_facebook_link_time:
  - 2012-12-03T00:08:28+00:00
al2fb_facebook_link_picture:
  - featured=http://www.n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 955016302
disqus_identifier: 1818 http://n8henrie.com/?p=1818
---
**Bottom line:** If your iCal / Calendar.app’s Google Calendar delegates have moved from their place in the “delegates” list to under your account and are now toggling themselves on, deselect them with [this link](https://www.google.com/calendar/syncselect "iphoneselect").
  
<!--more-->

For the past several weeks, I’ve had an issue in Mountain Lion’s Calendar.app (formerly iCal in previous versions of OSX) where my secondary Google calendars have been doing weird things. These “secondary calendars” are frequently friends’ calendars, if we’ve shared read-only versions to help find good times to hang out. Some others are calendar feeds provided by various webapps like [TripIt](http://www.tripit.com), or shared read-write calendars that I administer as part of SMRT.

I’ve always had these secondary calendars sync as “delegates” by checking the corresponding boxes in iCal preferences, under accounts -> delegation. The calendars, in turn, appear under the “delegates” list in my iCal sidebar, with checkboxes that let me easily toggle their visibility. I generally leave them hidden, but turn them on for my weekly “calendar review” so I can make reminders to wish a buddy good luck on a test or see if they need a ride to the airport or what have you.

For the last few weeks, I’ve noticed that the “delegates” moved from their normal place in the list to a different place in the sidebar, directly under my primary Google Calendar. I didn’t think much of it, except that I began to notice that every day or so, they would refresh and automatically toggle their visibility back on, clouding my calendar with all the events that I normally leave hidden. I’d toggle them back off, then they’d toggle themselves back on. Really a pain.

Today I think I figured out the problem. I must have toggled them on with Google’s “iphoneselect” link. I don’t know what the proper name for the link is, but it’s the URL I used to have to visit on people’s iPods to turn on delegate calendar syncing via Google’s Exchange server. It used to have “iphoneselect” somewhere in the URL, which is what I always had to Google to find it, but now is this: <https://www.google.com/calendar/syncselect>. I went there on my Mac, deselected everything, and calendars are now back under “delegates” and hidden, just like they used to be. I checked on my iPhone, and the calendars still exist there, so it doesn’t appear to remove them from other devices. On that note, if the calendars _aren’t_ on your iDevice and you’d like them to be, you ought to try following that URL on the device in question to see if they’re not checked.

This post would be a lot better with a few screenshots, but I’m in a hurry at the moment, and honestly I think if you’re found your way to this post, you probably already have a good idea what I’m talking about.