---
id: 2692
title: How I Set Up a New Raspberry Pi With Just an Ethernet Cable
date: 2015-02-02T08:53:01+00:00
author: n8henrie
excerpt: When I get a new Raspberry Pi, here is how I get it up and running with SSH over an ethernet cable directly attached to my MacBook.
layout: post
guid: http://n8henrie.com/?p=2692
permalink: /2015/02/raspberry-pi-setup-direct-ethernet/
dsq_thread_id:
  - 3478516068
disqus_identifier: 2692 http://n8henrie.com/?p=2692
tags:
- homeautomation
- linux
- raspberrypi
- Terminal
categories:
- tech
---
**Bottom Line:** When I get a new Raspberry Pi, here is how I get it up and running with SSH over an ethernet cable directly attached to my MacBook.<!--more-->

I've really had a lot of fun over the last year or two learning some of the basics of Linux and the command line with the <a href="http://www.raspberrypi.org/" target="_blank">Raspberry Pi</a>. The process has definitely made me a more capable Mac user, and I now have a Chromebook running Arch Linux as well.

In short, the Raspberry Pi Foundation is a non-profit organization whose goal was to develop a computer that would be affordable to people worldwide and facilitate learning computer science, programming, and electronics. Their two most recent models are the <a href="http://www.raspberrypi.org/products/model-b-plus/" target="_blank">B+</a>, which is credit-card sized and runs $35, and the slightly smaller <a href="http://www.raspberrypi.org/products/model-a-plus/" target="_blank">A+</a>, which is even more energy efficient and runs $25. Because they are UK based, shipping adds a bit to the cost from their distributors, but currently you can buy <a href="http://n8h.me/1Dik8zd" target="_blank">a B+ through Amazon</a> for ~$33 with free shipping (not Prime) and <a href="http://n8h.me/1Dikm9u" target="_blank">an A+</a> for ~$25 with Prime shipping.

It has a great HDMI output and has a powerful enough graphics chip to display 1080p. That said, I've never hooked mine up to a monitor. Instead, all I need to get up and running is:

  * a micro USB cable for power 
      * I generally like to use it with <a href="https://www.adafruit.com/product/501" target="_blank">this AC -> USB power adapter from Adafruit</a>
  * a micro SD card for storage 
      * I like <a href="http://n8h.me/1Dimhed" target="_blank">this $11, prime-eligible 16GB card</a> from Amazon
      * If you're using a RPi B instead of a B+ you'll need a different kind of card, it doesn't use the micro SD cards
      * The micro SD card I linked to also has a full-size SD card adapter, which is necessary to program it from the MBP SD card slot. If your computer doesn't have an SD card slot and / or your micro SD card doesn't come with an adapter, you'll also need to pick up some kind of USB-to-micro-SD device.
  * an ethernet cable

Basically, aside from the bare minimum (power and SD card), the ethernet cable is sufficient to program everything over SSH from the MacBook. **NB:** My technique will need adjustment for folks with newer MacBooks (Airs and such) that don't have an ethernet port!

The steps below should be used as a general guide and not necessarily followed verbatim. Please read my <a href="/disclaimer" target="_blank">disclaimer</a> before you blindly follow any of these steps! This is not intended to be run all at once as a shell script, instead each step should be run individually, especially since some are intended to be run from your Mac and others from the RPi. Most of the code blocks ( `looks like this` ) are intended to be run from Terminal.app on your Mac.

## Setting up the SD card

### From Mac, with micro SD card connected

  1. Torrent latest Raspbian distro: <a href="http://downloads.raspberrypi.org/raspbian_latest.torrent" target="_blank">http://downloads.raspberrypi.org/raspbian_latest.torrent</a>
  2. Unzip / extract the image
  3. Insert SD card into Mac
  4. Identify the `/dev/disk` number of the SD card: `diskutil list`
  5. Replace `#` with the appropriate number `diskutil unmountDisk /dev/disk#`
  6. Double check that number, since the next step could erase your MacBook's hard drive if you got it wrong
  7. Copy the Raspbian image to the SD card: `sudo dd if=raspbian.img of=/dev/rdisk# bs=1m && sync`
  8. `diskutil eject /dev/disk#`
  9. Remove the SD card and insert into the RPi

## Setting up the RPi, still from the OS X Terminal

