---
title: Reverse Engineering My WiFi Endoscope Part 3
date: 2019-02-10T14:40:00-06:00
author: n8henrie
layout: post
permalink: /2019/02/reverse-engineering-my-wifi-endoscope-part-3/
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

# Part 3: Using WireShark to Decode UDP Protocol

Part 2 review: I used a [bus pirate][2] to grab the
firmware from my [WiFi Endoscope][1], which revealed the
telnet username and password.

After getting admin access over telnet, I still wanted to be able to view the
video stream and configure the endoscope's settings without using the iPhone
app, to make sure I could still use the endoscope if the app ever stopped
working.

As I had noted previously, nmap showed that port 7060 was open, and connecting
with (GNU) [`netcat`][3] showed a seemingly endless stream of data, suggesting
to me that this was the video feed.

I really didn't understand how the iPhone app was communicating information
back to the endoscope (maybe via telnet?), so I decided to see if I could use
[this super convenient little router][4] as a MITM, since it runs OpenWRT and
rebroadcasts networks as one of its core features. It ended up being
surprisingly simple:

1. connect the router to a network with internet access
1. install `tcpdump` using OpenWRT's package manager
1. configure SSH access to the router
1. configure the router to rebroadcast the endoscope's network
1. connect to the router via ssh and run tcpdump
1. connect my phone to the endoscope by way of the router
1. run some commands on my phone through the endoscope's app
1. `scp` the tcpdump file and open in WireShark for analysis

Unfortunately, it's been a while since I did this and I no longer recall the
exact commands. However, I've since discovered that I can do pretty much the
same thing using [WireShark] directly, so that's how I'll present the
remainder of the information.

A few key steps:

- use the app to remove the endoscope's WiFi network password, making it much
  easier to capture data with WireShark
- enable WireShark's promiscuous and monitor mode for your network interface
- use capture filters to greatly reduce the amount of data, e.g. `host
  192.168.10.123`

Once I'd started digging through the captured files, I noted a few things:

- I didn't see any evidence of communication on port 23, so the app was
  probably not working via telnet
- Lots of junk on 7060, as suspected
- Lots of UDP data on port 50000

