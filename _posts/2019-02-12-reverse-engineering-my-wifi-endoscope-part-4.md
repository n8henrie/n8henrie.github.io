---
title: Reverse Engineering My WiFI Endoscope Part 4
date: 2019-02-12T09:00-06:00
author: n8henrie
layout: post
permalink: /2019/02/reverse-engineering-my-wifi-endoscope-part-4/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- electronics
- reverse-engineering
---
**Bottom Line:** I got root on a WiFi Endoscope.
<!--more-->

- [Part 1: Introduction and Serial Debug Port to Get WiFi
  Password](/2019/02/reverse-engineering-my-wifi-endoscope-part-1)
- [Part 2: Reading Flash to Get Telnet Password](/2019/02/reverse-engineering-my-wifi-endoscope-part-2)
- [Part 3: Using WireShark to Decode UDP Protocol](/2019/02/reverse-engineering-my-wifi-endoscope-part-3)
- [Part 4: Using Netcat to Decode Video Protocol](/2019/02/reverse-engineering-my-wifi-endoscope-part-4)

# Part 4: Using Netcat to Decode Video Protocol

Part 3 review: I used [WireShark] to figure out the UDP protocol that the [WiFi
endoscope][1] uses to configure its password and access point name, among other
settings.

My primary objective with this project was to ensure that I could continue to
use the endoscope even if the iOS app went unmaintained; after figuring out how
to configure the endoscope's settings, the last thing I needed was to be able
to view the video feed without the app.

I've mentioned a few times that nmap showed port 7060 to be open, and
that I suspected this was the video feed based on the fact that connecting to
it yielded an unending stream of data.

Inspecting 30 seconds or so of its data, I found a few points of interest:

```console
$ netcat 192.168.10.123 7060 > netcat_out
$ strings netcat_out | head
BoundaryS
JFIF
(:3=<9387@H\N@DWE78PmQW_bghg>Mqypdx\egc
/cB8Bcccccccccccccccccccccccccccccccccccccccccccccccccc
$3br
%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
1L@E
,%!4
Z@-8t
```

[Some
Googling](https://stackoverflow.com/questions/18416272/convert-image-stream-jfif-jpeg-format-to-datauri-using-javascript)
of those strings led me to believe it was using a JFIF image format (especially
since it includes `JFIF` in the content). Eventually, I found a [super helpful
SO answer](https://stackoverflow.com/a/1602428/1588795) suggesting that I
should look for `FFD8` to start and `FFD9` to end an image in the feed.

As a test, I tried to snip out a single image:

1. Open the binary file in neovim: `nvim "+:setlocal display=uhex" netcat_out`
1. Delete until `ffd8`: `d/\%xff\%xd8`
1. Find the next `ffd9`: `/\%xff\%xd9`
1. Advance 2 bytes: `ll`
1. Delete until the end of the line: `d$`
1. Go down a line: `j`
1. Delete until end of the file: `dG`
1. Write the resulting data: `:w netcat_endoscope.jpg`
1. Open the file: `!open netcat_endoscope.jpg`

The resulting file:

![](/uploads/2019/02/netcat_endoscope.jpg)

Clearly I was correct, this stream is the image data.

I tried a number of ways of viewing this stream in the browser without success,
but I eventually found a Python method leveraging [OpenCV] that worked great.
Below, I'm using OpenCV 4.0.1 installed via Homebrew and python 3.7.2.

```python
import cv2

cap = cv2.VideoCapture("http://192.168.10.123:7060")
while True:
    ret, frame = cap.read()
    cv2.imshow('Video', frame)
    if cv2.waitKey(1) == 27:
        exit(0)
```

The stream does have a strange line through the middle (like the image shown
above), but other than that it seems to work well. If you have other
suggestions on how to view this stream (especially if it gets rid of this
artifact), feel free to let me know in the comments!

At this point, having read the firmware flash, discovered the telnet password
for an administrative account, figured out how to configure the endoscope by
sending commands over UDP, and figured out how to stream the video feed without
requiring the app, I consider this project wrapped up. I hope you've enjoyed
this writeup of my first adventure in reverse engineering an electronic device!

[1]: https://amzn.to/2pXlelm
[2]: https://amzn.to/2GcJw4t
[3]: https://sourceforge.net/projects/netcat/
[4]: https://amzn.to/2GukcH9
[WireShark]: https://www.wireshark.org/
[OpenCV]: https://opencv.org/
