---
id: 1315
title: Quickly Copy Pictures from your iPhone to your Mac with Terminal and SSH
date: 2012-08-30T16:07:15+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=1315
permalink: /2012/08/copy-pictures-from-iphone-to-mac-with-terminal-and-ssh/
al2fb_facebook_exclude:
  - 1
dsq_thread_id:
  - 824818383
disqus_identifier: 1315 http://n8henrie.com/?p=1315
tags:
- applescript
- automation
- iPad
- iPhone
- iPhoto
- Mac OSX
- photo
categories:
- tech
---
**Bottom line:** Run this command in Terminal to copy your photos from an iDevice to your Mac via SSH.

<!--more-->

I _really_ wish there was a <a target="_blank" href="http://skitch.com/">Skitch</a> for iPhone, but it doesn't exist (although <a target="_blank" href="http://itunes.apple.com/us/app/skitch-for-ipad/id490505997?mt=8&at=10l5H6">the iPad version</a> is nice). That means that adding arrows or text or whatever minor adjustments to a picture usually means opening up the pic on my Macbook.

There are many _easy_ options to get the pic there, but not very many _fast_ ones. Since my iPhone is jailbroken, I decided to figure out how to make this happen with an SSH script today. Ends up it was pretty easy and works much more quickly than waiting for Photo Stream or Cyberduck and doesn't require me to connect a cable like iFunBox or iPhoto (since iPhoto is such a lightweight, fast-starting application that I'm dying to use it anyway).

For this tip to be of the greatest convenience, you'll probably want to use some kind of text expansion (I put it in TextExpander and set it to only expand in Terminal), and you'll probably want to be set up for password-less / public key SSH authentication for your jailbroken iDevice.

I'm no pro with Terminal, so if you have recommendations on how I should improve this, please let me know in the comments. I'll break down my script piece by piece.

  * **scp** "Secure copy," a way to copy things over an SSH connection.
  * **-r** "Recursive," copy the folder and everything inside
  * **-i** "Identify_file," manually choose which SSH private key to authenticate with, only needed if you have multiple separate keys
  * **~/.ssh/mykey\_id\_rsa** The location of my private SSH key
  * **root@iphonebonjourname.local** Authenticate as root. You can use a static IP address instead of a bonjour name.
  * **:** Identifies the "remote" file.
  * **/User/Media/DCIM** Path to DCIM folder on the iPhone, should be the same for your device.
  * **/Users/username/Desktop/%Y%m%d\ Phone\ Pics/** Full path to the local location where I want to place the pics, including the folder name.

I decided to copy the whole DCIM folder because I've occasionally noticed multiple internal folders, and I'm not sure when or why they're created, but I want to get all of them. Also notice the `%Y%m%d` to put the YYYYMMDD date into the folder name, making it much less likely for me to overwrite any preexisting folders, and the "escaped" spaces in the path. Make sure to insert your own username, obviously.

So the full line is this:

<script src="http://pastebin.com/embed_js.php?i=rBGW70Hv"></script>

All I have to do is make sure the phone is awake or connected to power (so its SSH daemon will work), crank up the sprightly Terminal, and type in my TextExpander snippet "ppictures", and the end result is a datestamped folder of all my iPhone pics on my desktop.

To make things even faster, I could set this whole thing up as a <a target="_blank" href="http://qsapp.com/">Quicksilver</a> trigger or a shell script, but then I wouldn't get the nicely formatted datestamp that TextExpander puts in for me. Then again, I bet there's a way to do that with Terminal... I just don't know how.
