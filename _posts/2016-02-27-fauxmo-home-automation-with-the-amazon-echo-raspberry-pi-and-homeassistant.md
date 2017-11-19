---
id: 2808
title: >
    fauxmo: Home Automation with the Amazon Echo, Raspberry Pi, and
    HomeAssistant
date: 2016-02-27T13:39:15+00:00
author: n8henrie
excerpt: >
    I updated a Python script called Fauxmo that lets you control your
    Raspberry Pi with an Amazon Echo (and supports HomeAssistant).
layout: post
guid: http://n8henrie.com/?p=2808
permalink: /2016/02/fauxmo-home-automation-with-the-amazon-echo-raspberry-pi-and-homeassistant/
dsq_thread_id:
- 4617353032
disqus_identifier: 2808 http://n8henrie.com/?p=2808
tags:
- automation
- electronics
- homeautomation
- python
- Siri
categories:
- tech
---
**Bottom Line:** I updated a Python script called Fauxmo that lets you control
your Raspberry Pi with an Amazon Echo (and now supports
HomeAssistant).<!--more-->

I was looking for a way to control my home automation devices with my new <a
href="http://amzn.to/1QDBUlF" target="_blank">Amazon Echo</a>, and I came
across <a href="https://github.com/makermusings/fauxmo"
target="_blank">Fauxmo</a>. I liked how it was local and didn't require port
forwarding or lambda functions like using an <a
href="https://developer.amazon.com/public/solutions/alexa"
target="_blank">Alexa Skill</a> would. Additionally, I didn't like the required
verbiage for running actions as a skill, e.g. "Alexa, tell the house to turn on
the kitchen light" — I want to just say "Alexa, turn on the kitchen light,"
which is supported by Fauxmo. I especially liked the fact that Fauxmo was
written in Python, but I prefer Python3, so I decided to update it.

Fauxmo works by pretending to be a WeMo device, which the Echo supports
natively. I don't know much about websockets or upnp, so it was definitely a
learning process, but I eventually got something that works. You can find my
updated version at: <a href="https://github.com/n8henrie/fauxmo"
target="_blank">https://github.com/n8henrie/fauxmo</a>, or you should also be
able to install through PyPI: `pip3 install fauxmo`. One minor change (that
made a big difference for me) was implementing a new handler for Home Assistant
services.

After months of trying to decide on a central system to run my home automation,
I've finally settled on <a href="https://home-assistant.io/"
target="_blank">Home Assistant</a> — for a lot of reasons. It's Python3, so I
can tool around on it and hopefully even make a few contributions, but more
importantly I can understand how it's working. The interface is beautiful,
development and the community are active, and the documentation is pretty good.
Having a web-based interface means I can use any mobile or desktop interface I
want, and once I have it set up with SSL, I'll be able to access everything
remotely as well.

Once I decided that Home Assistant (running on my <a
href="http://amzn.to/1QDCfok" target="_blank">Raspberry Pi 2</a>) would be the
core of my Home Automation system, I wanted to make sure that all my other
systems worked _through_ Home Assistant if possible. Luckily, in addition to
its REST API, it has an awesome <a
href="https://home-assistant.io/developers/python_api" target="_blank">Python
API</a>. Because I have Home Assistant running on the same device that runs
Fauxmo, I was able to implement a new type of handler that simplifies things a
bit by using the Python API.

The reason I've done it this way is that Home Assistant now keeps track of the
state of the devices for me. For example, I can turn on my kitchen light
through Alexa: "Alexa, turn on the kitchen light". Alexa then uses the Home
Assistant API to turn on the light, so the next time I open Home Assistant,
I'll see the kitchen light button indicating the light is on.

Continuing this example of running everything through Home Assistant, you may
have seen [my recent post on home automation with Siri /
HomeKit](http://n8henrie.com/2015/12/control-an-rf-outlet-with-siri-via-homebridge/),
which uses a Raspberry Pi running <a
href="https://github.com/nfarina/homebridge" target="_blank">HomeBridge</a>.
<del datetime="2016-03-10T17:46:43+00:00">Well, it ended up being pretty simple
to use the legacy HomeAssistant plugin to expose my Home Assistant services to
homebridge</del> — there is now even a mention of this method on <a
href="https://home-assistant.io/blog/#integrating-home-assistant-with-homekit"
target="_blank">the official Home Assistant blog</a>. **Update 20160310:** as
per discussion in [this
thread](https://github.com/nfarina/homebridge-legacy-plugins/issues/24#issuecomment-194109178),
GitHub user [Maddox](https://github.com/maddox) has moved the
homebridge-homeassistant plugin out of legacy and into <del><a
href="https://github.com/maddox/homebridge-homeassistant" target="_blank">its
own repo</a></del> now moved into  <a
href="https://github.com/home-assistant/homebridge-homeassistant"
target="_blank">its own repo in the home-assistant organization</a>.

This way, I can open up Home Assistant and turn on my kitchen light — which
will obviously have Home Assistant indicate that the light is on. I could then
turn it off with Siri: "Hey Siri, turn off the kitchen light," and Home
Assistant will update to show that the light is off. I can then turn it on
again with Alexa: "Alexa, turn on the kitchen light." Home Assistant will then
correctly show that the light is on again, and will show in its history that
the light was turned on, off, then on again.

Schematically, it's something like this:

![]({{ site.url }}/uploads/2016/02/20160227_Untitled.png)

Having this kind of central system will be critical for more advanced
automation schemes in the future, because they will depend on the accuracy of
the reported states of devices. You can't exactly have a system "turn off the
nightlight when the overhead light is turned on" unless it knows when the
overhead light is on. This way, I can still use the dumb but <a
href="http://amzn.to/1QDE58O" target="_blank">super cheap RF switches</a> I
like for a lot of simple tasks and still keep pretty good track of their
states, even though they don't support reporting their state to controllers,
and at the same time I avoid locking myself into a single system for
interacting with them.
