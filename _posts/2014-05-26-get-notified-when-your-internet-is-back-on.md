---
id: 2532
title: Get Notified When Your Internet Is Back On
date: 2014-05-26T09:15:39+00:00
author: n8henrie
excerpt: This is my method for getting a push notification on my phone when my internet comes back on.
layout: post
guid: http://n8henrie.com/?p=2532
permalink: /2014/05/get-notified-when-your-internet-is-back-on/
dsq_thread_id:
  - 2713948419
---
**Bottom Line:** This is my method for getting a push notification on my phone when my internet comes back on.<!--more-->

If any of you happen to have the same ISP as me, you may have frequent internet outages. Sometimes, it may take several days to get the internet fixed. Other times, the internet will come and go during the course of a day. (FWIW, I have had the same ISP in multiple houses with numerous changes of routers, cable modems, and lines, with the same issues &#8212; so I&#8217;m pretty sure it&#8217;s not me.)

Because I rely on the internet to get much of my work done, whenever there&#8217;s internet trouble I have to go to the local library. I can think of a few ways to remotely check whether or not my house has connectivity (so I can go back home), but this is my favorite way so far.

My method relies on 

  1. A computer at home running:
  * <a target="_blank" href="http://www.noodlesoft.com/hazel.php" title="Noodlesoft - Hazel">Hazel</a>
  * <a target="_blank" href="https://www.dropbox.com/" title="Dropbox">Dropbox</a></li> 

  2. A <a target="_blank" href="https://pushover.net/" title="Pushover: Simple Notifications for Android, iOS, and Desktop">Pushover</a> account and their mobile app
  3. A mobile device that can upload a file to Dropbox

If you&#8217;ve read [my &#8220;Dropbox and Hazel&#8221; post](http://n8henrie.com/2011/06/dropvox-dropbox-hazel-and-omnifocus/ "DropVox, DropBox, Hazel, and OmniFocus - n8henrie.com") from a few years back, you can probably see where this is going. Basically, the idea is: 

  1. Use cellular data on your mobile device to upload a very small file to a Dropbox folder that syncs to your Mac.
  2. Once internet connectivity is restored to your Mac, Dropbox will sync that file relatively quickly.
  3. Use Hazel to detect the appearance of that file.
  4. Use Hazel to send a Pushover notification to your mobile device.

Simple as that. 

### The Trigger File

My trigger file is an empty text file named `Internet Working.txt`. It sits in a folder called &#8220;LaunchFiles&#8221; in my Dropbox. I use <a target="_blank" href="https://itunes.apple.com/us/app/goodreader-4/id777310222?mt=8&#038;uo=4&#038;at=10l5H6" title="GoodReader 4">Goodreader</a> on my iPhone to move the file from `LaunchFiles` to another folder, `Launch`. 

### The Launch Folder

Hazel monitors `Launch` for this file (among many others), and upon detecting it does two things:

  1. Moves the file back to `LaunchFiles`
  2. Runs a shell script: `/path/to/pushover.sh "Internet is working!"`

### Pushover

This could probably be accomplished through Growl and its Pushover action, but I find a shell script just as easy with Pushover&#8217;s excellent API. First, you&#8217;ll need to buy Pushover and set up an account, then make a new Pushover app and get its credentials. Insert your credentials and `cacert` path into the script below. If you don&#8217;t know about the `cacert`, I believe you can omit the `--cacert` line as long as you also get rid of the `-s` in `curl -s \`, and it should still work. Don&#8217;t forget to `chmod +x pushover.sh`.

<pre>#!/bin/bash

curl -s \
  --cacert "/path/to/cacert.pem" \
  -F "token=YOUR_APP_TOKEN_HERE" \
  -F "user=YOUR_USER_KEY_HERE" \
  -F "message=$1" \
  -F "device=$2" \
  -F "title=$3" \
  -F "url=$4" \
  -F "url_title=$5" \
  -F "priority=$6" \
  -F "timestamp=$7" \
  -F "sound=$8" \
  https://api.pushover.net/1/messages.json

#Usage: sh pushover.sh "message" "device" "title" "url" "url_title" "priority" "timestamp $(date +%s)" "sound"

#token (required) - your application's API token
#user (required) - the user key (not e-mail address) of your user (or you), viewable when logged into the dashboard
#message (required) - your message

#Some optional parameters may be included:
#device (optional) - your user's device identifier to send the message directly to that device, rather than all of the user's devices
#title (optional) - your message's title, otherwise uses your app's name
#url (optional) - a supplementary URL to show with your message
#url_title (optional) - a title for your supplementary URL
#priority (optional) - set to "1" to display as high-priority and bypass quiet hours, or "-1" to always send as a quiet notification
#timestamp (optional) - set to a Unix timestamp to have your message show with a particular time, rather than now
#sound (optional) - set to the name of one of the sounds supported by device clients to override the user's default sound choice
</pre>

That&#8217;s it! If any of you have clever ideas for improving the script I&#8217;d love to hear it &#8212; preferably in the comments section below.