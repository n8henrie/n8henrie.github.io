---
id: 1872
title: Pinboard Backups with cURL and launchd
date: 2012-12-29T19:43:15+00:00
author: n8henrie
excerpt: I saw a post today by Marcelo Somers at behindcompanies.com that alerted me to a clever way to back up Pinboard using cURL. His method involves a web server ant IFTTT, and had a few issues with my special-character-containing password (courtesy of LastPass), so I decided to tinker with it a bit.
layout: post
guid: http://www.n8henrie.com/?p=1872
permalink: /2012/12/pinboard-backups-with-curl-and-launchd/
al2fb_facebook_exclude:
  - 1
dsq_thread_id:
  - 999223363
disqus_identifier: 1872 http://n8henrie.com/?p=1872
---
**Bottom Line:** If you’re a <a target="_blank" href="https://pinboard.in">Pinboard</a> user, you can automate backing up your bookmarks to Dropbox with cURL and launchd.
  
<!--more-->

I’ve mentioned <a target="_blank" href="http://en.wikipedia.org/wiki/Launchd">launchd</a> in past posts [a time](http://www.n8henrie.com/2012/12/my-goodmorning-app-automator-routine/)… [or two](http://www.n8henrie.com/2012/07/scheduling-ios-apps/). It’s a behind-the-scenes program that lets you schedule stuff to happen at a given time (Sundays at 3 AM) or time interval (every 15 minutes) on your Mac.

I <a target="_blank" href="http://behindcompanies.com/2011/12/a-guide-to-backing-up-pinboard/">saw a post today</a> by Marcelo Somers at behindcompanies.com that alerted me to a clever way to back up Pinboard using cURL. His method involves a web server ant <a target="_blank" href="http://ifttt.com">IFTTT</a>, and had a few issues with my special-character-containing password (courtesy of <a target="_blank" href="http://lastpass.com">LastPass</a>), so I decided to tinker with it a bit.

I was able to get it running great, including URL encoding the password, with the script below. Anything with square brackets means you need to fill in your info there (and omit the square brackets).
  


I named the script pinboardBackup.sh (which you&#8217;ll see in the .plist). **Don&#8217;t forget to chmod +x to make it executable.**

I have it set to be run by launchd every night at 3 AM with this (again, fix the part with square brackets):
  


All together, this will download the backup in JSON format and put it in a Dropbox folder for me. I have <a target="_blank" href="http://www.noodlesoft.com/hazel.php">Hazel</a> manage the backups to make sure I don&#8217;t get overwhelmed with too many. I will probably decrease the interval to weekly pretty soon, I think daily is a bit much.

Thanks for keeping the comments and questions below (instead of via email) so that everyone can benefit from discussion.