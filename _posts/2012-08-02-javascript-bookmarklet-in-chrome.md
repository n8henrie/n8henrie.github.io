---
id: 7
title: How to Make Javascript Bookmarklet Shortcuts in Google Chrome
date: 2012-08-02T19:04:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=7
permalink: /2012/08/javascript-bookmarklet-in-chrome/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/08/javascript-bookmarklet-in-Chrome.html
blogger_images:
  - 1
dsq_thread_id:
  - 811661485
---
**Bottom line:** Add javascript bookmarklets to Google Chrome’s search engines to allow activation via keyword from the Omnibox.
  
<!--more-->

I’m a keyboard shortcut fanatic. I type at nearly 100 wpm, and I use tools like <a target="_blank" href="http://www.qsapp.com">Quicksilver</a> to make it so that my hands have to leave the keyboard as little as possible. In fact, one of the reasons I first switched to using Chrome was because I can switch between tabs quickly by using CMD + [arrow key] or CMD + number. For example, I keep Gmail open in a pinned tab, and it’s always the first tab. That way, I can always type CMD 1 to go directly to my email. Then “c” to compose a new email (using Gmail’s excellent keyboard shortcuts), and I’ve gone from browsing to writing an email in under a second.

I also use a ton of javascript bookmarklets. One of my favorites is [Instapaper](http://www.n8henrie.com/2011/06/instapaper-and-readability-are-great/) – I’m a huge fan. Anyway, I’m always looking for a better way to trigger this bookmarklet than manually clicking the “Read later” button, and I really prefer not to install 3rd party extensions (for things like keyboard shortcuts – especially ones that accidentally get triggered when I’m typing). For about a year now, I’ve just make the bookmarklet into a bookmark and named it #insta. When I’m on a page I’d like to save, I type “#insta” into the Omnibox and hit the down arrow a few times to select the javascript: bookmarklet.

Prefacing it with # makes it so I can go to instapaper without accidentally triggering the bookmarklet instead, and also seems to make Chrome put the bookmarklet higher in my results than a simple bookmark without the #.

Recently, I was messing around with text expansion to see if I could just have a snippet that expanded “#insta” into the bookmarklet, so I didn’t have to down arrow and select the right one. Unfortunately (or fortunately, I guess), Chrome has some built in security that disables javascript when input this way or from the clipboard. Makes sense.

Then I came across the perfect solution: Chrome supports custom search tools (that I use frequently). If you right click on the Omnibox, you can “Edit Search Engines…”

<div style="clear: both; text-align: center;">
  <a target="_blank" href="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-08-02at12.53.45PM.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-08-02at12.53.45PM.jpg" /></a>
</div>



And add a new “search engine” using “#insta” as the keyword…

<div style="clear: both; text-align: center;">
  <a target="_blank" href="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-08-02at12.55.09PM.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-08-02at12.55.09PM.jpg" /></a>
</div>

and it works like a charm! Now, when I’m on a page I’d like to read later, I just “CMD L” to jump to the Omnibox and type in “#insta” and return, and the Instapaper “Saving…” screen pops up just like I’d hoped. Nice to finally find a solution I’m happy with for triggering javascript bookmarklets!

<div>
</div>