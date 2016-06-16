---
id: 2768
title: 'Bookmarklet: Filter Mint Transactions by Date Range'
date: 2015-11-11T16:19:16+00:00
author: n8henrie
excerpt: "Here's a JavaScript bookmarklet to filter Mint transactions by date range."
layout: post
guid: http://n8henrie.com/?p=2768
permalink: /2015/11/bookmarklet-filter-mint-transactions-by-date-range/
dsq_thread_id:
  - 4310676971
---
**Bottom Line:** Here&#8217;s a JavaScript bookmarklet to filter Mint transactions by date range.<!--more-->

Mint.com has a search function that is pretty handy. Unfortunately, it doesn&#8217;t have a particularly <a href="https://mint.lc.intuit.com/questions/948537-mint-faq-how-can-i-view-transactions-within-a-specific-date-range" target="_blank">user friendly way</a> to filter transactions by date range. 

I know there is an open source Chrome extension to enable this feature, but because the workaround is a pretty simple modification of the URL, I thought a Javascript bookmarklet would actually work just as well and not require installing 3rd party software. It should also work on other browsers.

I whipped up a quick script that prompts the user to input start and end dates and redirects to the appropriate page. Feel free to leave either one blank, it should still work. If you&#8217;re currently browsing Mint, it redirects the current tab. If you&#8217;re not browsing Mint, it opens a new window.

Like any bookmarklet, to &#8220;install,&#8221; make a new bookmark (`command d` in Chrome on OS X), give it a name, edit the url, and paste in the minified / commented out line starting with `javascript:` below.

Let me know if you find any major issues.