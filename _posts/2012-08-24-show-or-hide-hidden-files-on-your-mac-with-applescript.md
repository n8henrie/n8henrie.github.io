---
id: 662
title: Show or Hide Hidden Files on your Mac with Applescript
date: 2012-08-24T15:25:42+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=662
permalink: /2012/08/show-or-hide-hidden-files-on-your-mac-with-applescript/
al2fb_facebook_link_id:
  - 506452318_10151122470697319
al2fb_facebook_link_time:
  - 2012-08-24T21:25:44+00:00
al2fb_facebook_link_picture:
  - 'avatar=http://0.gravatar.com/avatar/a23e95080d456123bf42bf8cc0f13519?s=96&amp;d=wavatar&amp;r=PG'
dsq_thread_id:
  - 817413064
disqus_identifier: 662 http://n8henrie.com/?p=662
tags:
- applescript
- Mac OSX
categories:
- tech
---
**Bottom line:** Use <a href="http://cl.ly/1s0K0k0F2b07" title="Show or Hide HIdden Files" target="_blank">this Applescript</a> to quickly show or hide the hidden files on your Mac.
  
<!--more-->


  
As some of you might know, Mac OSX has hidden files whose filename starts with a period. Sometimes you need to access those hidden files, and to do so you usually have to use a third party tool or crank up Terminal. (In Terminal you can either reveal them in Finder or edit them directly.)

I wrote up a quick Applescript that runs simply runs this Terminal command and relaunches Finder to get them to show up. It has a popup prompt for you to tell it to show or hide the files (or cancel). I index it with <a href="http://qsapp.com/" title="Quicksilver" target="_blank">Quicksilver</a> to make launching as simple as possible. The only issue I have is that sometimes I have to run it a couple times to get the hidden files to actually show up — not sure why this is. If anyone has any ideas, let me know in the comments.

The actual code is below, and <a href="http://cl.ly/1s0K0k0F2b07" title="Show or Hide HIdden Files" target="_blank">here’s another link to a downloadable copy of the script</a>.