---
title: Setting up Tasmota (beta) integration with Home Assistant
date: 2020-12-10T11:15:49-07:00
author: n8henrie
layout: post
permalink: /2020/12/setting-up-tasmota-beta-integration-with-home-assistant/
categories:
- tech
excerpt: "Here is how I set up Tasmota in Home Assistant."
tags:
- electronics
- homeautomation
- IoT
- raspberrypi
- security
- tech
---
**Bottom Line:** Here is how I set up Tasmota in Home Assistant.
<!--more-->

I've been using [Home Assistant](https://www.home-assistant.io) for years, and
recently started using [Tasmota](https://tasmota.github.io/docs/) and
[ESPHome](https://esphome.io/) along with [these excellent plugs][0]\*. In a
recent Home Assistant release (circa 0.117.0), a new integration for Tasmota
was announced, so I wanted to try it out.

I was hoping it would be as smooth of an experience as ESPHome and
unfortunately was [a little disappointed
there](https://community.home-assistant.io/t/no-devices-found-with-tasmota-beta/249600/1),
so I thought I would document my process for future reference.

Please note that I had already read the official Home Assistant and Tasmota
docs before embarking here, and I strongly recommend that you do the same. I
will probably not keep this guide up to date (written Dec 2020).

I'm using Home Assistant 0.118.5 on a Raspberry Pi 4 running Raspbian 10.6. I'm
running mosquitto version 1.5.7 as my MQTT broker (the old version from the
raspbian repos), and I have a Home Assistant connecting as its own user, which
I'll denote as `home` below, and I have IOT devices running as a separate user,
which I'll denote as `iot_device` below. I have passwords and restrictive ACLs
set up for both.

Yes, this would be a lot easier with looser security here.

Unfortunately, I didn't have any luck following the basic [home
assistant][home-assistant-instructions] or [tasmota][tasmota-instructions]
instructions, but with [some help from the Home Assistant
community](https://community.home-assistant.io/t/no-devices-found-with-tasmota-beta/249600/1)
I eventually got the switch discovered, but nothing was working.

While ESPHome is pretty close to a one-click install, with the new Tasmota
integration you *still* have to set up quite a bit of MQTT stuff if using
mosquitto. I was hoping perhaps it would automatically configure the device to
use the MQTT topics (and generated subtopics) to which Home Assistant already
has access, but alas.

That said, I eventually got it working. Steps I had to take, starting from a
fresh Tasmota installation for reproducibility:

1. Add the Tasmota beta integration through the Home Assistant web interface,
   leaving the defaults unchanged
1. Upgrade to Tasmota 9.1.0 (not `-lite`)
1. `Reset Configuration` to start with a blank slate
1. Re-add my WiFi info
1. Add my switch’s
   [template](https://templates.blakadder.com/aoycocr_X10S.html) so the button
   works:
1. Set mosquitto logging to `debug`
1. Add my mqtt host and port to the Tasmota MQTT settings
    - At this point, I could see some connection errors in my mosquitto log:
    ```plaintext
    Dec 10 10:24:49 myhostname mosquitto[4919]: 1607621089: Sending CONNACK to TASMOTA_DEVICE_IP (0, 5)
    Dec 10 10:24:49 myhostname mosquitto[4919]: 1607621089: Socket error on client <unknown>, disconnecting.
    ```
1. Add the `iot_device` user and password to the Tasmota MQTT settings, in
   keeping with my settings in mosquitto
1. I could see some `Denied PUBLISH` errors appearing in my mosquitto log, and
   I started using the two commands below frequently to see what requests were
   being attempted (and which seemed to be getting denied)
    - `journalctl -x -b -u mosquitto | grep -i -a1 subscribe`
    - `journalctl -x -b -u mosquitto | grep -i denied`
    - Notable results often looked something like this:
    ```plaintext
    [redacted connection stuff]
    Dec 10 10:35:40 myhostname mosquitto[4919]: 1607621740: Denied PUBLISH from TASMOTA_DEVICE_NAME (d0, q0, r1, m0, 'tele/tasmota_5A2232/LWT', ... (6 bytes))
    [a few other `Denied PUBLISH` messages]
    ```
1. Next, I added the following lines to my mosquitto acl:
    ```
    user home
    topic read tasmota/discovery/#
    topic readwrite homeassistant/#

    user iot_device
    topic write tasmota/discovery/#
    topic write homeassistant/#
    ```
1. At this point, I could reliably get the device discovered by Home Assistant
   by entering the Tasmota console and entering `SetOption19 0` (the device
   shows up on the integration's card at `/config/integrations`). I did *not*
   need to toggle back and forth to `SetOption19 1` like others have suggested,
   I just did `SetOption19 0` a second time if needed. Unfortunately none of
   the sensors or switches were working.
1. I could see that I needed to give ACL access to a few topics to the device
   such as `tele`, `stat`, and `cmnd`. However, I didn't want to give all
   devices access to each other, or the ability to write to each others'
   topics, so I wanted to give each device an ACL for its own topic based on
   the client. To this end, I went to the Tasmota MQTT settings and changed
   `Topic` from `tasmota_%06X` to `tasmota/DVES_%06X`\*\*, which is the default
   client ID, which lets me use `%c` in a mosquitto pattern rule\*\*\*.
1. I then added the following to the ACL:
    ```plaintext
    user home
    topic write cmnd/tasmota/#

    user iot_device
    topic read cmnd/tasmota/%c/#
    topic write stat/tasmota/%c/#
    topic write tele/tasmota/%c/#
    ```
1. After another `SetOption19 0` (and maybe a device restart), I had working
   switches and sensors. Hooray!
1. Once everything is working, use that `Backup Configuration` button!

One last note: after this, I still saw that there were 8 sensors that weren't
working in Home Assistant, marked as disabled. After a bit of fiddling, I
eventually re-read the Home Assistant docs and saw that they are disabled by
default. To enable, click on the entity in Home Assistant, toggle the `Enable
entity` button, and click `Update`.

An example ACL file is below.

\* NB: The firmware may have been updated since I purchased them, but I was
able to use [Tuya-Convert](https://github.com/ct-Open-Source/tuya-convert/)
with [only a few
issues](https://github.com/ct-Open-Source/tuya-convert/issues/682) to
"jailbreak" their software.

\** I initially thought this was a good idea for security, but in retrospect a
malicious device could just spoof or change its client ID. Oh well.

\*** From the mosquitto man page:
> The substitution pattern must be the only text for that level of hierarchy.
Pattern ACLs apply to all users even if the "user" keyword has previously been
given.

```plaintext
user home
topic readwrite homeassistant/#
topic readwrite tasmota/discovery/#
topic write cmnd/tasmota/#
topic read stat/tasmota/#
topic read tele/tasmota/#

user iot_device
topic write homeassistant/#
topic write tasmota/discovery/#

pattern read cmnd/tasmota/%c/#
pattern write stat/tasmota/%c/#
pattern write tele/tasmota/%c/#
```

### Reading material:

- <https://community.home-assistant.io/t/no-devices-found-with-tasmota-beta/249600/1>
- <https://www.home-assistant.io/integrations/tasmota/>
- <https://tasmota.github.io/docs/Home-Assistant/>
- <https://tasmota.github.io/docs/Securing-your-IoT-from-hacking/>
- <https://tasmota.github.io/docs/MQTT/>
- `man 5 mosquitto.conf`

[0]: https://www.amazon.com/Smart-Plug-Energy-Monitoring-Protection/dp/B07RV15W3W/ref=as_li_ss_tl?cv_ct_cx=aoycocr+plugs&dchild=1&keywords=aoycocr+plugs&pd_rd_i=B07RV15W3W&pd_rd_r=b1edab16-82a4-4029-8842-b1f45af906e6&pd_rd_w=j7SzP&pd_rd_wg=ytFwq&pf_rd_p=1835a2a9-7ed8-48dc-ad07-fcd7527bd2bc&pf_rd_r=E92AHBJ99WKCQ5W3W66B&psc=1&qid=1607638628&sr=1-1-80ba0e26-a1cd-4e7b-87a0-a2ffae3a273c&linkCode=ll1&tag=o5284-20&linkId=8780a0e0e5a1cdd960fe82aa826910a5&language=en_US
[home-assistant-instructions]: https://www.home-assistant.io/integrations/tasmota/
[tasmota-instructions]: https://tasmota.github.io/docs/Home-Assistant/