### After connecting RPi directly with Ethernet cable but before powering it on:

  1. On Mac turn on System Preferences -> Sharing -> Internet Sharing (make sure ethernet is checked)
  2. Turn on the RPi
  3. Output the RPi's IP address with `arp -a | grep bridge | grep -v -e incomplete -e 255 | grep -oE '\d+\.\d+\.\d+\.\d+'` 
      1. If the above command doesn't work, you may have to break it down into manual steps by:
      2. Connect everything and power up Pi
      3. Turn off Internet Sharing and wait a few seconds
      4. `arp -a`
      5. Turn on Internet Sharing, wait about a minute
      6. `arp -a`
      7. Comparing the output from the two `arp -a`s, look for a new address that probably involves the word "bridge", likely one without `255` anywhere, and there's a good chance it starts with `192.168`
  4. SSH into the address you found using username `pi`, i.e. `ssh pi@192.168.X.X`
  5. You should probably write down that IP address as well
  6. Default password is `raspberry`
  7. `sudo raspi-config`
  8. Go through every option. My notes: 
      * First thing first: Expand Filesystem
      * Locale: Deselect the GB one, select `en_US.UTF-8 UTF-8`
      * Advanced -> hostname, add a friendly (simple character only) name you want to call your Pi, e.g. `fred` or `mypi`
      * Consider changing GPU memory — mine run headless, so I distribute all the memory away from the GPU
  9. Reboot `sudo reboot` and reconnect by ssh
 10. Update the available packages: `sudo apt-get update`
 11. Upgrade available updates: `sudo apt-get upgrade`
 12. Upgrade the RPi firmware: `sudo rpi-update`
 13. `sudo reboot`

## Start customizing your installation

### Install important packages and tools

  1. Become superuser (instead of the `pi` user): `sudo su`
  2. Install your basic set of important utilities and packages (yours should be different, as you learn what tools you like to use): `aptitude install vim git monit avahi-daemon libssl-dev i2c-tools watchdog python3`
  3. Install ack (very optional, can also just `aptitude install ack-grep`, but I prefer this way) 
      * `curl -L https://cpanmin.us | perl - App::cpanminus`
      * `cpanm App::Ack`

### Make a new user (so you can eventually delete `pi` — important for security), still as superuser / root

  1. Replace USER with your username of choice: `adduser USER`
  2. Set a new password for your new user: `passwd USER`
  3. Set an editor for use with visudo: `update-alternatives --set editor /usr/bin/vim.tiny` 
      * Warning: vim is my editor of choice but is pretty tough to use and certainly not intuitive. If you're unfamiliar with vim, <a href="http://bit.ly/1yZ3hC5" target="_blank">Google some alternative text editors</a>, install them (or verify they are installed), and replace `/user/bin/vim.tiny` with something like `--set editor $(which YOUR_EDITOR)`
  4. Edit the (very important) sudoers file to set who can have superuser (e.g. `su`, `sudo`) privileges: `visudo` 
      * Copy `root    ALL=(ALL:ALL) ALL` to a new line
      * In that copied line, change `root` to your new USER
      * Save and exit (`:wq` in vim)

### Optional: If you intend to use the GPIO, still as superuser

  1. `vim /etc/modules` 
      * add `i2c-bcm2708`
      * add `i2c-dev`
      * add `bcm2708_wdog`
  2. `vim /etc/modprobe.d/raspi-blacklist.conf` and comment out: 
      * `blacklist spi-bcm2708`
      * `blacklist i2c-bcm2708`
      * Save and exit

### Optional: Set up watchdog (to automatically reboot the Pi if it freezes — very rare, but just in case), still as superuser

  1. `update-rc.d watchdog defaults`
  2. `vim /etc/watchdog.conf` 
      * Uncomment `watchdog-device = /dev/watchdog`
      * Uncomment `max-load-1      = 24` (e.g. it would take 24 RPis to complete a given in 1 minute)
      * Save and exit

### Very optional: install python3.4 from source (using my Gist), still as superuser

  1. `wget https://gist.github.com/n8henrie/dfde0e7f9e0802612251`
  2. `bash update_python3.sh`
  3. Install important packages: `/opt/python3.4.2/bin/pip3 install RPi.GPIO pyserial wiringpi2`

## Verify your new user and password is working

  1. `reboot`
  2. From your Mac, using your new USER and password: `ssh USER@192.168.X.X`
  3. If it works, this command should both verify that you have properly given yourself `sudo` privileges and also delete the `pi` user and home directory: `sudo userdel -r pi`
  4. If that worked, you can `sudo visudo` and delete the line `pi ALL=(ALL) NOPASSWD: ALL` (and any other line involving the `pi` user)

At this point you're up and running! My next step is often to connect up a WiFi adapter and set it up over the ethernet cable, after which you can find the new WiFi card's IP address, lose the ethernet cable, turn off internet sharing on your Mac, and continue to access the Pi via SSH from WiFi. Have fun!