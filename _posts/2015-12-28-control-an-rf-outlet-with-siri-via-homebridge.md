---
id: 2793
title: How to Control an RF Outlet with Siri using HomeKit via Homebridge
date: 2015-12-28T07:55:45+00:00
author: n8henrie
excerpt: "Here's how to control cheap RF outlets directly from Siri using HomeKit by way of homebridge."
layout: post
guid: http://n8henrie.com/?p=2793
permalink: /2015/12/control-an-rf-outlet-with-siri-via-homebridge/
dsq_thread_id:
  - 4439675415
disqus_identifier: 2793 http://n8henrie.com/?p=2793
tags:
- electronics
- homeautomation
- iPhone
- raspberrypi
- Siri
categories:
- tech
---
**Bottom Line:** Here’s how to control cheap RF outlets directly from Siri using HomeKit by way of homebridge.<!--more-->

## Introduction

Apple’s home automation suite is called <a href="http://www.apple.com/ios/homekit/" target="_blank">HomeKit</a>. It works with Siri, which is great. In true Apple fashion, it seems like they are making it _really_ difficult for third parties to get “HomeKit Certified,” and so you won’t see a _whole_ lot of devices carrying this:<br />![]({{ site.url }}/uploads/2015/12/20151222_ScreenShot2015-12-22at6.08.11AM.jpg)

Luckily, some people much smarter than me have developed an alternative route
to use Siri to control devices around the house: make a server that _emulates_
the HomeKit API: <a href="https://github.com/nfarina/homebridge"
target="_blank">homebridge</a>. This tutorial covers how to go about setting up
homebridge on a Raspberry Pi, and how to install my version of the nodejs
implementation of RCSwitch in order to control cheap RF outlets with Siri.

Here’s the obligatory YouTube video showing it in action (**NB:** if you watch it on or near an iOS device with “Hey Siri” enabled, it might activate it). Also note that everything is _much_ quicker when run through my iPhone 6S or when run through the app instead of Siri, but I wanted to demonstrate on my old 1st gen iPad Mini so I could record with the iPhone.

<iframe width="420" height="315" src="https://www.youtube.com/embed/14RSUz3GSO4" frameborder="0" allowfullscreen></iframe>