I was surprised to find the UDP 50000 data, since that hadn't come up in my
nmap scans. It ends up that nmap apparently only scans the [top 1000 most
common ports](https://serverfault.com/a/391797/259259); when I scanned it
directly with `nmap -sU 192.168.10.123 -p 50000`, sure enough it picked it up.

The UDP data looked promising as a way to control the endoscope, so I set
a WireShark display filter to `ip.addr == 192.168.10.123 and udp`. I found lots
of stretches of data whose hexdump (viewed in WireShark with `Follow` -> `UDP
Stream`) looked like:

```plaintext
00000000  53 45 54 43 4d 44 ee 14  00 00 90 00 01 00 00      SETCMD.. .......
0000000F  53 45 54 43 4d 44 ef 14  00 00 90 00 01 00 00      SETCMD.. .......
0000001E  53 45 54 43 4d 44 f0 14  00 00 90 00 01 00 00      SETCMD.. .......
0000002D  53 45 54 43 4d 44 f1 14  00 00 90 00 01 00 00      SETCMD.. .......
0000003C  53 45 54 43 4d 44 f2 14  00 00 90 00 01 00 00      SETCMD.. .......
0000004B  53 45 54 43 4d 44 f3 14  00 00 90 00 01 00 00      SETCMD.. .......
0000005A  53 45 54 43 4d 44 f4 14  00 00 90 00 01 00 00      SETCMD.. .......
00000069  53 45 54 43 4d 44 f5 14  00 00 90 00 01 00 00      SETCMD.. .......
00000078  53 45 54 43 4d 44 f6 14  00 00 90 00 01 00 00      SETCMD.. .......
00000087  53 45 54 43 4d 44 f7 14  00 00 90 00 01 00 00      SETCMD.. .......
00000096  53 45 54 43 4d 44 f8 14  00 00 90 00 01 00 00      SETCMD.. .......
000000A5  53 45 54 43 4d 44 f9 14  00 00 90 00 01 00 00      SETCMD.. .......
000000B4  53 45 54 43 4d 44 fa 14  00 00 90 00 01 00 00      SETCMD.. .......
```

As you can see, there's a byte in the 7th position that just keeps
incrementing, then there's this `SETCMD` business. Running `grep -r -a SETCMD`
on the firmware that `binwalk` extracted in [part
2](/2019/02/reverse-engineering-my-wifi-endoscope-part-2) shows, among other
things:

```plaintext
_50040.extracted/341000:SETCMD F:src/app_cmd.c, L:%d    : Receive CMD_SET_WIFI_NAME, Name:%s
```

Grepping for more of the `CMD_` names gives us an idea of what kinds of
commands are likely available:

```console
$ grep -r -a -o -h "CMD_\w\+" | sort -u
CMD_AP_START
CMD_ATE_GET_STATISTICS
CMD_ATE_RESET_COUNTER
CMD_ATE_RUN_CPUBUSY
CMD_ATE_SEL_RX_ANTENNA
CMD_ATE_SEL_TX_ANTENNA
CMD_ATE_SET_ADDR1
CMD_ATE_SET_ADDR2
CMD_ATE_SET_ADDR3
CMD_ATE_SET_BW
CMD_ATE_SET_CHANNEL
CMD_ATE_SET_FREQ_OFFSET
CMD_ATE_SET_PREAMBLE
CMD_ATE_SET_RATE
CMD_ATE_SET_TX_FRAME_COUNT
CMD_ATE_SET_TX_FRAME_LEN
CMD_ATE_SET_TX_POWER0
CMD_ATE_SET_TX_POWER1
CMD_ATE_START
CMD_ATE_START_TX_CARRIER
CMD_ATE_START_TX_CONT
CMD_ATE_START_TX_FRAME
CMD_ATE_STOP
CMD_GET_CAMERA_RESOLUTION
CMD_IO_WRITE
CMD_Proc
CMD_RX_START
CMD_RX_STOP
CMD_SET_CAMERA_RESOLUTION
CMD_SET_REBOOT
CMD_SET_WIFI_CLEAR_PASSWORD
CMD_SET_WIFI_NAME
CMD_SET_WIFI_PASSWORD
CMD_TX_STOP
```

Going back to the WireShark UDP commands, I set a more specific capture filter
(`host 192.168.10.123 and udp and port 50000`) and made several more captures
of different commands. If I make a capture while using the iPhone app to reboot
the endoscope, I find:

```plaintext
00000000  53 45 54 43 4d 44 01 00  00 00 04 00 00 00         SETCMD.. ......
0000000E  53 45 54 43 4d 44 01 00  00 00 04 00 00 00         SETCMD.. ......
0000001C  53 45 54 43 4d 44 01 00  00 00 04 00 00 00         SETCMD.. ......
0000002A  52 65 73 74 61 72 74 53  65 72 76 65 72 5f         RestartS erver_
    00000000  52 45 54 43 4d 44 01 00  00 00 04 00               RETCMD.. ....
```

Clearing the password (twice):

```plaintext
00000000  53 45 54 43 4d 44 01 00  00 00 03 00 00 00         SETCMD.. ......
0000000E  53 45 54 43 4d 44 01 00  00 00 03 00 00 00         SETCMD.. ......
0000001C  53 45 54 43 4d 44 01 00  00 00 03 00 00 00         SETCMD.. ......
0000002A  43 6c 65 61 72 50 61 73  73 5f 5f 5f 5f 5f         ClearPas s_____
    00000000  52 45 54 43 4d 44 01 00  00 00 03 00               RETCMD.. ....
00000038  53 45 54 43 4d 44 02 00  00 00 03 00 00 00         SETCMD.. ......
00000046  53 45 54 43 4d 44 02 00  00 00 03 00 00 00         SETCMD.. ......
00000054  53 45 54 43 4d 44 02 00  00 00 03 00 00 00         SETCMD.. ......
00000062  43 6c 65 61 72 50 61 73  73 5f 5f 5f 5f 5f         ClearPas s_____
    0000000C  52 45 54 43 4d 44 02 00  00 00 03 00               RETCMD.. ....
```

Setting the WiFi network password to `12345678`, manually issuing the command 3
times:

```plaintext
00000000  53 45 54 43 4d 44 07 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
00000010  33 34 35 36 37 38                                  345678
00000016  53 45 54 43 4d 44 07 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
00000026  33 34 35 36 37 38                                  345678
0000002C  53 45 54 43 4d 44 07 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
0000003C  33 34 35 36 37 38                                  345678
00000042  41 50 50 41 53 53 3d 31  32 33 34 35 36 37 38      APPASS=1 2345678
00000051  53 45 54 43 4d 44 08 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
00000061  33 34 35 36 37 38                                  345678
00000067  53 45 54 43 4d 44 08 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
00000077  33 34 35 36 37 38                                  345678
0000007D  53 45 54 43 4d 44 08 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
0000008D  33 34 35 36 37 38                                  345678
00000093  41 50 50 41 53 53 3d 31  32 33 34 35 36 37 38      APPASS=1 2345678
000000A2  53 45 54 43 4d 44 09 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
000000B2  33 34 35 36 37 38                                  345678
000000B8  53 45 54 43 4d 44 09 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
000000C8  33 34 35 36 37 38                                  345678
000000CE  53 45 54 43 4d 44 09 00  00 00 02 00 08 00 31 32   SETCMD.. ......12
000000DE  33 34 35 36 37 38                                  345678
000000E4  41 50 50 41 53 53 3d 31  32 33 34 35 36 37 38      APPASS=1 2345678
```

A few patterns:

- 7th byte seems to be incrementing sequentially (`07` for the first 3
  `SETCMD`s, then `08`, then `09`)
- the `SETCMD` ends with the new network password and repeats 3 times, followed
  by...
- a line with `APPASS=` and the password
- followed by a `RETCMD` response coming from the endoscope (I have filtered
  this out in some of the above examples)

Setting the WiFi network name to `Jetion_fd20f768`:

```plaintext
00000000  53 45 54 43 4d 44 0d 00  00 00 01 00 0f 00 4a 65   SETCMD.. ......Je
00000010  74 69 6f 6e 5f 66 64 32  30 66 37 36 38            tion_fd2 0f768
0000001D  53 45 54 43 4d 44 0d 00  00 00 01 00 0f 00 4a 65   SETCMD.. ......Je
0000002D  74 69 6f 6e 5f 66 64 32  30 66 37 36 38            tion_fd2 0f768
0000003A  53 45 54 43 4d 44 0d 00  00 00 01 00 0f 00 4a 65   SETCMD.. ......Je
0000004A  74 69 6f 6e 5f 66 64 32  30 66 37 36 38            tion_fd2 0f768
00000057  41 50 4e 41 4d 45 3d 4a  65 74 69 6f 6e 5f 66 64   APNAME=J etion_fd
00000067  32 30 66 37 36 38                                  20f768
    00000000  52 45 54 43 4d 44 0d 00  00 00 01 00               RETCMD.. ....
```

Again, we see 3 of the `SETCMD` lines, which may or may not have additional
data (such as the new network password or network name), followed by a line
with a more legible command: `APNAME=` + network name, or `APPASS=` + password,
or `RestartServer_`, then the `RETCMD` response from the endoscope, likely
acknowledging the receipt of a command.

I initially figured that perhaps the 4th command with `APNAME=` or
`RestartServer_` was the key part, so I connected my Macbook to the endoscope's
network and tried sending those bytes back (with some hackery -- the `tr -s '
'` is to squeeze the extra spaces that WireShark includes, so I can copy and
paste directly from WireShark. Please let me know in the comments if you have a
better way).

```console
$ echo -e "$(tr -s ' ' <<<'41 50 4e 41 4d 45 3d 4a 65 74 69 6f 6e 5f 66 64 32 30 66 37 36 38' | sed 's/^\| /\\x/g')"
APNAME=Jetion_fd20f768
$ echo -e "$(tr -s ' ' <<<'41 50 4e 41 4d 45 3d 4a 65 74 69 6f 6e 5f 66 64 32 30 66 37 36 38' | sed 's/^\| /\\x/g')" | netcat --udp --close 192.168.10.123 50000
```

Unfortunately, this didn't seem to work. So next, I tried sending several of
the `SETCMD` lines followed by the `APNAME=` line, figuring that perhaps it
needed the full sequence. It *still* didn't set the access point name, but
interestingly, it did reboot the router after the first `SETCMD` (note: this
likely means that I had copied the wrong `SETCMD` preceding the `APNAME=`), but
I hadn't realized at this point).

EDIT: I figured out that one also use `xxd -r -p` instead of the `echo`, `tr`,
and `sed` hackery (note the lack of a trailing newline, as with `echo -n`, so
the output below ends in `$`). You'll see me using the `xxd` and `echo` / `tr`
/ `sed` versions interchangeably below. Also, for print debugging the
characters, it looks like `echo -e '\x53'` and `echo $'\x53'` produce the same
output.

```console
$ echo -ne "$(tr -s ' ' <<<"53 45 54 43 4d 44 09 00    00 00 02 00 08 00 31 32 33 34 35 36 37 38" | sed 's/^\|\ /\\x/g')"
SETCMD 12345678$
$ xxd -r -p <<<"53 45 54 43 4d 44 09 00    00 00 02 00 08 00 31 32 33 34 35 36 37 38"
SETCMD 12345678$
$ echo -e '\x54'
T
$ echo $'\x54'
T
```

END EDIT

I also tried sending the `RestartServer_` command to reboot the endoscope, and
that also didn't work:

```console
$ echo -e "$(tr -s ' ' <<<'52 65 73 74 61 72 74 53  65 72 76 65 72 5f' | sed 's/^\| /\\x/g')"
RestartServer_
$ echo -e "$(tr -s ' ' <<<'52 65 73 74 61 72 74 53  65 72 76 65 72 5f' | sed 's/^\| /\\x/g')" | netcat --udp --close 192.168.10.123 50000
```

It took me a while, but what I eventually figured out was that it is actually
the `SETCMD` that is the key; the following line with e.g. `APNAME=` or
`RestartServer_` doesn't seem to be necessary at all, and the `SETCMD` doesn't
necessarily have to be repeated three times, either. The key seems to be one
of the bytes (or perhaps a few) after the `SETCMD`; for example the `SETCMD`
for the `RestartServer`, as opposed to the `SETCMD` for `ClearPass_____` above:

```plaintext
53 45 54 43 4d 44 01 00  00 00 04 00 00 00         SETCMD.. ......
52 65 73 74 61 72 74 53  65 72 76 65 72 5f         RestartS erver_
53 45 54 43 4d 44 01 00  00 00 03 00 00 00         SETCMD.. ......
43 6c 65 61 72 50 61 73  73 5f 5f 5f 5f 5f         ClearPas s_____
```

Up to the `44` is the `SETCMD`:

```console
$ xxd -r -p <<<'53 45 54 43 4d 44'
SETCMD$
```

The next byte (`01` above) varies, seems to be counting up sequentially, and
doesn't seem to be critical for the device to correctly receive a command.

The next three bytes seem pretty consistently to be `00`.

The following byte (or 4), `04 00 00 00` or `03 00 00 00` above, seem to
indicate what kind of command is being sent, and after those come any relevant
data (like the access point name or password).

Messing around with this, it also seems like it was useful to send one of the
"blank" `SETCMD`s before a command; without this, I could get a single command
to work, but couldn't get any following commands to work until I manually
rebooted the device (e.g. I could set the apname, but not reboot to reflect the
new name, whereas when I send a blank `SETCMD` before each command I can set
apname, then send a reboot command).

I put all this together into a little bash script that seems to work fairly
well for configuring the basic functions of the endoscope:

```bash
#!/bin/bash
# ⓒ 2019 Nathan Henrie n8henrie.com
# Use at your own risk, setting a network password or apname with illegal or
# insufficient characters may brick your device
# 
# Depencendies:
#   xxd V1.10 27oct98 by Juergen Weigert
#   netcat (The GNU Netcat) 0.7.1 Copyright (C) 2002 - 2003  Giovanni Giacobbi

set -euf -o pipefail

send() {
  xxd -r -p <<<"53 45 54 43 4d 44 00 14 00 00 90 00 01 00 00" | netcat --udp --close 192.168.10.123 50000
  xxd -r -p <<<"53 45 54 43 4d 44 00 00 00 00 $1" | netcat --udp --close 192.168.10.123 50000
}

USAGE=$(cat <<'EOF'
Valid commands:
  reboot
  set_apname APNAME
  clear_password
  set_password PASSWORD
EOF
)

case "$1" in
  reboot) send '04 00 00 00';;
  set_apname) send "01 00 08 00 $(xxd -p <<<"$2")";;
  clear_password) send '03 00 00 00';;
  set_password) send "02 00 08 00 $(xxd -p <<<"$2")";;
  *) echo "$USAGE";;
esac
```

I had planned to also cover streaming the video feed in this post, but it's
gotten fairly lengthy already, so I think I'll extend the series to include a
part 4 and wrap up there.

[1]: https://amzn.to/2pXlelm
[2]: https://amzn.to/2GcJw4t
[3]: https://sourceforge.net/projects/netcat/
[4]: https://amzn.to/2GukcH9
[WireShark]: https://www.wireshark.org/
