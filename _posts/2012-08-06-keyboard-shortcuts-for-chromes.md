---
id: 5
title: 'Keyboard Shortcuts for Chrome&#8217;s Bookmarklets via Quicksilver'
date: 2012-08-06T14:05:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=5
permalink: /2012/08/keyboard-shortcuts-for-chromes/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/08/keyboard-shortcuts-for-chromes.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 811654446
disqus_identifier: 5 http://n8henrie.com/?p=5
---
**Bottom line:** <a href="http://qsapp.com" target="_blank">Quicksilver</a> can index Javascript bookmarklets so you can set keyboard triggers for your favorites ones.
  
<!--more-->


  
I’m astounded that I didn’t figure this out sooner (especially after [my last blog post on bookmarklets)](http://www.n8henrie.com/2012/08/javascript-bookmarklet-in-chrome/). Quicksilver is the _one_ app whose absence would force me to relearn how to do almost everything on my Mac – I use it for everything. I’m also a heavy user of Javascript bookmarklets to do things like add articles to my <a href="http://www.instapaper.com/" target="_blank">Instapaper</a> reading queue or add a webpage to my <a href="https://accounts.google.com/Login?continue=http://www.google.com/bookmarks/" target="_blank">Google Bookmarks</a>*. Most of my bookmarklets seem to work in Chrome, Safari, Firefox, as well as Safari for iOS, so I keep them in a folder of bookmarks that gets synced across my browsers and devices with Xmarks. The list to the left should give you an idea – I generally “install” (meaning bookmark) any bookmarklet that my apps come with, as you never know when they might come in handy.

**Ends up, there’s a simple way to set up Quicksilver to trigger your bookmarklets ultra-fast,** at least in Chrome and likely in other major browsers like Safari and Firefox. While the bookmarklets themselves work fine, this Quicksilver trick doesn’t seem to be working in Safari or Firefox for me right now. This may just be because I have Chrome set as my default browser. If anyone wants to check and let me know, please post in the comments. Here’s the setup.

  1. If you haven’t guessed, you’ll need to have <a href="http://qsapp.com" target="_blank">Quicksilver</a> installed, as well as at least one working Javascript bookmarklet in your browser bookmarks.
  2. Install the Chrome plugin (or experiment with your browser of choice) [<a href="http://cl.ly/image/2S3b3X22252R" target="_blank">visual aid</a>] 
      1. Go into your Quicksilver preferences (command + comma works in most apps)
      2. Go to the plugins tab up top
      3. Go to “All plugins” on the left&#8221;
      4. Use the search box at the bottom
  3. Again in QS preferences, go to Catalog (up top), Plugins (on the left), and make sure Chrome’s bookmarks are being indexed by QS. The box should be checked with the number of indexed items next to the checkbox.
  4. In Chrome, go to a page you’d like to use with your bookmarklet.
  5. Invoke Quicksilver, type the name of your bookmarklet, then tab over the second pane and select “Run Javascript” as the action. Should look something like this.

<div align="center">
  <img src="{{ site.url }}/uploads/2012/09/ScreenShot2012-08-06at7.24.32AM.jpg" alt="" />
</div>

That’s all there is to it! Worked like a charm for me. Now, for a few bonus points, we can make this process even _faster._

  * One way is to speed up the triggering of the “Run Javascript” part. 
      * You can <a href="http://blog.qsapp.com/post/7413266835/putting-in-a-shift" target="_blank">set up Quicksilver to recognize a different action for a capital letter versus lower case</a>.
      * I set mine up sow that CMD + Shift + J automatically runs “Run Javascript” for the selected first pane.
      * This makes it so I can trigger _any_ bookmarklet (whichever is in the first pane) faster.
  * For your _favorite_bookmarklets, you can set up a special trigger that only runs one specific bookmarklet. 
      * Again in Quicksilver preferences, go to Triggers (up top).
      * Click the “+” down bottom to add a new trigger.
      * In the popup box, select the trigger you want, then tab to the second pane and “Run Javascript”.
      * Afterwards, select the trigger and click the “**i**” in the bottom right.
      * In the sidepane, pick an unused hotkey combination.
      * I also recommend clicking on “Scope” (in the same sidebar) and limiting this trigger to your primary browser. This prevents this hotkey combination from getting in the way accidentally.

For mine, I set up the “capital J” trick so I can quickly run my less oft used bookmarklets, and a special trigger so that “CMD I” automatically saves the current Chrome page to Instapaper. (I was really surprised to find that CMD I wasn’t already reserved for something else in Chrome.)

Okay, that’s all for this post. Find it useful? Have a problem? Let me know in the comments section below!

*Did you even know Google Bookmarks existed? Pretty awesome way to save / organize / tag / add notes to links that you don’t need everyday but want to be able to find later.