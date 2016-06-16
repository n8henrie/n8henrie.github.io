---
id: 2575
title: Get Google Cache AppleScript
date: 2014-07-28T11:30:07+00:00
author: n8henrie
excerpt: This AppleScript will bring up the Google Cache for a page more reliably than most bookmarklets.
layout: post
guid: http://n8henrie.com/?p=2575
permalink: /2014/07/get-google-cache-applescript/
yourls_shorturl:
  - http://n8henrie.com/n8urls/6e
dsq_thread_id:
  - 2880278157
---
**Bottom Line:** This AppleScript will bring up the Google Cache for a page more reliably than most bookmarklets.<!--more-->

One of my favorite quotes to both console potential targets of internet infamy and to caution those that aren&#8217;t concerned with their online privacy:

> The internet has a short attention span, but a _really_ long memory.

For those that didn&#8217;t know, there are a few sites that essentially accumulate &#8220;snapshots&#8221; of the internet at various times, so that people can always have a place to go back and find &#8220;that one website&#8221; &#8212; even years after it&#8217;s been taken down. It&#8217;s really helpful when you go back to find that article you really liked, posted by some humble DIYer years ago, who has since let his or her website fall apart or failed to pay their webhost fees.

The ones I&#8217;m most familiar with are <a target="_blank" href="https://www.archive.org/" title="Internet Archive: Digital Library of Free Books, Movies, Music ...">archive.org</a> (aka &#8220;The Way Back Machine&#8221;), and Google Web Cache. I even have a handy javascript bookmarklet for the Google Cache version, which I run in <a target="_blank" href="http://qsapp.com/" title="Quicksilver — Mac OS X at your Fingertips">Quicksilver</a>. 

<pre>javascript:document.location='http://webcache.googleusercontent.com/search?q=cache:'+escape(window.location);
</pre>

The only problem is when the page is down because the server is not responding. I don&#8217;t totally understand why, but sometimes if a page is just outright overloaded &#8212; perhaps because of a sudden surge in popularity (looking at you, <a target="_blank" href="http://www.reddit.com/" title="reddit: the front page of the internet">Reddit</a>) or maybe some kind of <a target="_blank" href="http://en.wikipedia.org/wiki/Denial-of-service_attack" title="Denial-of-service attack - Wikipedia, the free encyclopedia">DDOS attack</a> &#8212; the javascript won&#8217;t work. Instead, it brings up Google search results for `cache:data:text/html,chromewebdata`. Playing around with it a bit, I think this is because the javascript uses `window.location` to get the page&#8217;s URL. If the page won&#8217;t load because the server won&#8217;t respond _at all_ (as opposed to if the server is responding but the page just can&#8217;t be found), the javascript has nothing to work with. Even though you can _see_ the URL in the address bar, no page data is getting loaded, which is where the javascript finds its information.

I found a workaround for Mac users browsing in Safari or Google Chrome by writing an AppleScript that essentially gets the URL directly from the address bar. So 90% of the time, this should work identically to the javascript bookmarklet. However, the other 10% of the time when nothing is loading at all, this AppleScript should still work while the javascript bookmarklet won&#8217;t.

Just like the bookmarklet, I put it into QuickSilver to be able to call it lickety-split with a keystroke or two. Enjoy!