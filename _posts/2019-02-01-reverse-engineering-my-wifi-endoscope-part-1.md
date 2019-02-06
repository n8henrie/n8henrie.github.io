---
title: Reverse Engineering My WiFI Endoscope Part 1
date: 2019-02-01T10:10:00-07:00
author: n8henrie
layout: post
permalink: /2019/02/reverse-engineering-my-wifi-endoscope-part-1/
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
- Part 3: Using WireShark to Decode UDP and Video Protocol

A few months ago, I bought a [THZY WiFi endoscope][1] to help me find a bolt
that I had dropped into a tight space in an appliance I was trying to repair. I
was hoping to find an endoscope that would work by lightning connector to my
iPhone, but this one looked like the next best alternative. The reason I would
have preferred something wired is because this one requires [a special
app][2] to view its stream, and I worry that the app will become unmaintained
or break, rendering the device useless.

The device itself works well enough. It creates its own WiFi network, to which
you connect your iPhone, and from there the app works fairly well to view the
screen and change basic settings (like the network name and password).

A week or two later, my fears were realized when I somehow locked myself out of
the WiFi network, presumably by accidentally changing the password. I could not
find any way to do a "factory reset" to restore the device to its default
settings. A Google search found [someone in a similar situation][3], reminding
me of this:

![](https://imgs.xkcd.com/comics/wisdom_of_the_ancients.png)

Having read some interesting posts on reverse engineering WiFi routers, I
decided to try to take the device apart to see if I could sort things out. It
ended up being far more difficult to take apart the small plastic box than I
anticipated; I think it may have been glued together. Inside, I found this
board:

![](/uploads/2019/02/IMG_6181.jpg)

At the bottom, you can see 5 ports labeled `TX2`, `RX2`, `RX1`, `TX1`, and
`GND`.

I don't have an oscilloscope unfortunately, so I hooked up [my trusty FTDI][4]
to multiple ports basically at random and ran through a list of common baud
rates until I found one with intelligible output.

The winning combination ended up being to use 57600 baud and connect:

<style>
table {
    width: auto !important;
    }
</style>
Endoscope | FTDI
-- | --
TX2 | RX
RX2 | TX

<br>
I recorded the boot log with `picocom --baud 57600 /dev/tty.usbserial-A50285BI
--logfile boot.log`, and its output is below (it's somewhat long, so I'm
putting it at the end of the post, and I've cleaned up a few escape chars and
other minor blemishes).

A few things to note from the boot log:

- It doesn't include an option to boot to cmd prompt:

```plaintext
Please choose the operation:
   1: Debug TFTP.
   2: Update from TFTP.
   3: Run.
   9: Update uboot from TFTP.

You choosed 3
```

It defaults to 3 if it times out or if the serial connection isn't properly
configured to send data. You can access the other options listed above, but I
couldn't figure out how to do anything interesting with them (possibly just due
to my inexperience). I didn't seem to be able to interrupt things or do
anything interesting by hitting `escape` during the boot sequence.

- The WiFi access point and password are printed out:

```plaintext
ap_name:	Jetion_fd20f768
ap_pass:	12345678
```

- It's running busybox:

```plaintext
BusyBox v1.12.1 (2017-04-22 17:33:57 CST) built-in shell (ash)
```

Thankfully, I was able to use the password it printed out to regain access to
its network, restoring my ability to use the endoscope. In [part 2 of the
series](/2019/02/reverse-engineering-my-wifi-endoscope-part-2), I'll go through
how I used a combination of tools like nmap, binwalk, and a [bus pirate][5] to
get root access on the device via telnet.

Boot log:

