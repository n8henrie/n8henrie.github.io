---
id: 2777
title: 'rf_pi: Control RF Outlets From Your Raspberry Pi Without Sudo or Root'
date: 2015-12-19T09:14:04+00:00
author: n8henrie
excerpt: "Here's how to control RF switches from your Raspberry Pi without requiring sudo or running as root."
layout: post
guid: http://n8henrie.com/?p=2777
permalink: /2015/12/rf_pi-control-rf-outlets-from-your-raspberry-pi-without-sudo-or-root/
dsq_thread_id:
  - 4417732678
disqus_identifier: 2777 http://n8henrie.com/?p=2777
---
**Bottom Line:** Here’s how to control RF switches from your Raspberry Pi without requiring sudo or running as root.<!--more-->

## Introduction

**tl;dr** Scroll down for the link to the github repo, follow instructions in the README.

There are a huge number of tutorials showing how to get a Raspberry Pi hooked up with an RF transmitter to control RF outlets. However, most of them depend on running the script as root / with `sudo`. That’s probably fine if you’re just manually toggling switches, but it becomes an issue when automating the switches; it means that whatever daemon or background process that it sending the RF codes also needs to be running with sudo / root permissions — at minimum for the script in question. I didn’t care for that, so I’ve put together a repo and some instructions on how to control these switches without running as root or using `sudo`.

As I’m sure many of you can guess, I’m relying on `wiringPi` to export the gpio pins for access by regular users. The problem that one can run into here is that regular users can’t set scheduling priority, and since Raspbian isn’t a “realtime” operating system like what you’ll find on microprocessors like an Arduino, the reliability of the RF transmission can suffer greatly when run by a standard user. This is especially true if the CPU is busy running other processes, and RF transmission depends entirely on the timing. Think of it as the beat of your favorite song — it’s all in the rhythm, and if the drummer got distracted and misses a beat it screws the whole thing up.

As an example, it’s pretty popular to have the Pi host a webapp that is used to toggle the switches. This exemplifies the problems above: most tutorials have you run the webapp as with root permissions, which works well — but if there were a security vulnerability in that webapp, you could be exposing your entire filesystem. On the other hand, if you run the webapp as another user like `www-data` and export the gpio pins, you’d have better security (as hopefully only files owned by `www-data` would really be at risk). However, the extra CPU overhead of running the webapp in the setting of lower user permissions can make RF transmission much less reliable. On my Pi, when the CPU was relatively busy, I found that I was getting 100 / 100 short-distance transmissions properly as `root`, but only around 35 / 100 when running as a standard user.

However, I’ve found that you can give an executable the permissions to set process priority, and thereby both run as a standard user **and** get excellent RF transmission reliability. I’ve compiled and made some minimal modifications to the most useful tools I’ve found for getting this done and put them into a single repo that should get you up and running in no time.

As a little bonus, I also figured out how to compile the program into a shared library that can be used in other languages. Since I do most of my coding in Python, I included a python script that can set process priority using features introduced in python 3.3, import the shared library, and toggle the RF switches in python.

## Links

