---
id: 718
title: 'How to fix a broken &#8220;Click to Tweet&#8221; button in Mountain Lion Notification Center'
date: 2012-08-28T19:12:04+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=718
permalink: /2012/08/fix-click-to-tweet-in-mountain-lion-notification-center/
al2fb_facebook_link_id:
  - 506452318_10151132270187319
al2fb_facebook_link_time:
  - 2012-08-29T01:12:14+00:00
al2fb_facebook_link_picture:
  - 'avatar=http://0.gravatar.com/avatar/a23e95080d456123bf42bf8cc0f13519?s=96&amp;d=wavatar&amp;r=PG'
dsq_thread_id:
  - 822338374
disqus_identifier: 718 http://n8henrie.com/?p=718
---
**Bottom line:** If your &#8220;Click to Tweet&#8221; button quits working in Mountain Lion, you can fix it by quitting Notification Center with Activity Monitor.
  
<!--more-->


  
My “Click to Tweet” button in the Notification Center has stopped working a few times in the last couple days. It just stops. You can click it all you like, but it just flickers. After consulting Google, it seems that a handful of others are experiencing this bug, but I couldn’t find a good explanation or fix. I scoured Activity Monitor for anything related to Twitter but had no luck. I tried clicking on and off the “Share” button in the Notification Center preference. No luck. I tried launching the (sadly outdated) Twitter for Mac client, but didn’t find anything helpful there, either.

Finally, I just gave up and rebooted. Not surprisingly, that worked. Ever since I quit using Windows, I hardly ever need to reboot, so it seems like a much bigger hassle than it really is.<figure>

![]({{ site.url }}/uploads/2012/09/ScreenShot2012-08-28at4.06.05PM.jpg "Mountain Lion's "Click to Tweet" Button in the Notification Center")</figure> 

**Unfortunately**, the bug came right back the next day, after canceling a tweet I’d changed my mind about. There’s no way I’m okay with having to reboot my Mac on a daily basis just to get the Twitter widget working, so I got back on Google. Still no luck.

Then I remembered that there’s a NotificationCenter.app that [Quicksilver](http://qsapp.com/) indexes as part of “running apps and processes.” I remembered because it has the annoying habit of getting in my way every time I go to launch the Notification Center preference pane. Sure enough, when I quit Notification Center in Activity Monitor, it _instantly_ respawned, with no apparent ill effects, and the Twitter button is working again. Without rebooting.

In case you’re unfamiliar with Activity Monitor, **here’s a step-by-step for fixing your “Click to Tweet” button**.

  1. Open Spotlight (either by clicking the magnifying glass in the top right corner of your Mac’s screen or by the keyboard shortcut Command + Spacebar) and type in Activity Monitor to pull it up. Click it to open the app.
  
    ![]({{ site.url }}/uploads/2012/09/ScreenShot2012-08-28at4.20.20PM.jpg "Launching Activity Monitor from Spotlight")
  2. You’ll see a screen with a whole bunch of running apps and processes. Use the search box in the top right corner of Activity Monitor to find Notification Center. I only had one match, so I didn’t have to worry about closing the wrong app. If you don’t see it, try changing the dropdown menu to “All Processes” as shown here:
  
    ![]({{ site.url }}/uploads/2012/09/ScreenShot2012-08-28at4.31.26PM.jpg)
  3. Select “Notification Center” in the main box, then click the big red “Quit Process” button in the top left of Activity Monitor.
  
    ![]({{ site.url }}/uploads/2012/09/ScreenShot2012-08-28at4.40.52PM.jpg)
  4. You can just click “Quit” in the confirmation box (no need to Force Quit here).

That’s it! The app comes may back so quickly that it looks like it never quit in the first place, but it probably did. Try your “Click to Tweet” button and see if it’s working again.

Let me know in the comments section below whether or not this worked for you.