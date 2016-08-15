---
id: 1669
title: Applescript to Automate Checking Checkboxes in your Web Browser
date: 2012-09-07T16:36:18+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=1669
permalink: /2012/09/applescript-to-automate-checking-checkboxes-in-your-web-browser/
al2fb_facebook_link_id:
  - 506452318_10151145548547319
al2fb_facebook_link_time:
  - 2012-09-07T22:36:22+00:00
al2fb_facebook_link_picture:
  - 'avatar=http://0.gravatar.com/avatar/a23e95080d456123bf42bf8cc0f13519?s=96&amp;d=wavatar&amp;r=PG'
dsq_thread_id:
  - 835124490
disqus_identifier: 1669 http://n8henrie.com/?p=1669
---
**Bottom line:** I wrote an Applescript that automates clicking a lot of evenly spaced checkboxes in a web browser.
  
<!--more-->


  
Sometimes you run across _really_ long forms where you just want to check the same box on all of them. That&#8217;s about the only thing this script can do.

As I&#8217;ve noted in the script itself, it seems to be working okay in the latest stable releases of Safari and Chrome for Mac (as of Sep 07, 2012). I&#8217;ve tried to have the dialogue boxes give clear instructions as the script runs.

I wrote this because I was recently filling out an online form where I had to check boxes to select which programs I want to download. I was limited to downloading 100 of them, there were ~180 total, and there was no &#8220;select all&#8221; button (seriously). Even if there were, I&#8217;d have to de-select 80… no good.

Most of you likely know that you can go between buttons on a web page by pushing &#8220;tab,&#8221; and you can toggle checkboxes by hitting &#8220;space.&#8221; In this particular form, you had to hit tab twice between each button. This form had several pages with a similar layout, though some of them only required one tab between buttons. So instead of hitting &#8220;tab tab space&#8221; 100 times for each page, I wrote this script. **It needs you to input about how many buttons you need to check, and how many &#8220;tabs&#8221; are between each button, then select what browser you&#8217;re using out of a list of running processes.** Then it tries to &#8220;tab tab space&#8221; for you.

I&#8217;ve tried to make this clear, but **please be careful using this script.** The last thing I&#8217;d want is for somebody to get the spacing wrong or enter in too many checkboxes and have this script go all the way to the bottom of the page and submit some important form that wasn&#8217;t ready yet. Keep this possibility in mind, and **use at your own risk.**

That said, here are a few tips for success. This script

  * will prompt you to position the starting point by tabbing down to the first checkbox and checking it with the spacebar.
  * takes this manually checked box into account in the total, so just enter in how many boxes you want to be checked at the end of each cycle.
  * does fine starting back up where it left off, so I recommend guessing low if you&#8217;re unsure of how many boxes you have to check on a page. _If it doesn&#8217;t get them all, just tab down and start again from the next box._

<p align="center">
  <a target="_blank" href="http://cl.ly/3m0N3H3O322a">Download Script</a><br />
</p>