For starters, here are some links to the original tools that I’ve included in the repo, most with minimal (if any) modification. You should have everything you need in the rf_pi repo, but all credit goes to these folks for writing the tools in the first place; I’ve tried to link to the original from each script as well. I’ve also included a couple links to a few related posts of mine at the end.

  * rf_pi repo: <a href="https://github.com/n8henrie/rf_pi" target="_blank">https://github.com/n8henrie/rf_pi</a>
  * <a href="https://github.com/r10r/rcswitch-pi" target="_blank">https://github.com/r10r/rcswitch-pi</a>
  * <a href="http://code.google.com/p/rc-switch" target="_blank">http://code.google.com/p/rc-switch</a>
  * <a href="https://github.com/ninjablocks/433Utils" target="_blank">https://github.com/ninjablocks/433Utils</a>
  * <a href="https://projects.drogon.net/raspberry-pi/wiringpi" target="_blank">https://projects.drogon.net/raspberry-pi/wiringpi</a>
  * [How to Control Your Raspberry Pi by SMS](http://n8henrie.com/2015/03/how-to-control-your-raspberry-pi-by-sms/)
  * [Range Testing for Wireless Arduino Projects: RF 433 MHZ and NRF24L01+](http://n8henrie.com/2015/03/range-testing-for-wireless-arduino-projects-rf-433-mhz-and-nrf24l01/)

## Equipment

  * <a href="http://www.amazon.com/gp/product/B00LPESRUK/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00LPESRUK&linkCode=as2&tag=o5284-20" target="_blank" title="Raspberry-Pi-Model-512MB-Computer">Raspberry Pi model B+</a> (likely possible with other models, but only tested on B+)
  * Optimized to run on **Raspbian Jessie** (`cat /etc/issue` and look for `GNU/Linux 8`), but also working on Raspbian Wheezy
  * <a href="http://n8h.me/1HWwr7E" target="_blank">433 MHz RF transmitter</a>
  * <a href="http://www.amazon.com/gp/product/B00DQELHBS/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00DQELHBS&linkCode=as2&tag=o5284-20" target="_blank" title="Etekcity-Wireless-Electrical-Household-Appliances">433 MHz remote controlled outlets</a>
  * Optional: 433 MHz remote for outlets (needed if you don’t know your RF codes, included in the outlet kit linked above)
  * Optional: 433 MHz RF receiver (needed if you don’t know your RF codes, included in the transmitter kit I linked above)

## Step 1: Install the dependencies and clone the <a href="https://github.com/n8henrie/rf_pi" target="_blank">rf_pi repo</a>

It’s probably easy to just follow the <a href="https://github.com/n8henrie/rf_pi/blob/master/README.md" target="_blank">instructions in the README</a> — I’ll try to keep them up to date if anything changes.

Please note that the `master` branch is for Raspbian Jessie. You need to `git checkout wheezy` if you you’re still on wheezy! Afterwards, follow the instructions to customize the scripts as needed and compile the `send` and `RF_Sniffer` programs and `send.so` shared library.

## Step 2: Find your RF codes

You’ll need to know the **RF codes** that your remote uses to communicate with the plugs. The codes come in at least forms — Decimal, Binary, and Tri-State — write down _all_ of them. You’ll also need to know the **pulse length**. If you have an RF receiver, you can use the `RF_Sniffer` sketch to find this information from the Pi.

### Alternative: find your RF codes using Arduino

You shouldn’t have any trouble using `RF_Sniffer` to find them on your Pi, but if you wanted, you could also get them from an Arduino. First, install the <a href="https://github.com/sui77/rc-switch" target="_blank">rc-switch Arduino library</a> into your Arduino libraries folder (in your Arduino sketchbook, which you can find in your Arduino preferences). You can manually download and extract the .zip file, or in Terminal:


```bash
# First quit Arduino.app, and replace your sketchbook path below
cd $ARDUINO_SKETCHBOOK/libraries
git clone https://github.com/sui77/rc-switch
```

Re-open Arduino.app, and open `examples` -> `rc-switch` -> `ReceiveDemo_Advanced`, which you can use to help you find your RF codes and pulse length, by wiring up an RF receiver to your Arduino and clicking your remote while watching Arduino’s Serial Monitor.

### Alternative: use your computer’s sound card as an oscilloscope

I _strongly_ recommend you just use one of the methods above, but you can technically do this manually if you have an appropriate power source and some basic electronics equipment. You may put your safety and your computer at risk doing it this way, but if you’re really interested, see my post here: http://n8henrie.com/2014/09/macbook-pro-sound-card-audacity-oscilloscope/

## Step 3: Test the `send` program

After cloning the repo and compiling, hold your breath and `./send 12345` where `12345` is one of your **decimal** RF codes. Hopefully you hear the _click_ of the outlet’s relay! I’ve made it so you can also send multiple codes, `./send 12345 2345`.

## Step 4: Test the `rf_send.py` script

Just like before, `python rf_send.py 12345`. For best results:

  * Run with python >= 3.3
  * Install `libcap2-bin` and do the `setcap` stuff as per the README

## Step 5: Modify and profit!

This is just an example repo to get you up and running quickly — the real fun comes in when you write your own scripts. For example, if you were to write a script `test.py` in the directory containing `rf_pi`:

    """test.py
    Sends an RF code via rf_send.
    """
    
    from rf_pi import rf_send
    
    if __name__ == "__main__":
        rf_send.rf_send(['12345'])

Easy as that! If you’re interested in contributing examples of using `send.so` in other languages like ruby or nodejs, please make a pull request!