```plaintext
U-Boot 1.1.3 (Sep  2 2013 - 22:03:00)

Board: Ralink APSoC DRAM:  32 MB
relocate_code Pointer at: 81fb8000
spi_wait_nsec: 42
spi device id: ef 40 16 0 0 (40160000)
find flash: W25Q32BV
raspi_read: from:30000 len:1000
.*** Warning - bad CRC, using default environment

============================================
Ralink UBoot Version: 4.1.1.0
--------------------------------------------
ASIC 5350_MP (Port5<->None)
DRAM_CONF_FROM: Boot-Strapping
DRAM_TYPE: SDRAM
DRAM_SIZE: 256 Mbits
DRAM_WIDTH: 16 bits
DRAM_TOTAL_WIDTH: 16 bits
TOTAL_MEMORY_SIZE: 32 MBytes
Flash component: SPI Flash
Date:Sep  2 2013  Time:22:03:00
============================================
icache: sets:256, ways:4, linesz:32 ,total:32768
dcache: sets:128, ways:4, linesz:32 ,total:16384

 ##### The CPU freq = 360 MHZ ####
 estimate memory size =32 Mbytes

Please choose the operation:
   1: Debug TFTP.
   2: Update from TFTP.
   3: Run.
   9: Update uboot from TFTP.

You choosed 3

0

3: System Boot system code via Flash.
## Booting image at bc050000 ...
raspi_read: from:50000 len:40
.   Image Name:   Linux Kernel Image
   Image Type:   MIPS Linux Kernel Image (lzma compressed)
   Data Size:    1578918 Bytes =  1.5 MB
   Load Address: 80000000
   Entry Point:  8031f000
raspi_read: from:50040 len:1817a6
.........................   Verifying Checksum ... OK
   Uncompressing Kernel Image ... OK
No initrd
## Transferring control to Linux (at address 8031f000) ...
## Giving linux memsize in MB, 32

Starting kernel ...


LINUX started...

 THIS IS ASIC
Linux version 2.6.21 (tony@ubuntu) (gcc version 3.4.2) #545 Sun Jul 30 16:41:50 CST 2017

 The CPU frequency set to 360 MHz
CPU revision is: 0001964c
Determined physical RAM map:
 memory: 02000000 @ 00000000 (usable)
Initrd not found or empty - disabling initrd
Built 1 zonelists.  Total pages: 8128
Kernel command line: console=ttyS1,57600n8 root=/dev/ram0
Primary instruction cache 32kB, physically tagged, 4-way, linesize 32 bytes.
Primary data cache 16kB, 4-way, linesize 32 bytes.
Synthesized TLB refill handler (20 instructions).
Synthesized TLB load handler fastpath (32 instructions).
Synthesized TLB store handler fastpath (32 instructions).
Synthesized TLB modify handler fastpath (31 instructions).
Cache parity protection disabled
cause = 50808008, status = 11000000
PID hash table entries: 128 (order: 7, 512 bytes)
calculating r4koff... 0015f900(1440000)
CPU frequency 360.00 MHz
Using 180.000 MHz high precision timer.
Dentry cache hash table entries: 4096 (order: 2, 16384 bytes)
Inode-cache hash table entries: 2048 (order: 1, 8192 bytes)
Memory: 28556k/32768k available (2783k kernel code, 4212k reserved, 408k data, 640k init, 0k highmem)
Mount-cache hash table entries: 512
NET: Registered protocol family 16
usbcore: registered new interface driver usbfs
usbcore: registered new interface driver hub
usbcore: registered new device driver usb
Time: MIPS clocksource has been installed.
deice id : ef 40 16 0 0 (40160000)
W25Q32BV(ef 40160000) (4096 Kbytes)
mtd .name = raspi, .size = 0x00400000 (4M) .erasesize = 0x00010000 (64K) .numeraseregions = 0
Creating 5 MTD partitions on "raspi":
0x00000000-0x00400000 : "ALL"
0x00000000-0x00030000 : "Bootloader"
0x00030000-0x00040000 : "Config"
0x00040000-0x00050000 : "Factory"
0x00050000-0x01000000 : "Kernel"
mtd: partition "Kernel" extends beyond the end of device "raspi" -- size truncated to 0x3b0000
NET: Registered protocol family 2
IP route cache hash table entries: 1024 (order: 0, 4096 bytes)
TCP established hash table entries: 1024 (order: 1, 8192 bytes)
TCP bind hash table entries: 1024 (order: 0, 4096 bytes)
TCP: Hash tables configured (established 1024 bind 1024)
TCP reno registered
detected lzma initramfs
detected lzma initramfs
initramfs: LZMA lc=3,lp=0,pb=2,dictSize=1048576,origSize=2059264
LZMA initramfs by Ming-Ching Tiew <mctiew@yahoo.com>................................RT3xxx EHCI/OHCI init.
io scheduler noop registered (default)
Ralink gpio driver initialized
HDLC line discipline: version $Revision: #1 $, maxframe=4096
N_HDLC line discipline registered.
Serial: 8250/16550 driver $Revision: #1 $ 2 ports, IRQ sharing disabled
serial8250: ttyS0 at MMIO 0xb0000500 (irq = 37) is a 16550A
serial8250: ttyS1 at MMIO 0xb0000c00 (irq = 12) is a 16550A
RAMDISK driver initialized: 16 RAM disks of 16384K size 1024 blocksize
loop: loaded (max 8 devices)
rdm_major = 253
Ralink APSoC Ethernet Driver Initilization. v3.0  256 rx/tx descriptors allocated, mtu = 1500!
GMAC1_MAC_ADRH -- : 0x00008c88
GMAC1_MAC_ADRL -- : 0x2b508a5c
PROC INIT OK!


=== pAd = c0000000, size = 645976 ===

<-- RTMPAllocAdapterBlock, Status=0
block2mtd: version $Revision: #1 $
rt3xxx-ehci rt3xxx-ehci: Ralink EHCI Host Controller
rt3xxx-ehci rt3xxx-ehci: new USB bus registered, assigned bus number 1
rt3xxx-ehci rt3xxx-ehci: irq 18, io mem 0x101c0000
rt3xxx-ehci rt3xxx-ehci: USB 0.0 started, EHCI 1.00, driver 10 Dec 2004
usb usb1: configuration #1 chosen from 1 choice
hub 1-0:1.0: USB hub found
hub 1-0:1.0: 1 port detected
rt3xxx-ohci rt3xxx-ohci: RT3xxx OHCI Controller
rt3xxx-ohci rt3xxx-ohci: new USB bus registered, assigned bus number 2
rt3xxx-ohci rt3xxx-ohci: irq 18, io mem 0x101c1000
usb usb2: configuration #1 chosen from 1 choice
hub 2-0:1.0: USB hub found
hub 2-0:1.0: 1 port detected
Advanced Linux Sound Architecture Driver Version 1.0.14rc3 (Wed Mar 14 07:25:50 2007 UTC).
usb 1-1: new high speed USB device using rt3xxx-ehci and address 2
usb 1-1: configuration #1 chosen from 1 choice
usbcore: registered new interface driver snd-usb-audio
ALSA device list:
  No soundcards found.
nf_conntrack version 0.5.0 (256 buckets, 2048 max)
ip_tables: (C) 2000-2006 Netfilter Core Team, Type=Restricted Cone
TCP cubic registered
NET: Registered protocol family 1
NET: Registered protocol family 17
802.1Q VLAN Support v1.8 Ben Greear <greearb@candelatech.com>
All bugs added by David S. Miller <davem@redhat.com>
Freeing unused kernel memory: 640k freed
init started: BusyBox v1.12.1 (2017-04-22 17:33Algorithmics/MIPS FPU Emulator v1.5
:57 CST)
starting pid 14, tty '': '/etc_ro/rcS'
devpts: called with bogus options
mount: mounting none on /proc/bus/usb failed: No such file or directory
##################################
# Welcome to wifi module world   #
##################################
starting pid 36, tty '/dev/ttyS1': '/bin/sh'


BusyBox v1.12.1 (2017-04-22 17:33:57 CST) built-in shell (ash)
Enter 'help' for a list of built-in commands.

#  FILE: main_detect.c, LINE: 81: -----------> thread began to run now.

RX DESC a1cbd000  size = 2048
<-- RTMPAllocTxRxRingMemory, Status=0
Key1Str is Invalid key length(0) or Type(0)
Key2Str is Invalid key length(0) or Type(0)
Key3Str is Invalid key length(0) or Type(0)
Key4Str is Invalid key length(0) or Type(0)
1. Phy Mode = 9
2. Phy Mode = 9
3. Phy Mode = 9
MCS Set = ff 00 00 00 01
Main bssid = e8:ab:fd:20:f7:68
<==== rt28xx_init, Status=0
0x1300 = 00064380
start rmmod the video modules now...
rmmod: uvcvideo.ko: No such file or directory
rmmod: videodev.ko: No such file or directory
rmmod: v4l2-common.ko: No such file or directory
rmmod: v4l1_compat.ko: No such file or directory
rmmod: compat_ioctl32.ko: No such file or directory
ap_head:	Jetion_
ap_name:	Jetion_fd20f768
ap_pass:	12345678
ap_uart:	1
cam_width:	640
cam_height:	480
version:	100
start insmod the video modules now...
Linux video capture interface: v2.00
Found format MJPEG.
- 640x480 (30.0 fps)
- 320x240 (30.0 fps)
- 800x600 (30.0 fps)
- 1024x768 (30.0 fps)
- 1280x720 (30.0 fps)
- 640x480 (30.0 fps)
Found format YUV 4:2:2 (YUYV).
- 640x480 (30.0 fps)
- 320x240 (30.0 fps)
- 1280x1024 (7.5 fps)
- 1600x1200 (3.0 fps)
- 640x480 (30.0 fps)
uvcvideo: Found UVC 1.00 device USB 2.0 Camera (090c:f37d)
uvcvideo: UVC non compliance - GET_DEF(PROBE) not supported. Enabling workaround.
input: USB 2.0 Camera as /class/input/input0
usbcore: registered new interface driver uvcvideo
USB Video Class driver (SVN r209)
F:src/app_video.
```

[1]: https://amzn.to/2pXlelm
[2]: https://itunes.apple.com/us/app/wifi-view/id997684591
[3]: https://www.eevblog.com/forum/projects/lost-password-of-wifi-endoscope-cam/
[4]: https://amzn.to/2Wxj3V2
[5]: https://amzn.to/2GcJw4t
