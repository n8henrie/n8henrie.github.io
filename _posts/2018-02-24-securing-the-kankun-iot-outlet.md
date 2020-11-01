---
title: Securing the Kankun IoT Outlet
date: 2018-02-24T11:29:57-07:00
author: n8henrie
layout: post
permalink: /2018/02/securing-the-kankun-iot-outlet/
categories:
- tech
excerpt: "The Kankun IoT outlet is cheap and popular, but it seems to ping home
to China -- here's how to stop that."
tags:
- IoT
- homeautomation
- linux
- security
---
**Bottom Line:** The Kankun IoT outlet is cheap and popular, but it seems to
ping home to China -- here's how to stop that.
<!--more-->

The little [Kankun smart
plugs](https://www.amazon.com/KanKun-KK-SP3-Wireless-Wi-Fi-Smart/dp/B00OTWK4TW)
were a big hit a couple of years ago -- cheap (~$20), Wi-Fi enabled, and
hackable. I bout a couple when I could find then on AliExpress, but the US
version was often out of stock. As of time of writing, I actually am not
finding them available at
[AliExpress](https://www.aliexpress.com/item/Home-Control-System-KanKun-KK-SP3-Wireless-Wi-Fi-Smart-Plug-App-For-Android-iOS-US/32334356278.html)
(or Amazon either), so I hope they're not gone for good.

The Kankun switches have SSH open, with `root` access available using the
password `p9z34c` by default. There are lots of posts and projects about things
you can tweak with this switch once you establish access -- my favorite is
<https://github.com/homedash/kankun-json>, which provides both a nice user
interface as well as JSON API for interacting with the switch.

The switch also comes with an iOS app that can be used to set up WiFi and
control the switch. Interestingly, I decided to snoop around with Wireshark and
found that the switch seemed to be calling home to China
([115.29.14.58](https://whois.domaintools.com/115.29.14.58)). I didn't feel
really great about that, especially since it now had my home WiFi password, and
I wasn't doing anything in particular to interact with the switch when these
packets were getting sent.

![Kankun outlet phoning
home](/uploads/2018/02/20180224-wireshark-screenshot.jpg)

Looking at the UDP packet content, I see: 
`fc0f28cf5edc72e3afe5e523f9974f2299a6e356fd9d96c21d57f6f9864636d39e2367fe5f16aa7b33df5d7a147329627b80696dbf781669f28426bf552dad32`

Fortunately, some hackers much smarter than I have already [reverse engineered
the AES key](https://packetstormsecurity.com/files/132210/kankun-disclose.txt)
required to decode this UDP packet: `fdsl;mewrjope456fds4fbvfnjwaugfo`. Once
you have SSH access, you can confirm that this key shows up in
`/sbin/kkeps_off` and `/sbin/kkeps_on`, e.g. `strings sbin/kkeps_off | grep
fdsl`.

With some help from StackOverflow, I hacked together the following Python
script to use the AES key to decrypt the UDP output so I could get an idea of
what info was getting sent back and forth to China.

```python
import sys
import binascii
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


def decrypt(encrypted_hex):

    enc_bytes = binascii.unhexlify(encrypted_hex)
    key = 'fdsl;mewrjope456fds4fbvfnjwaugfo'.encode()
    decryptor = Cipher(algorithm=algorithms.AES(key), mode=modes.ECB(),
                       backend=default_backend()).decryptor()

    decrypted = decryptor.update(enc_bytes) + decryptor.finalize()
    return decrypted


def clean_output(raw):
    br = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    return [segment.decode() for segment in raw.replace(br, b'%%').split(b'%')]


if __name__ == "__main__":
    print()
    for line in clean_output(decrypt(sys.argv[1])):
        print(line)
```

Using the output acquired from Wireshark:

```console
$ python3 decrypt.py fc0f28cf5edc72e3afe5e523f9974f2299a6e356fd9d96c21d57f6f9864636d39e2367fe5f16aa7b33df5d7a147329627b80696dbf781669f28426bf552dad32

wan_device
00:15:61:bd:4b:c9
nopassword
close
heart


```

Decrypting a number of the incoming UDP packets from China showed nothing of
particular interest:

```plaintext
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:02:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:02:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:02:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:02:51
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:03:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:04:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:04:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:04:51
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:05:21
hack
wan_server
00:15:61:bd:4b:c9
nopassword
2016-08-13-06:05:51
hack
```

Regardless, I didn't like the idea of this IoT device communicating with
outside servers, especially since my only use for it would be local control
under HomeAssistant; it has no reason to access *anything* outside of my local
network.

So in order to secure it, I started looking into whether or not I could
configure some kind of firewall to block communication with devices outside my
local network. It ended up not being too difficult to do.

It ends up the Kankun switch's little distro has iptables built in. You can
read about the [configuration file for the
firewall](https://wiki.openwrt.org/doc/uci/firewall) which is found at
`/etc/config/firewall` , but the key line is:

```
# include a file with users custom iptables rules
config include
	option path /etc/firewall.user
```

So what I did was to SCP a file to `/etc/firewall.user` with the following
content:

```iptables
# This file is interpreted as shell script.
# Put your custom iptables rules here, they will
# be executed with each firewall (re-)start.

# Internal uci firewall chains are flushed and recreated on reload, so
# put custom rules into the root chains e.g. INPUT or FORWARD or into the
# special user chains, e.g. input_wan_rule or postrouting_lan_rule.

# Get rid of all existing rules
iptables --flush
iptables --delete-chain

# Default to `DROP` for all
iptables --policy INPUT DROP
iptables --policy FORWARD DROP
iptables --policy OUTPUT DROP

# Allow in and out on loopback
iptables --append INPUT --in-interface lo --jump ACCEPT
iptables --append OUTPUT --out-interface lo --jump ACCEPT

# Allow new and existing incoming SSH from local network
iptables --append INPUT --protocol tcp --destination-port 22 --source 192.168.0.0/24 --match state --state NEW,ESTABLISHED --jump ACCEPT
# Allow existing outgoing SSH from local network
iptables --append OUTPUT --protocol tcp --source-port 22 --destination 192.168.0.0/24 --match state --state ESTABLISHED --jump ACCEPT

# Allow tcp from local network to port 80 (for web requests with https://github.com/homedash/kankun-json)
iptables --append INPUT --protocol tcp --destination-port 80 --source 192.168.0.0/24 --match state --state NEW,ESTABLISHED --jump ACCEPT
iptables --append OUTPUT --protocol tcp --source-port 80 --destination 192.168.0.0/24 --match state --state ESTABLISHED --jump ACCEPT
```

This setup basically allows local SSH connections as well as port 80 for the
JSON API I referenced earlier. I have mine set up with a static IP address, so
it seems to work fairly well with this setup, but people relying on DHCP would
likely also need to open [ports 67 and 68 to UDP
traffic](https://www.juniper.net/documentation/en_US/junos/topics/concept/dhcp-extended-firewall-filter-overview.html), though I'm not sure about that.

Once I had set up this firewall, I can confirm with Wireshark that I no longer
see the communication to or from China, that I can still SSH into the device,
and that the JSON API I installed from the project above still works.

Hope you find this interesting and useful and that your home's IoT is a little
more secure as a result. I don't pretend to be a security expert or to have
much experience with iptables, so if you have any feedback, suggestions, or
other comments about the post, please let me know in the comments section
below.
