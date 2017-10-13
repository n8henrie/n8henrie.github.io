---
title: My Internet Speeds for the Last Year
date: 2017-10-07T10:30:48-06:00
author: n8henrie
layout: post
permalink: /2017/10/my-internet-speeds-for-the-last-year/
categories:
- tech
excerpt: >-
  I decided to post some visualizations of my internet speeds over the last
  year with different providers.
# ggrep -oP '(?<=>Posts tagged with ).*?(?=<)' _site/tags/index.html
tags:
- homeautomation
---
**Bottom Line:** I decided to post some visualizations of my internet speeds
over the last year with different providers.
<!--more-->

I've changed internet providers a few times over the last year (I guess closer
to a year and a half now), and I thought it might be interesting to post how my
speeds have fared.

The data has been collected in a few different ways:

- [This little wrapper script](https://github.com/n8henrie/speed) that takes a
  configurable number of runs of
  [speedtest-cli](https://github.com/sivel/speedtest-cli), optionally drops the
  highest and lowest, and averages the remainder
- The [Home Assistant Fast.com
  sensor](https://home-assistant.io/components/sensor.fastdotcom/)

To get the few hundred kb of download data out of my several hundred mb Home
Asisstant database, I shut down the hass server and ran the following:

```shell_session
$ sqlite3 -csv config/home-assistant_v2.db \
     'select state, created from states
      where entity_id is "sensor.fastcom_download"' \
  > hass_speeds.csv
```

I think the best way to display the notebook is actually downloading the
notebook as HTML and simply hosting that file as a separate page, so that's
what I've done.

Please see my results here: [Notebook: My Internet Speeds for the Last
Year](/uploads/2017/10/my-internet-speeds-for-the-last-year.html).
