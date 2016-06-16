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
---
**Bottom Line:** Here are the default packages on a fresh image of Raspbian Jessie, Jessie Lite, and Wheezy.<!--more-->

It&#8217;s not terribly uncommon that I want to give people instructions on how to install some software on their Raspberry Pi, and I can&#8217;t remember whether or not there are packages that they need to install as prerequisites. Other times, I want to revert some part of my Raspbian system that I&#8217;ve customized, but I can&#8217;t remember what software it came with and what I installed myself. Whatever the case may be, I&#8217;ve had a good number of times that I wanted to know what all of the default packages were, and I was surprised that I couldn&#8217;t find the answer on Google.

To that end, I finally got fed up running into this issue and decided to make a copy for my personal reference, and I figured I&#8217;d share.

For the lists below, I took a freshly downloaded image, copied it to an SD card, booted up, and ran `sudo dpkg -l > jessie.txt`. I then copied that file to my Macbook and proceeded with the next.

I&#8217;ve included the dates and SHA-1 as listed at <a href="https://www.raspberrypi.org/downloads/raspbian" target="_blank">raspberrypi.org/downloads/raspbian</a>, where I downloaded the images, since I&#8217;m sure there will be changes soon.

Raspbian Jessie 2015-11-21
  
SHA-1 `ce1654f4b0492b3bcc93b233f431539b3df2f813`
  


Raspbian Jessie Lite 2015-11-21
  
SHA-1 `97888fcd9bfbbae2a359b0f1d199850852bf0104`
  


Raspbian Wheezy 2015-05-05
  
SHA-1 `cb799af077930ff7cbcfaa251b4c6e25b11483de`