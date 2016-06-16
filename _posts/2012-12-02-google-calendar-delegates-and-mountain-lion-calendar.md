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
yourls_fetching:
  - 1
yourls_shorturl:
  - 
  - http://n8henrie.com/n8urls/2x
---
**Bottom line:** If your iCal / Calendar.app&#8217;s Google Calendar delegates have moved from their place in the &#8220;delegates&#8221; list to under your account and are now toggling themselves on, deselect them with [this link](https://www.google.com/calendar/syncselect "iphoneselect").
  
<!--more-->

For the past several weeks, I&#8217;ve had an issue in Mountain Lion&#8217;s Calendar.app (formerly iCal in previous versions of OSX) where my secondary Google calendars have been doing weird things. These &#8220;secondary calendars&#8221; are frequently friends&#8217; calendars, if we&#8217;ve shared read-only versions to help find good times to hang out. Some others are calendar feeds provided by various webapps like [TripIt](http://www.tripit.com), or shared read-write calendars that I administer as part of SMRT.

I&#8217;ve always had these secondary calendars sync as &#8220;delegates&#8221; by checking the corresponding boxes in iCal preferences, under accounts -> delegation. The calendars, in turn, appear under the &#8220;delegates&#8221; list in my iCal sidebar, with checkboxes that let me easily toggle their visibility. I generally leave them hidden, but turn them on for my weekly &#8220;calendar review&#8221; so I can make reminders to wish a buddy good luck on a test or see if they need a ride to the airport or what have you.

For the last few weeks, I&#8217;ve noticed that the &#8220;delegates&#8221; moved from their normal place in the list to a different place in the sidebar, directly under my primary Google Calendar. I didn&#8217;t think much of it, except that I began to notice that every day or so, they would refresh and automatically toggle their visibility back on, clouding my calendar with all the events that I normally leave hidden. I&#8217;d toggle them back off, then they&#8217;d toggle themselves back on. Really a pain.

Today I think I figured out the problem. I must have toggled them on with Google&#8217;s &#8220;iphoneselect&#8221; link. I don&#8217;t know what the proper name for the link is, but it&#8217;s the URL I used to have to visit on people&#8217;s iPods to turn on delegate calendar syncing via Google&#8217;s Exchange server. It used to have &#8220;iphoneselect&#8221; somewhere in the URL, which is what I always had to Google to find it, but now is this: <https://www.google.com/calendar/syncselect>. I went there on my Mac, deselected everything, and calendars are now back under &#8220;delegates&#8221; and hidden, just like they used to be. I checked on my iPhone, and the calendars still exist there, so it doesn&#8217;t appear to remove them from other devices. On that note, if the calendars _aren&#8217;t_ on your iDevice and you&#8217;d like them to be, you ought to try following that URL on the device in question to see if they&#8217;re not checked.

This post would be a lot better with a few screenshots, but I&#8217;m in a hurry at the moment, and honestly I think if you&#8217;re found your way to this post, you probably already have a good idea what I&#8217;m talking about.