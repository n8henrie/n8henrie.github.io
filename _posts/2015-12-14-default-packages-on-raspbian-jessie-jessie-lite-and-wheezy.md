---
id: 2775
title: List of Default Packages on Raspbian Jessie, Jessie Lite, and Wheezy
date: 2015-12-14T16:12:34+00:00
author: n8henrie
excerpt: Here are the default packages on a fresh image of Raspbian Jessie, Jessie Lite, and Wheezy.
layout: post
guid: http://n8henrie.com/?p=2775
permalink: /2015/12/default-packages-on-raspbian-jessie-jessie-lite-and-wheezy/
dsq_thread_id:
  - 4404310295
disqus_identifier: 2775 http://n8henrie.com/?p=2775
tags:
- linux
- raspberrypi
categories:
- tech
---
**Bottom Line:** Here are the default packages on a fresh image of Raspbian Jessie, Jessie Lite, and Wheezy.<!--more-->

It's not terribly uncommon that I want to give people instructions on how to install some software on their Raspberry Pi, and I can't remember whether or not there are packages that they need to install as prerequisites. Other times, I want to revert some part of my Raspbian system that I've customized, but I can't remember what software it came with and what I installed myself. Whatever the case may be, I've had a good number of times that I wanted to know what all of the default packages were, and I was surprised that I couldn't find the answer on Google.

To that end, I finally got fed up running into this issue and decided to make a copy for my personal reference, and I figured I'd share.

For the lists below, I took a freshly downloaded image, copied it to an SD card, booted up, and ran `sudo dpkg -l > jessie.txt`. I then copied that file to my Macbook and proceeded with the next.

I've included the dates and SHA-1 as listed at <a href="https://www.raspberrypi.org/downloads/raspbian" target="_blank">raspberrypi.org/downloads/raspbian</a>, where I downloaded the images, since I'm sure there will be changes soon.

Raspbian Jessie 2015-11-21 (SHA-1 `ce1654f4b0492b3bcc93b233f431539b3df2f813`)

<script src="https://gist.github.com/n8henrie/38531986893190470dea.js"></script>

Raspbian Jessie Lite 2015-11-21 (SHA-1 `97888fcd9bfbbae2a359b0f1d199850852bf0104`)

<script src="https://gist.github.com/n8henrie/4ebe5a2ad23f2a0ae87b.js"></script>

Raspbian Wheezy 2015-05-05 (SHA-1 `cb799af077930ff7cbcfaa251b4c6e25b11483de`)

<script src="https://gist.github.com/n8henrie/28a9b710bd83643d24d0.js"></script>
