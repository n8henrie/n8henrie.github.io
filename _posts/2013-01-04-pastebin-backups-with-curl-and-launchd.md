---
id: 1888
title: Pastebin Backups with cURL and launchd
date: 2013-01-04T00:47:42+00:00
author: n8henrie
excerpt: Basically, the script logs into Pastebin using your credentials, makes a cookie for that login, uses the cookie to download the backup file, then deletes the cookie. See the post linked above for an example .plist you can use to schedule this with launchd.
layout: post
guid: http://n8henrie.com/?p=1888
permalink: /2013/01/pastebin-backups-with-curl-and-launchd/
al2fb_facebook_exclude:
  - 1
dsq_thread_id:
  - 1007454230
disqus_identifier: 1888 http://n8henrie.com/?p=1888
---
**Bottom Line:** Just another shell script to back up web content with cURL — this time for use with Pastebin.
  
<!--more-->

I [recently posted a script](http://n8henrie.com/2012/12/pinboard-backups-with-curl-and-launchd/) that uses cURL along with launchd to automate <a target="_blank" href="http://pinboard.in">Pinboard.in</a> backups. This one isn’t too much different, but it is for Pastebin backups.

Pastebin is the service I use to display my scripts in these neat frames with syntax highlighting. So posting my Pastebin backup script in a Pastebin frame is kinda like Inception. Basically, the script logs into Pastebin using your credentials, makes a cookie for that login, uses the cookie to download the backup file, then deletes the cookie. See the post linked above for an example .plist you can use to schedule this with launchd.

As usual, fill your info into anything with square brackets.



**Disclaimer:** I really don’t know anything about the security of using cURL like this, but I’m assuming that {Pastebin being http and not http**s**, the lack of SSL voodoo, the fact that a dunce like me can figure out how to write this script in a day} all means that this is relatively insecure. As far as I can think, it shouldn’t be any less secure than just logging into the page from your web browser (hopefully someone will correct me if I’m wrong about that)… nevertheless _please, please don’t use this if you aren’t using a unique password for Pastebin._ And if you’re re-using passwords… look into <a target="_blank" href="https://lastpass.com">LastPass</a>. Seriously.