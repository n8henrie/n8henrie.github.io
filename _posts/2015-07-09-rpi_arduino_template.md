---
id: 2742
title: 'rpi_arduino_template :: Program and Control Your Arduino From Your Raspberry Pi'
date: 2015-07-09T15:45:40+00:00
author: n8henrie
excerpt: "Here's how to program and trigger actions on your Arduino from your Raspberry Pi, all over CLI."
layout: post
guid: http://n8henrie.com/?p=2742
permalink: /2015/07/rpi_arduino_template/
dsq_thread_id:
  - 3919809008
disqus_identifier: 2742 http://n8henrie.com/?p=2742
tags:
- arduino
- DIY
- electronics
- raspberrypi
categories:
- tech
---
**Bottom Line:** Here’s how to program and trigger actions on your Arduino from your Raspberry Pi, all over CLI.<!--more-->

I run my Raspberry Pi headless and control it [exclusively from SSH](http://n8henrie.com/2015/02/raspberry-pi-setup-direct-ethernet/). While I’d known for a while that you could install the Arduino GUI on the Pi and use it to write and install Arduino sketches, I’d honestly rather write my code in vim. I recently discovered <a href="https://github.com/sudar/Arduino-Makefile" target="_blank">Arduino Makefile</a>, which facilitates compiling and programming your Arduino over CLI. However, being an amateur at all this, I still ran into a few glitches along the way.

While you can do a great deal with the Pi’s GPIO, I think the Arduino is much better suited for doing things that are real-time dependent, such as sending 433 MHz RF signals. I find that my Pi can send them reliably when nothing else is going on, but even the slightest interference from other running processes cripples the reliability of RF transmission. For example, I can get 29 / 30 RF transmissions sent and received properly after a reboot without other running processes, but if I start up the web server running my home automation software, I’m instantly down to maybe 2 or 3 out of 30 making it through. The reasons for this are outside of the scope of this post, and I’ve identified some workarounds using `setcap` and scheduling, but it is a bit of a hassle. The Arduino is simply a better machine for this kind of task.

In the end, I was able to get set up to write sketches in vim, program them via USB from the command line, and even use serial-over-USB to interactively trigger actions on the Arduino from the Pi. Because I also program ATMEGA328p chips using my USBasp, I made sure the setup also works for this purpose, and I also made sure this all works on my Macbook Pro as well (just needs one extra ENV variable, see comments in `Makefile`).

I put the instructions and example files together into a GitHub repo <a href="https://github.com/n8henrie/rpi_arduino_template" target="_blank">here</a>. Hopefully this will make it much easier for other beginners to get up and running. `git clone https://github.com/n8henrie/rpi_arduino_template.git`, open up the README, and hopefully everything is explained in sufficient detail.

I **strongly** recommend that you use a powered USB hub to connect the Arduino to the Pi, since its power draw (and especially any connected accessories) would likely make your Pi run erratically if connected directly.

If you give it a shot please let me know in the comments section below!