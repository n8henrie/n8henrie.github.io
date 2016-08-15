---
id: 2837
title: Installing CrashPlan on the Raspberry Pi (Raspbian Jessie)
date: 2016-06-11T17:35:09+00:00
author: n8henrie
excerpt: My strategy for getting CrashPlan working on the Raspberry Pi (currently on Raspbian Jessie)
layout: post
guid: http://n8henrie.com/?p=2837
permalink: /2016/06/installing-crashplan-on-the-raspberry-pi-raspbian-jessie/
dsq_thread_id:
  - 4904839092
disqus_identifier: 2837 http://n8henrie.com/?p=2837
---
**Bottom Line:** My strategy for getting CrashPlan working on the Raspberry Pi (currently on Raspbian Jessie).<!--more-->

I’ve been using a Raspberry Pi as a local backup destination for CrashPlan for a few years now. Recently, CrashPlan has started automatically upgrading itself every few weeks to months, which breaks my install. Every time, I end up Googling around and referencing <a href="https://melgrubb.com/2014/08/01/raspberry-pi-home-server-part-10-crashplan/" target="_blank">this thread</a> and a few others.

However, I find that I don’t need to take all the steps listed there, and much of the helpful material is in a long comment thread. Additionally, all of the setups I found included replacing `libjtux.so` and `libmd5.so` with some ARM compiled versions downloaded from somebody’s website without any kind of hash to verify the download integrity — this made me a little nervous, being that this software will likely “see” nearly _all_ of my sensitive documents and materials.

A few months ago I went ahead and condensed my setup into a GitHub Gist, and with the 4.7.0 update (which again broke my CrashPlan on the Pi installation this month), I thought I’d go ahead and share. I never recommend just copying and pasting someone else’s script, especially when it’s this short and basic, so take a look and try to understand what each command is doing. EDIT: I’ve expanded the script a fair bit to make it a little more user friendly and complete. You can check out the revision history to see <a href="https://gist.github.com/n8henrie/37d96807e31d94ca0464/31a8ea7e3eac2f9c2faeb8f96c0e4bc4cf9d51f4" target="_blank">the much simpler version it started with</a>.

This script assumes you’re choosing the default answers to all the prompts in the CrashPlan installer. However, it also assumes that you’re using a systemd service file to start CrashPlan (instead of the sysvinit style scripts it ships with). I find the systemd scripts much easier to understand and maintain, and I’ve included what I use below (as well as a prompt in the script to download mine if desired).

I’ve briefly re-tested the script on a blank Raspbian Jessie Lite installation and it seems to work well. I was able to connect to the UI via SSH as described in the <a href="https://support.code42.com/CrashPlan/4/Configuring/Using_CrashPlan_On_A_Headless_Computer" target="_blank">official CrashPlan Docs</a>

**NB:** This script does _not_ cover mounting an external hard drive or configuring it as your CrashPlan backup destination.



My systemd service file:



Some folks have recommended increasing the number of inotify watches with the commands below; this is another thing that I didn’t do, and it seems to be running okay on my RPi 3.

<pre><code class="bash">echo 1048576 | sudo tee /proc/sys/fs/inotify/max_user_watches
echo 'fs.inotify.max_user_watches=1048576' | sudo tee -a /etc/sysctl.conf</code></pre>