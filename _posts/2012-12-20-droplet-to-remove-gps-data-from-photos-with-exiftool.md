---
id: 1843
title: Droplet to Remove GPS Data from Photos with EXIFTool
date: 2012-12-20T16:53:24+00:00
author: n8henrie
excerpt: Many folks are not aware that they have GPS data embedded into their photos. This is a cool feature supported by many modern cameras and phones; it enables apps like iPhoto to plot maps of where your photos have been taken. However, sometimes people unknowingly post their photos to the internet with this GPS data, which can be a privacy and security concern.
layout: post
guid: http://www.n8henrie.com/?p=1843
permalink: /2012/12/droplet-to-remove-gps-data-from-photos-with-exiftool/
al2fb_facebook_link_id:
  - 506452318_10151296451622319
al2fb_facebook_link_time:
  - 2012-12-20T23:53:29+00:00
al2fb_facebook_link_picture:
  - featured=http://www.n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 985011165
---
**Bottom Line:** EXIFtool is a free command line utility that can remove the GPS data that many modern cameras and phones embed into photos.
  
<!--more-->

Many folks are not aware that they have GPS data embedded into their photos. This is a cool feature supported by many modern cameras and phones; it enables apps like iPhoto to plot maps of where your photos have been taken. However, sometimes people unknowingly post their photos to the internet with this GPS data, which can be a privacy and security concern. (Note that some companies like Facebook responsibly [strip this data from the photos when they&#8217;re uploaded](http://www.windowsitpro.com/blog/security-blog-12/socialmedia/facebook-handles-image-exif-data-141543#/0) but many sites like forums or especially your personal blog might not have instituted this practice.)

On a Mac, you can easily check whether or not a given image has GPS data by opening the photo in Preview.app and hitting command + i to open the inspector window (or use Tools -> Show Inspector). Click on the little &#8220;i&#8221; icon in the Inspector window, and if there is GPS data, you&#8217;ll have a GPS tab.

Here&#8217;s an example picture I tool while in Corpus Christi: [[Download Image](http://cl.ly/image/1p3Y1v3q1e0r)]. Open it up in Preview (often the default app to open image files) if you&#8217;d like to see for yourself. You should get a window like this:<figure> 

![](http://n8henrie.com/wp-content/uploads/2012/12/20121220-ScreenShot-50.jpg)</figure> 

Notice that you can even use the handy &#8220;Locate&#8221; button to open a Google Maps window to the _exact hotel I was at when I took the picture._

A little while ago I ran across [EXIFTool](http://www.sno.phy.queensu.ca/~phil/exiftool/), a command line utility that works on both PC and OSX to manipulate the EXIF metadata embedded into photos. I found it to have [really good documentation](http://www.sno.phy.queensu.ca/~phil/exiftool/exiftool_pod.html "EXIFTool Man Page"), and it only took me a few minutes after installing it to figure out that running the Terminal command



works great to strip out the GPS data while preserving the other EXIF information, such as camera type and shutter speed, etc.

To make it even easier, I made a little droplet with Automator this morning (download link below) that runs the following Terminal code:



You should be able to drag and drop images onto the application and it will strip the GPS in bulk and add &#8220;_CLEAN&#8221; to the end of the filename so you know they&#8217;ve been processed. With the current configuration, the new files **replace** the originals in whatever directory they&#8217;re dragged from, so if you decide to use it, please be sure to make a duplicate or backup first (in case there are any problems, I&#8217;d hate to have my script corrupt or otherwise destroy your only copy of a prized image). I also have it configured so it maintains the file creation and modification dates, because I hate when something messes that stuff up.

Also note that **you&#8217;ll still need to install EXIFTool for this to work** (available at the link above, or the link included in the .dmg). The droplet just takes the Terminal stuff &#8220;out of the picture&#8221; (hehe) to make it more user friendly for people unfamiliar or uncomfortable with Terminal.

[Download link for cleanGpsFromExif.app](http://n8henrie.com/wp-content/uploads/2012/12/cleanGPSFromEXIF.dmg)

If you want to give the droplet a shot, I encourage you to test it out with the GPS-data-containing photo I linked above. Once downloaded, open it in Preview and verify that the GPS data is indeed there. Then drag and drop the image file onto the droplet, re-open, and verify that the GPS data is gone. Also note that the rest of the EXIF and modification dates are preserved.

Feel free to open the droplet with Automator and edit anything you like. Big thanks to the EXIFTool dev team for a great utility!