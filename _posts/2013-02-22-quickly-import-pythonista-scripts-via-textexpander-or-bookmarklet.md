---
id: 2007
title: Quickly Import Pythonista Scripts via TextExpander or Bookmarklet
date: 2013-02-22T12:16:42+00:00
author: n8henrie
excerpt: "Seems like everyone's first Pythonista script is a way to import others' Pythonista scripts more easily. Here's my take."
layout: post
guid: http://n8henrie.com/?p=2007
permalink: /2013/02/quickly-import-pythonista-scripts-via-textexpander-or-bookmarklet/
dsq_thread_id:
  - 1099099544
disqus_identifier: 2007 http://n8henrie.com/?p=2007
---
**Bottom Line:** Once installed in <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Official Pythonista Website">Pythonista</a>, these Python scripts will make it much easier to import a script from a URL.

<!--more-->

Seems like everyone&#8217;s first <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Pythonista in iTunes">Pythonista</a> script is a way to import others&#8217; Pythonista scripts more easily. Here&#8217;s my take.

I do most of my browsing on my Macbook, and I often use Messages.app to send URLs back and forth between my computer and my iOS devices. Once easy way for me to import a script into Pythonista is to message myself a **pythonista://** URL that runs my import script and passes the external script URL as an argument. I use a <a target="_blank" href="https://itunes.apple.com/us/app/textexpander-for-mac/id405274824?mt=12&#038;at=10l5H6">TextExpander</a> snippet abbreviated as **.topythonista** to make this even easier.

The Pythonista script (you&#8217;ll have to figure how to get this one in there) is pretty simple. Note that the script name is important for the **pythonista://** URL to work (i.e. note the url-encoded version of the script name snippet below).

**Update Sun Feb 24 20:10:34 MST 2013:** Many thanks to Rob Olian in the comments who has brought to my attention the fact that I&#8217;ve pasted the wrong script here, and that an additional potential source of confusion is the reference to clipboard in the TextExpander script (which works with the bookmarklet script, not the clipboard script). The script immediately below does **not** import a Python script from the javascript bookmarklet, nor from the TextExpander snippet I&#8217;ve posted. This script uses **clipboard.get()** to import a script copied to the **iOS** clipboard &#8212; handy if you&#8217;re browsing GitHub or what have you from your iOS device. The second Python script, below this one, imports the script using **sys.argv[1]**, being the first argument passed to Pythonista by the **pythonista://** URL. This works with the javascript bookmarklet, which sends the argument (the script.py to be imported) by **+encodeURIComponent(document.location.href)**, and also with the TextExpander snippet, which sends the contents of the **OSX** clipboard (which should also be the URL to the script.py) with **%clipboard**. I apologize for any confusion, happy to clear things up if there are still questions. </update>





The TextExpander snippet I use is:

> pythonista://Import%20Pythonista%20Script%20from%20Bookmarklet?action=run&argv=%clipboard

Once you have both of these in place, you can copy to your computer&#8217;s clipboard the (raw) URL to a Pythonista script (e.g. <a target="_blank" href="https://raw.github.com/jayhickey/Pythonista-Scripts/master/dropboxlogin.py">https://raw.github.com/jayhickey/Pythonista-Scripts/master/dropboxlogin.py</a>), open an iMessage to yourself and type **.topythonista**… and the resulting mess should be clickable on your iOS device and result in a new script in Pythonista.

If you&#8217;re browsing from your iOS device instead of your computer, this slight variation works with a bookmarklet you can save in your mobile browser of choice. It also tries to pull in the script name, but may not succeed. I have no idea what I&#8217;m doing, so no promises.



Here is the bookmarklet. Pro-tip: to run from Chrome for iOS, navigate to the page with the (raw) script you&#8217;d like to import and start typing your bookmarklet name of choice (doesn&#8217;t matter what you name this it) into the omnibox, and tap the &#8220;suggestion.&#8221; If you try to use it by navigating through your saved bookmarks, it won&#8217;t work.



One last thing: if you have both an iPhone and iPad, it doesn&#8217;t take long to set up a script to sync your Pythonista scripts between your devices via Dropbox. Start with <a target="_blank" href="http://omz-software.com/pythonista/forums/discussion/10/using-the-dropbox-module/p1">this thread</a>. As a bonus, the scripts will also end up syncing to your Dropbox-connected computer, where you can edit them with whatever editor you&#8217;d like (though Pythonista&#8217;s editor is _really_ good).