**Update 20161111:** In the [original
version](https://github.com/n8henrie/n8henrie.github.io/blob/ec40e58b3d777427b821ff357f95072a484c1aa6/_posts/2015-12-28-control-an-rf-outlet-with-siri-via-homebridge.md
of this post) I talked about using GNU Stow to manage my nodejs installation.
However, I have since realized that Stow seems mostly aimed at helping people
manage apps that they are compiling from source, and I'm using the pre-compiled
nodejs binaries, which led to a few subtle bugs related to node upgrades. In
the end, I've relocated my `nodejs` installation to `/opt/nodejs`, as you'll be
able to see in my updated gist, below. I've gone back to try to remove
references to Stow from the post to avoid confusion; please let me know if I've
missed any. Shout out to [mefynn](http://disq.us/p/1cswe7u) for bringing this
to my attention in the comments!

## Overview

  * Install a HomeKit controller app for iOS
  * Install and configure `homebridge`
  * Install and configure `homebridge-rcswitch-gpiomem`

## Equipment

  * <a href="http://www.amazon.com/gp/product/B00LPESRUK/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00LPESRUK&linkCode=as2&tag=o5284-20" target="_blank" title="Raspberry-Pi-Model-512MB-Computer">Raspberry Pi model B+</a> (likely possible with other models, but only tested on B+)
  * Optimized to run on **Raspbian Jessie** (`cat /etc/issue` and look for `GNU/Linux 8`), but likely works on Raspbian Wheezy
  * <a href="http://n8h.me/1HWwr7E" target="_blank">433 MHz RF transmitter</a>
  * <a href="http://www.amazon.com/gp/product/B00DQELHBS/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00DQELHBS&linkCode=as2&tag=o5284-20" target="_blank" title="Etekcity-Wireless-Electrical-Household-Appliances">433 MHz remote controlled outlets</a>
  * Optional: 433 MHz remote for outlets (needed if you don’t know your RF codes, included in the outlet kit linked above)
  * Optional: 433 MHz RF receiver (needed if you don’t know your RF codes, included in the transmitter kit I linked above)

## Recommended: Install and test rf_pi

  * My post on rf_pi: [Control RF Outlets From Your Raspberry Pi Without Sudo / Root](http://n8henrie.com/2015/12/rf_pi-control-rf-outlets-from-your-raspberry-pi-without-sudo-or-root/)

this step isn’t _strictly_ necessary, but will be **enormously** helpful as a
sanity-check and for debugging, as well as making sure you have working rf
codes and that your transmitter functions as expected.

## Step 1: Install a HomeKit controller app for iOS

I recently covered how to install Apple’s open source HomeKit Catalog app for free, which is my preference as it allows you total control of your data, but there are easier options. Here’s a link to my post and a few of the popular HomeKit apps you could also try.

  * My post: [How to Install Apple’s HomeKit Catalog App on iOS with Xcode](http://n8henrie.com/2015/12/how-to-install-apples-homekit-catalog-app-on-ios-with-xcode/)
  * <a href="https://itunes.apple.com/us/app/elgato-eve/id917695792?mt=8&at=10l5H6" target="_blank">Elgato Eve</a> (free)
  * <a href="https://itunes.apple.com/us/app/insteon+/id919270334?mt=8&at=10l5H6" target="_blank">Insteon+</a> (free)
  * <a href="https://itunes.apple.com/us/app/mytouchhome/id965142360?mt=8&at=10l5H6" target="_blank">MyTouchHome</a> ($1.99)
  * <a href="https://itunes.apple.com/us/app/home-smart-home-automation/id995994352?mt=8&at=10l5H6" target="_blank">Home — Smart Home Automation</a> ($14.99)
  * <a href="https://itunes.apple.com/us/app/myhome-app/id1054351812?mt=8&at=10l5H6" target="_blank">MyHome App</a> (free, looks like it may be an exact copy of Apple’s HomeKit Catalog)

## Step 2: Install nodejs

I made a script to help me quickly install the latest nodejs v4 (5 is out and also works, 4 is the “long term support” version currently). I put my installer script into a GitHub Gist — you’re welcome to check out the content below and either follow the steps manually, or just `wget https://gist.githubusercontent.com/n8henrie/709a04e53a8569c14c1f/raw -O get_nodejs.sh` and `sudo bash get_nodejs.sh`.

A few things to note if you use my script here:

* Will likely require sudo / root permissions (depending on the permissions of the folder you choose to install into; on Jessie `/usr/local` is `root:staff` owned by default)
* The script is set to install node to `/opt/nodejs`; you’ll need to edit the script if you want to install to a different directory.
* I haven't included these directories in my `PATH`, so to use them you'll
  either need to do so, or just use the full `/path/to/node` (e.g.
  `/opt/nodejs/bin/node`), or move / symlink them into a directory that *is* in
  your path instead of `/opt/nodejs`.
* Be forewarned, at the end of the script, I have it set to change ownership of the `nodejs` folder to allow you to install npm packages globally without requiring sudo. On my first run of installing homebridge I left the default `root:staff` ownership and just did `sudo npm install -g` for everything and it led to headaches. See <a href="https://docs.npmjs.com/getting-started/fixing-npm-permissions" target="_blank">some alternative solutions at the official nodejs docs</a>.

If you add `/opt/nodejs/bin` to your `PATH`, you can confirm you have the
`node` and `npm` commands with `command -v node` or `command -v npm`, which
should output the path to these commands. As I mentioned, I didn't add them to
my `PATH`, so I'm just using the full path to the command in the examples
below. You might save yourself a lot of typing by just adding them to your path
with `export PATH=/opt/nodejs/bin:"${PATH}"`, after which you can confirm they
are found with `command -v node` (should output `/opt/nodejs/bin/node`) and
`command -v npm` -> `/opt/nodejs/bin/npm`; in this case, you could just use
`node` and `npm` instead of the full path to these commands in the code below,
but you'll probably also want to make sure your changes to `PATH` are reloaded
on reboot, which is outside the scope of this post. (Hint: Google `.bashrc
PATH`)

<script src="https://gist.github.com/n8henrie/709a04e53a8569c14c1f.js"></script>

As a sanity check, here’s what I ended up with:

```shell_session
$ /opt/nodejs/bin/node --version
v4.5.0
$ /opt/nodejs/bin/npm --version
2.15.9
$ ls -ld /opt/nodejs
drwxr-sr-x 7 n8henrie n8henrie 4096 Sep 6 12:05 /opt/nodejs
```

## Step 3: Install homebridge

```shell_session
# Install homebridge and homebridge-rcswitch-gpiomem
sudo apt-get install libavahi-compat-libdnssd-dev
/opt/nodejs/bin/npm install -g homebridge
```

## Step 4: Configure and test homebridge

```shell_session
# Add an account for `homebridge` to avoid needing to run as root
sudo useradd -r -s /bin/false homebridge

# Add `homebridge` user to `gpio` group to give permissions to use gpio
sudo usermod -a -G gpio homebridge

# Add required directories and permissions since it needs to be able
# to create `/etc/homebridge/persist` folder itself
sudo mkdir -p /etc/homebridge
sudo chown homebridge /etc/homebridge
```

I _highly_ recommend that you do another “sanity check” at this point by installing a fake Homebridge accessory and making sure that everything is working. If things aren’t working right at this point, you’ll drive yourself nuts trying to figure out where the problem is if you keep going. I think the easiest way is to install the <a href="https://github.com/nfarina/homebridge-dummy" target="_blank">`homebridge-dummy`</a> package. I’ve made <a href="https://gist.github.com/n8henrie/639c7f5d72b4202cce7e" target="_blank">a config file</a> that you should be able to just `wget` and test (**NB:** this will overwrite your existing config, so back it up somewhere before you use the `wget` step below).

```shell_session
# Install homebridge-dummy
/opt/nodejs/bin/npm install --global homebridge-dummy

# Download my fake config file
sudo wget https://gist.github.com/n8henrie/639c7f5d72b4202cce7e/raw -O /etc/homebridge/config.json

# Delete the persist folder
sudo rm -rf /etc/homebridge/persist

# Run homebridge in debug mode as the `homebridge` user -- you may need to adjust the paths
sudo -u homebridge DEBUG=* /opt/nodejs/bin/homebridge -D -U /etc/homebridge
```

If it looks like it’s running, open your iOS device and launch the HomeKit app you installed in Step 1. Each app will be different; with HomeKit Catalog, you’ll add and name a “home,” and then add an “accessory.” Hopefully at this point you’ll see homebridge — if so, most of the hard work is done and you’re almost there! Click homebridge, manually type in the PIN (I could never get it to scan in), and hopefully it will confirm it worked. If it fails, try again — I had to do it 3 or 4 times at one point. Also consider trying some of the troubleshooting steps below.

If it seemed to work okay and you were able to add homebridge to the app, you should clean out the “dummy” configuration and proceed.

  * On iOS in HomeKit Catalog: hit `Configure` button in bottom right _twice_ -> swipe left to delete the “home” you set up
  * On iOS: `Settings.app` -> `Privacy` -> `HomeKit` -> `Reset HomeKit Configuration`
  * On Raspberry Pi: `sudo rm -rf /etc/homebridge/persist`

## Step 5: Install and configure `homebridge-rcswitch-gpiomem`

Now for the final touch — installing my modified versions of the `node-rcswitch` and `homebridge-rcswitch` libraries to control those RF outlets. My code has pretty minor changes, all credit should go to the original developers:

  * <a href="https://github.com/marvinroger/node-rcswitch" target="_blank">https://github.com/marvinroger/node-rcswitch</a>
  * <a href="https://github.com/FWeinb/homebridge-rcswitch" target="_blank">https://github.com/FWeinb/homebridge-rcswitch</a>
  * <a href="https://github.com/32leaves/rcswitch-NodeOnPi" target="_blank">https://github.com/32leaves/rcswitch-NodeOnPi</a>
  * <a href="https://github.com/r10r/rcswitch-pi" target="_blank">https://github.com/r10r/rcswitch-pi</a>
  * <a href="http://code.google.com/p/rc-switch" target="_blank">http://code.google.com/p/rc-switch</a>
  * <a href="https://projects.drogon.net/raspberry-pi/wiringpi" target="_blank">https://projects.drogon.net/raspberry-pi/wiringpi</a>

Links to my versions:

  * <a href="https://github.com/n8henrie/node-rcswitch-gpiomem" target="_blank">https://github.com/n8henrie/node-rcswitch-gpiomem</a>
  * <a href="https://github.com/n8henrie/homebridge-rcswitch-gpiomem" target="_blank">https://github.com/n8henrie/homebridge-rcswitch-gpiomem</a>

Important differences with my `-rcswitch-gpiomem` versions:

  * They use the <a href="http://wiringpi.com/pins/" target="_blank">BCM pin, not the wiringPi pin</a>, e.g. `17` instead of ``
  * `rcswitch.setPulseLength` is exposed
  * They will use Raspbian Jessie’s `/dev/gpiomem` by default, so they **don’t require sudo / root access**
  * wiringPi requires a `WIRINGPI_GPIOMEM` env variable to use this interface, and it doesn’t matter what the value is set to (e.g. `WIRINGPI_GPIOMEM=0 vs`WIRINGPI_GPIOMEM=1`vs`WIRINGPI_GPIOMEM=999\`)
  * My `-rcswitch-gpiomem` libs **automatically** export `WIRINGPI_GPIOMEM=1` if the value is not already set
  * If can’t (e.g. Wheezy) or don’t want to use `/dev/gpiomem`, you have to `export WIRINGPI_GPIOMEM=0`
      * You will need to use wiringPi’s `gpio` tool to `export` your pin beforehand, and the module will use `wiringPiSetupSys` instead
  * If you have `libcap2-bin` installed and you `sudo setcap cap_sys_nice+ep /opt/nodejs/bin/node`, my modules will use `sched.h` to try to give the RF transmission high priority in order to optimize reliability (e.g. in case of high CPU use)

To install `homebridge-rcswitch-gpiomem`: `/opt/nodejs/bin/npm install -g homebridge-rcswitch-gpiomem`

FYI, `homebridge-rcswitch-gpiomem` depends on (and automatically installs) <a href="https://github.com/n8henrie/node-rcswitch-gpiomem" target="_blank">`rcswitch-gpiomem`</a>, which you can also install and use independently like so:

```shell_session
$ export NODE_PATH=/opt/nodejs/lib/node_modules
$ /opt/nodejs/bin/npm install --global rcswitch-gpiomem
$ /opt/nodejs/bin/node
> var rcswitch = require("rcswitch-gpiomem")
> rcswitch.enableTransmit(17)
> rcswitch.setPulseLength(190)
> // Where `12345` is your RF code and `24` is your bit length:
> rcswitch.send(12345, 24)
```

After installing, you’ll need to edit the `config.json`, and once again you can start out with my sample:

```shell_session
sudo rm -rf /etc/homebridge/persist
sudo wget https://raw.githubusercontent.com/n8henrie/homebridge-rcswitch-gpiomem/master/config-sample.json -O /etc/homebridge/config.json
sudo vim /etc/homebridge/config.json
```

Please note that I tried to keep compatibility with the `systemcode` / `unitcode` system used by the prior authors, but for my RF switches I just use an `onCode` and `offCode`. As long as one of these pairs of codes is defined it should work. You can provide these either as the “decimal” value (like I use in `rf_pi`), in which case the json needs to be an integer and not a string (e.g. `"onCode": 12345`), or as the “binary” value, in which case the json needs to be a string and not an integer (e.g. (e.g. `"onCode": "010010110"`) — note the difference in quotes. If using the decimal version, you can optionally provide an integer `bitLength`, which will default to `24` if unset. In either case you can also set an integer `pin`, which defaults to `17`, and `pulseLength`, which defaults to `190`.

If you want to use the “high priority” feature:

  * You should probably at minimum read about this in `rf_pi` if — like myself — you don’t really know what you’re doing
  * Give `node` high priority: `sudo setcap cap_sys_nice+ep /opt/nodejs/bin/node`
  * Check that it was set: `getcap /opt/nodejs/bin/node`
  * Remove high priority: `sudo setcap -r /opt/nodejs/bin/node`

At this point, you should probably run again in debug mode to see if everything worked — you’ll likely need to delete the `persist` folder and set up your iOS app from scratch. With any luck, you’ll see your switches in the iOS app and be able to control them from there and with Siri!

```shell_session
sudo rm -rf /etc/homebridge/persist
sudo -u homebridge DEBUG=* /opt/nodejs/bin/homebridge -D -U /etc/homebridge
```

## Step 6: Run automatically at boot

Once everything is working, you’ll probably want this service to be available all the time. To make a startup script for Raspbian Jessie: `sudo vim /etc/systemd/system/homebridge.service`

Here is what seems to be working for me, you may need to change the paths:

```config
[Unit]
Description=homebridge daemon
Requires=network.target

[Service]
Type=simple
User=homebridge
ExecStart=/opt/nodejs/lib/node_modules/homebridge/bin/homebridge -U /etc/homebridge
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
```

Then to load and start it:

```shell_session
sudo systemctl daemon-reload
sudo systemctl enable homebridge.service
sudo systemctl start homebridge.service
```

You should be able to see the output with `sudo journalctl -x -b -u homebridge`.

## Troubleshooting

Most everything with regard to configuration and setup is very similar to my [rf_pi](http://n8henrie.com/2015/12/rf_pi-control-rf-outlets-from-your-raspberry-pi-without-sudo-or-root/) project, which is much easier to test and debug with in my opinion. Again, I strongly recommend you install and use this to make sure you have everything set up correctly with regards to hardware, wiringPi, and RF codes.

Other things to try:

* Make sure your json is valid: `/opt/nodejs/bin/npm install --global jsonlint && jsonlint -q /etc/homebridge/config.json` (no output means it looks good)
* Remove the `persist` directory: `sudo rm -r /etc/homebridge/persist`. This folder caches settings that may screw you up if you’re changing the config. Note that you’ll like need to redo your iOS setup.
* Reset your iOS device HomeKit settings: `Settings` -> `Privacy` -> `HomeKit` -> `Reset HomeKit Configuration`
* Delete your “Home” from HomeKit Catalog: hit the `Configure` button (bottom right) twice, swipe left on your “Home”
* Run homebridge in debug mode: `sudo -u homebridge DEBUG=* /opt/nodejs/lib/node_modules/homebridge/bin/homebridge -D -U /etc/homebridge`
* If you’re testing directly in nodejs and it can’t find your modules: `export NODE_PATH=/opt/nodejs/lib/node_modules`
* Test with `node-rcswitch-gpiomem`. Install: `/opt/nodejs/bin/npm install --global rcswitch-gpiomem` then make a file e.g. `fake.js` that you can give a test RF code: `/opt/nodejs/bin/node fake.js 12345`

```javascript
// fake.js
var rcswitch = require('rcswitch-gpiomem');
var code = process.argv[2]
rcswitch.enableTransmit(17);
rcswitch.setPulseLength(190);
rcswitch.send(parseInt(code), 24);
```

That’s it! Hope you get things running smoothly. I don’t know much about Javascript or C++, so I might refer you to the `homebridge` team for setup issues, but I’m happy to try to answer questions and comments here, or feel free to open an issue or pull request on the GitHub repos.
