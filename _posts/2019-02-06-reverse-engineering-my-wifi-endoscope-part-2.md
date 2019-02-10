---
title: Reverse Engineering My WiFI Endoscope Part 2
date: 2019-02-06T09:01:00-06:00
author: n8henrie
layout: post
permalink: /2019/02/reverse-engineering-my-wifi-endoscope-part-2/
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
- Part 4: Using Netcat to Decode Video Protocol

# Part 2: Reading Flash to Get Telnet Password

Part 1 review: I bought [this WiFi endoscope][1]and accidentally locked myself out of the
WiFi network it creates, but I was able to find the WiFi password in its boot log
via a serial debug port.

At this point, I wanted to see what else I could do with the device.
Unfortunately, I didn't have any luck getting a command prompt from the serial
port. However, once it was back up and running, I connected to the network with
my Macbook to do some tinkering.

First, I noted that it always seemed to assign itself the address
`192.168.10.123`, which seemed like it might be helpful with some Google
searches.

Next, I ran an `nmap` scans and noted an open TCP port 23, often used for
telnet, as well as an open TCP port 7060. 

Connecting to 7060 with `netcat` got me a continuous stream of junk.

I hoped the telnet login would be something like `root:root`, but I
didn't have any luck with various combinations of `root`, `admin`, `jetion`,
`password`, `123456`, or `12345678` (the default WiFi password).

Next, I figured I could just run an automated cracker with
[hydra](https://github.com/vanhauser-thc/thc-hydra) and some default usernames
and passwords from [SecLists](https://github.com/danielmiessler/SecLists).
Surprisingly, that didn't work either.

Next, I tried downloading [the Android version of the
app](https://play.google.com/store/apps/details?id=com.wifiview.endoscope) and
decompiling it with [apktool](https://github.com/iBotPeaches/Apktool).
Unfortunately, I couldn't find any references in it to telnet, port 23, or any
promising usernames or passwords. I didn't find anything interesting about port
7060, either.

Eventually, I decided to buy a [bus pirate][2] and [a suitable
adapter](https://amzn.to/2UzXSj0) for the 8-pin chip and see if I could burn a
copy of the firmware. I'd always wanted to try this! Here's a picture of the
board again:

![](/uploads/2019/02/IMG_6188.jpg)

The chip of interest is the little 8 pin one in the top left. Here is a
close-up:

![](/uploads/2019/02/IMG_6195.jpg)

It's not a great shot, but you can just make out [Winbond
25Q32](https://www.winbond.com/resource-files/w25q32bv_revi_100413_wo_automotive.pdf).

Thankfully, since I had *no clue* what I was doing, I found [a great
walkthrough](http://konukoii.com/blog/2018/02/13/lifting-firmware-with-the-bus-pirate/)
for this chip that showed me exactly how to hook up the bus pirate. For posterity, here's a copy of the table graciously provided there:

Bus Pirate|Flash Chip|Description
--|--|--
CS|#1 CS|Chip Select
MISO|#2 DO (IO1)|Master In, Slave Out
3V3|#3 WP (IO2)|Write Protect
GND|#4 GND|Ground
MOSI|#5 DI (IO0)|Master Out, Slave In
CLK|#6 CLK|The SPI Clock
3V3|#7 HOLD (IO3)|Hold
3V3|#8 VCC|Supply

<br>
And here is its pad configuration, taken from the [datasheet](https://www.winbond.com/resource-files/w25q32bv_revi_100413_wo_automotive.pdf):

![](/uploads/2019/02/w25q32_pads.jpg)

I ran the following, which correctly identified the chip, confirming things
were connected properly:

```console
$ flashrom -p buspirate_spi:dev=/dev/tty.usbserial-AK05V1SK 
```

Afterwards, the command below read the firmware to a local file named
`W25Q32.V.eeprom`:

```console
$ flashrom -p buspirate_spi:dev=/dev/tty.usbserial-AK05V1SK,spispeed=30k \
  -c W25Q32.V -r W25Q32.V.eeprom -V
```

I was psyched! The next step should have been the easy part, which was using
[`binwalk`](https://github.com/ReFirmLabs/binwalk) to extract the firmware.
However, I soon discovered that the file didn't quite work as expected. Binwalk
extracted something, but it seemed incomplete, and I couldn't find anything
interesting that looked like a password.

I tried again, using the same `flashrom` command as above, and still it didn't
work. I soon figured out that the files were slightly different,
suggesting that there were likely some minor errors during the file read process. I tried
adjusting the clip and verified that all the connections were solid (though I
didn't bother with soldering them), but after multiple attempts I consistently ended up getting files that were slightly different, and binwalk couldn't fully extract them.

Eventually, I decided to write a little bash script that would repeatedly try
to grab a copy of the firmware, compare its md5 hash to that of all the priors,
and if there was a match to stop the loop. If not, it tried again. I figured
that *eventually*, once it got an exact duplicate, I could assume it had
finally gotten a correct copy. Here's my bash script:

```bash
#! /bin/bash

counter="$(ls *.eeprom | cut -d. -f3 | sort -n | tail -n 1)"
((counter++))

while : ; do
  time flashrom -p buspirate_spi:dev=/dev/tty.usbserial-AK05V1SK,spispeed=30k \
    -c W25Q32.V -r W25Q32.V.${counter}.eeprom -V
  md5count=($(md5sum *.eeprom | awk '{ print $1 }' | sort | uniq -c | awk '{ print $1 }' | sort -u))
  if [ "${#md5count[@]}" -gt 1 ]; then
    break
  fi
  ((counter++))
done
```

Unfortunately, this never happened. I ended up grabbing *hundreds* of copies of
the firmware, all with a few differing bytes, and therefore a different hash.
Finally, after several *days* of running this, I decided to try a different
approach: I'd take the binary content of all the files, and take the **mode**
of each byte, and write that out to a file, assuming that the most common byte
at each address was likely to be the correct data.

For this, I first tried to see if someone had already done the work for me, and
I eventually found [a blog post that outlines a similar
strategy](https://www.j-michel.org/blog/2013/09/16/firmware-extraction-and-reconstruction) 
and [the resulting Python
code](https://bitbucket.org/jmichel/tools/src/b37339dd9c8f821b1b2bac4cef75f9cd30094db4/firmware-reconstruct.py),
but I ended up using a different strategy that leverages [numpy](http://www.numpy.org/) to hopefully speed
things up a bit. My code:

```python
import pathlib

import numpy as np

def get_most_common_value(arr: np.array) -> bytes:
    nancount = np.isnan(arr).sum()
    nums, counts = np.unique(arr, return_counts=True)

    ind = np.argmax(counts)
    return nums[ind]

if __name__ == '__main__':
    arrs = np.array([np.fromfile(str(p), dtype="u1")
                     for p in pathlib.Path(".").glob("W25Q32.V.*.eeprom")])
    modes = np.apply_along_axis(get_most_common_value, 0, arrs)
    pathlib.Path("merged.eeprom").write_bytes(modes.tobytes())
```

For a little under 300 files, each of which is about 4 MB, it takes about three
and a half minutes to run. Thankfully, the resulting file is extracted
beautifully by binwalk. I've uploaded a [copy of the
gzipped eeprom](/uploads/2019/02/W25Q32_endoscope_merged.eeprom) for anybody interested
in checking it out; md5 of the gzipped file is `35d014b329d8e94318b59247a41139f6`.

Here are the results of `binwalk`:

```console
$ binwalk -Me merged.eeprom

Scan Time:     2019-02-01 22:10:34
Target File:   /Users/me/endoscope/merged.eeprom
MD5 Checksum:  8da2f08e906520d4a67fc20dec346360
Signatures:    344

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             uImage header, header size: 64 bytes, header CRC: 0x7EBF92E6, created: 2013-09-02 14:03:02, image size: 81904 bytes, Data Address: 0x80200000, Entry Point: 0x80200000, data CRC: 0x739ABB93, OS: Linux, CPU: MIPS, image type: Standalone Program, compression type: none, image name: "SPI Flash Image"
69296         0x10EB0         U-Boot version string, "U-Boot 1.1.3 (Sep  2 2013 - 22:03:00)"
327680        0x50000         uImage header, header size: 64 bytes, header CRC: 0x24EF36B4, created: 2017-07-30 08:41:54, image size: 1578918 bytes, Data Address: 0x80000000, Entry Point: 0x8031F000, data CRC: 0x67F11261, OS: Linux, CPU: MIPS, image type: OS Kernel Image, compression type: lzma, image name: "Linux Kernel Image"
327744        0x50040         LZMA compressed data, properties: 0x5D, dictionary size: 33554432 bytes, uncompressed size: 3926339 bytes


Scan Time:     2019-02-01 22:10:35
Target File:   /Users/me/endoscope/_merged.eeprom.extracted/50040
MD5 Checksum:  966ea70c3127490310ab0feec1b5e36f
Signatures:    344

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
2096284       0x1FFC9C        MySQL MISAM compressed data file Version 8
2859060       0x2BA034        Linux kernel version "2.6.21 (tony@ubuntu) (gcc version 3.4.2) #545 Sun Jul 30 16:41:50 CST 2017"
2860048       0x2BA410        CRC32 polynomial table, little endian
2883552       0x2BFFE0        SHA256 hash constants, little endian
2960710       0x2D2D46        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/mlme.c:%d assert SupRateLen <= MAX_LEN_OF_SUPPORTED_RATESfailed
2960830       0x2D2DBE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/mlme.c:%d assert ExtRateLen <= MAX_LEN_OF_SUPPORTED_RATESfailed
2962282       0x2D336A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/action.c:%d assert pAd->BATable.BAOriEntry[i].Wcid < MAX_LEN_OF_MAC_TABLEfailed
2962418       0x2D33F2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/action.c:%d assert pBAEntry->Wcid < MAX_LEN_OF_MAC_TABLEfailed
2962902       0x2D35D6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert mpdu_blkfailed
2962998       0x2D3636        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert listfailed
2963090       0x2D3692        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert mpdu_blk->pPacketfailed
2963194       0x2D36FA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pBAEntry->list.qlen == 0failed
2963494       0x2D3826        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert TID < NUM_OF_TIDfailed
2963990       0x2D3A16        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pEntryfailed
2964110       0x2D3A8E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pAd->BATable.numAsOriginator != 0failed
2964274       0x2D3B32        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pAd->BATable.numAsRecipient != 0failed
2964810       0x2D3D4A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pAd->MacTab.Content[Elem->Wcid].Sst == SST_ASSOCfailed
2965394       0x2D3F92        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pRxBlk->pRxPacketfailed
2965546       0x2D402A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert (0<= pBAEntry->list.qlen) && (pBAEntry->list.qlen <= pBAEntry
2965706       0x2D40CA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert pBAEntryfailed
2965850       0x2D415A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert 0failed
2965938       0x2D41B2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/ba_action.c:%d assert (pBAEntry->list.qlen == 0) && (pBAEntry->list.next == NULL)fa
2966274       0x2D4302        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pEntryfailed
2966566       0x2D4426        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert Length <= MGMT_DMA_BUFFER_SIZEfailed
2966738       0x2D44D2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pTxWIfailed
2967178       0x2D468A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pProbeEntry != NULLfailed
2967318       0x2D4716        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pProbeEntryfailed
2967590       0x2D4826        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pSrcBuffailed
2967682       0x2D4882        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert (pktLen > 34)failed
2967782       0x2D48E6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pRxBlk->pRxPacketfailed
2968014       0x2D49CE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pAd->FragFrame.LastFrag == 0failed
2968126       0x2D4A3E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pHeaderfailed
2968282       0x2D4ADA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data.c:%d assert pAd->FragFrame.pFragPacketfailed
2969362       0x2D4F12        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/rtmp_init.c:%d assert (Length==0) || (pDest && pSrc)failed
2989138       0x2D9C52        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_profile.c:%d assert pAd->ApCfg.MBSSID[idx].AccessControlList.Num <= MAX_NUM_OF_
2991410       0x2DA532        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_asic.c:%d assert BssIndex < 4failed
2991506       0x2DA592        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_asic.c:%d assert KeyIdx < 4failed
2993770       0x2DAE6A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data_pci.c:%d assert QueIdx < NUM_OF_TX_RINGfailed
2993882       0x2DAEDA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_data_pci.c:%d assert pAd->ate.QID == 0failed
2995738       0x2DB61A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap.c:%d assert Apidx < MAX_MBSSID_NUM(pAd)failed
2996462       0x2DB8EE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_assoc.c:%d assert Aid == Wcidfailed
2998086       0x2DBF46        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_assoc.c:%d assert pHTCapabilityfailed
2998466       0x2DC0C2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_auth.c:%d assert Seq == 1failed
2998554       0x2DC11A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_auth.c:%d assert pEntry == NULLfailed
2998854       0x2DC246        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_auth.c:%d assert pEntry->Aid == Elem->Wcidfailed
3000378       0x2DC83A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_sync.c:%d assert regclassfailed
3000466       0x2DC892        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_wpa.c:%d assert pEntry->apidx < pAd->ApCfg.BssidNumfailed
3000582       0x2DC906        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_wpa.c:%d assert pEntryfailed
3002574       0x2DD0CE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert pTxBlk->MpduHeaderLen >= 24failed
3002682       0x2DD13A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert pTxBlkfailed
3002810       0x2DD1BA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert (pTxBlk->TxPacketList.Number > 1)failed
3002922       0x2DD22A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert TX_BLK_TEST_FLAG(pTxBlk, fTX_bAllowFrag)failed
3003042       0x2DD2A2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert (pTxBlk->TxPacketList.Number== 2)failed
3003754       0x2DD56A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_data.c:%d assert pEntry->Aid == pRxWI->WirelessCliIDfailed
3010414       0x2DEF6E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_cfg.c:%d assert pacl->Num < MAX_NUM_OF_ACL_LISTfailed
3010566       0x2DF006        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_cfg.c:%d assert pAd->ApCfg.MBSSID[pObj->ioctl_if].AccessControlList.Num == 0failed
3010706       0x2DF092        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_cfg.c:%d assert acl.Num >= pAd->ApCfg.MBSSID[pObj->ioctl_if].AccessControlList.Numfa
3011270       0x2DF2C6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_cfg.c:%d assert ((bClearAll == 1) && (pacl->Num > 0))failed
3011386       0x2DF33A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_cfg.c:%d assert pacl->Num == 0failed
3017050       0x2E095A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert memfailed
3017182       0x2E09DE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert DataLenfailed
3017278       0x2E0A3E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert pDatafailed
3017522       0x2E0B32        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert pPacketfailed
3017618       0x2E0B92        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert DataSize < 1530failed
3017722       0x2E0BFA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert pHeader802_3failed
3017926       0x2E0CC6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert pNetDevfailed
3018214       0x2E0DE6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert (prefixLen < IFNAMSIZ)failed
3018322       0x2E0E52        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert ((slotNameLen + prefixLen) < IFNAMSIZ)failed
3018970       0x2E10DA        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_linux.c:%d assert pTaskfailed
3019052       0x2E112C        Unix path: /etc/Wireless/RT2860AP/RT2860AP.dat
3019230       0x2E11DE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_profile.c:%d assert pPacketfailed
3019338       0x2E124A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_profile.c:%d assert dev_pfailed
3019710       0x2E13BE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/os/linux/rt_main_dev.c:%d assert pAdfailed
3020666       0x2E177A        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/rt_ate.c:%d assert (BbpValue == 0x04)failed
3020798       0x2E17FE        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/rt_ate.c:%d assert bbp_data == valuefailed
3022478       0x2E1E8E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/rt_ate.c:%d assert RestoreRfICType != 0failed
3029806       0x2E3B2E        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_apcli.c:%d assert pAdfailed
3029890       0x2E3B82        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/ap/ap_apcli_inf.c:%d assert pAdfailed
3033494       0x2E4996        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_mat.c:%d assert pHandlefailed
3034054       0x2E4BC6        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_mat_iparp.c:%d assert pMacAddrfailed
3035254       0x2E5076        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/cmm_mat_ipv6.c:%d assert pIPv6Addrfailed
3035618       0x2E51E2        Unix path: /net/wireless/rt2860v2_ap/../rt2860v2/common/rt_rf.c:%d assert (regID <= pAd->chipCap.MaxNumOfRfId)failed
3082311       0x2F0847        Neighborly text, "neighbor %.2x%.2x.%.2x:%.2x:%.2x:%.2x:%.2x:%.2x lost on port %d(%s)(%s)"
3204032       0x30E3C0        CRC32 polynomial table, little endian
3411968       0x341000        LZMA compressed data, properties: 0x5D, dictionary size: 1048576 bytes, uncompressed size: 2059264 bytes


Scan Time:     2019-02-01 22:10:37
Target File:   /Users/me/endoscope/_merged.eeprom.extracted/_50040.extracted/341000
MD5 Checksum:  45a0880b002ebd3ceafe21ed076e0e14
Signatures:    344

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             ASCII cpio archive (SVR4 with no CRC), file name: "/bin", file name length: "0x00000005", file size: "0x00000000"
116           0x74            ASCII cpio archive (SVR4 with no CRC), file name: "/bin/rm", file name length: "0x00000008", file size: "0x00000008"
244           0xF4            ASCII cpio archive (SVR4 with no CRC), file name: "/bin/iwpriv", file name length: "0x0000000C", file size: "0x00008D78"
368           0x170           ELF, 32-bit LSB MIPS-II executable, MIPS, version 1 (SYSV)
36584         0x8EE8          ASCII cpio archive (SVR4 with no CRC), file name: "/bin/busybox", file name length: "0x0000000D", file size: "0x00066F68"
36708         0x8F64          ELF, 32-bit LSB MIPS-II executable, MIPS, version 1 (SYSV)
397551        0x610EF         Copyright string: "Copyright (C) 1998-2008 Erik Andersen, Rob Landley, Denys Vlasenko"
406193        0x632B1         Unix path: /proc/net/vlan/config
458444        0x6FECC         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ralink_init", file name length: "0x00000011", file size: "0x00008D04"
458572        0x6FF4C         ELF, 32-bit LSB MIPS-II executable, MIPS, version 1 (SYSV)
484684        0x7654C         Unix path: /etc/Wireless/RT2860/RT2860.dat
494672        0x78C50         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ping", file name length: "0x0000000A", file size: "0x00000008"
494800        0x78CD0         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/hostname", file name length: "0x0000000E", file size: "0x00000008"
494932        0x78D54         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/nvram_daemon", file name length: "0x00000012", file size: "0x00001A38"
495060        0x78DD4         ELF, 32-bit LSB MIPS-II executable, MIPS, version 1 (SYSV)
499888        0x7A0B0         Unix path: /etc_ro/Wireless/RT61AP/RT2561_default
501772        0x7A80C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/sync", file name length: "0x0000000A", file size: "0x00000008"
501900        0x7A88C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/iwlist", file name length: "0x0000000C", file size: "0x0000A540"
502024        0x7A908         ELF, 32-bit LSB MIPS-II executable, MIPS, version 1 (SYSV)
544328        0x84E48         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/vi", file name length: "0x00000008", file size: "0x00000008"
544456        0x84EC8         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/date", file name length: "0x0000000A", file size: "0x00000008"
544584        0x84F48         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/nvram_get", file name length: "0x0000000F", file size: "0x0000000C"
544724        0x84FD4         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/touch", file name length: "0x0000000B", file size: "0x00000008"
544856        0x85058         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mknod", file name length: "0x0000000B", file size: "0x00000008"
544988        0x850DC         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/chmod", file name length: "0x0000000B", file size: "0x00000008"
545120        0x85160         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/app_cam", file name length: "0x0000000D", file size: "0x0001C4B0"
661132        0xA168C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mv", file name length: "0x00000008", file size: "0x00000008"
661260        0xA170C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ping6", file name length: "0x0000000B", file size: "0x00000008"
661392        0xA1790         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/lsusb", file name length: "0x0000000B", file size: "0x0000CEE0"
714476        0xAE6EC         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/dmesg", file name length: "0x0000000B", file size: "0x00000008"
714608        0xAE770         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mkdir", file name length: "0x0000000B", file size: "0x00000008"
714740        0xAE7F4         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ash", file name length: "0x00000009", file size: "0x00000008"
714868        0xAE874         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ps", file name length: "0x00000008", file size: "0x00000008"
714996        0xAE8F4         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mtd_write", file name length: "0x0000000F", file size: "0x000031C8"
727868        0xB1B3C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/sed", file name length: "0x00000009", file size: "0x00000008"
727996        0xB1BBC         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ls", file name length: "0x00000008", file size: "0x00000008"
728124        0xB1C3C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mount", file name length: "0x0000000B", file size: "0x00000008"
728256        0xB1CC0         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/nvram_set", file name length: "0x0000000F", file size: "0x0000000C"
728396        0xB1D4C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/ated", file name length: "0x0000000A", file size: "0x000026C0"
738436        0xB4484         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/switch", file name length: "0x0000000C", file size: "0x00003F6C"
754796        0xB846C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/flash", file name length: "0x0000000B", file size: "0x000037A8"
769168        0xBBC90         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/cp", file name length: "0x00000008", file size: "0x00000008"
769296        0xBBD10         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/pwd", file name length: "0x00000009", file size: "0x00000008"
769424        0xBBD90         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/mii_mgr", file name length: "0x0000000D", file size: "0x00001490"
774812        0xBD29C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/kill", file name length: "0x0000000A", file size: "0x00000008"
774940        0xBD31C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/umount", file name length: "0x0000000C", file size: "0x00000008"
775072        0xBD3A0         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/grep", file name length: "0x0000000A", file size: "0x00000008"
775200        0xBD420         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/sleep", file name length: "0x0000000B", file size: "0x00000008"
775332        0xBD4A4         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/cat", file name length: "0x00000009", file size: "0x00000008"
775460        0xBD524         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/echo", file name length: "0x0000000A", file size: "0x00000008"
775588        0xBD5A4         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/sh", file name length: "0x00000008", file size: "0x00000008"
775716        0xBD624         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/reg", file name length: "0x00000009", file size: "0x00001AD0"
782700        0xBF16C         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/login", file name length: "0x0000000B", file size: "0x00000008"
782832        0xBF1F0         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/iwconfig", file name length: "0x0000000E", file size: "0x0000A3D8"
824900        0xC9644         ASCII cpio archive (SVR4 with no CRC), file name: "/bin/app_detect", file name length: "0x00000010", file size: "0x0000269C"
834912        0xCBD60         ASCII cpio archive (SVR4 with no CRC), file name: "/dev", file name length: "0x00000005", file size: "0x00000000"
835028        0xCBDD4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/spiS0", file name length: "0x0000000B", file size: "0x00000000"
835152        0xCBE50         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ac0", file name length: "0x00000009", file size: "0x00000000"
835272        0xCBEC8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock2", file name length: "0x0000000F", file size: "0x00000000"
835400        0xCBF48         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock7", file name length: "0x0000000F", file size: "0x00000000"
835528        0xCBFC8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd6ro", file name length: "0x0000000C", file size: "0x00000000"
835652        0xCC044         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd3ro", file name length: "0x0000000C", file size: "0x00000000"
835776        0xCC0C0         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/kmem", file name length: "0x0000000A", file size: "0x00000000"
835896        0xCC138         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd0", file name length: "0x0000000A", file size: "0x00000000"
836016        0xCC1B0         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd1ro", file name length: "0x0000000C", file size: "0x00000000"
836140        0xCC22C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pts", file name length: "0x00000009", file size: "0x00000000"
836260        0xCC2A4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pts/1", file name length: "0x0000000B", file size: "0x00000000"
836384        0xCC320         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pts/3", file name length: "0x0000000B", file size: "0x00000000"
836508        0xCC39C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pts/0", file name length: "0x0000000B", file size: "0x00000000"
836632        0xCC418         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pts/2", file name length: "0x0000000B", file size: "0x00000000"
836756        0xCC494         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ttyp0", file name length: "0x0000000B", file size: "0x00000000"
836880        0xCC510         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/pcm0", file name length: "0x0000000A", file size: "0x00000000"
837000        0xCC588         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/random", file name length: "0x0000000C", file size: "0x00000000"
837124        0xCC604         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd5ro", file name length: "0x0000000C", file size: "0x00000000"
837248        0xCC680         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mem", file name length: "0x00000009", file size: "0x00000000"
837368        0xCC6F8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ram1", file name length: "0x0000000A", file size: "0x00000000"
837488        0xCC770         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/urandom", file name length: "0x0000000D", file size: "0x00000000"
837612        0xCC7EC         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd4ro", file name length: "0x0000000C", file size: "0x00000000"
837736        0xCC868         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ttyp1", file name length: "0x0000000B", file size: "0x00000000"
837860        0xCC8E4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ram3", file name length: "0x0000000A", file size: "0x00000000"
837980        0xCC95C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/hwnat0", file name length: "0x0000000C", file size: "0x00000000"
838104        0xCC9D8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd2ro", file name length: "0x0000000C", file size: "0x00000000"
838228        0xCCA54         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock3", file name length: "0x0000000F", file size: "0x00000000"
838356        0xCCAD4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/i2cM0", file name length: "0x0000000B", file size: "0x00000000"
838480        0xCCB50         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd0ro", file name length: "0x0000000C", file size: "0x00000000"
838604        0xCCBCC         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/swnat0", file name length: "0x0000000C", file size: "0x00000000"
838728        0xCCC48         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/nvram", file name length: "0x0000000B", file size: "0x00000000"
838852        0xCCCC4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/video0", file name length: "0x0000000C", file size: "0x00000000"
838976        0xCCD40         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd1", file name length: "0x0000000A", file size: "0x00000000"
839096        0xCCDB8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd4", file name length: "0x0000000A", file size: "0x00000000"
839216        0xCCE30         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ptyp0", file name length: "0x0000000B", file size: "0x00000000"
839340        0xCCEAC         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd2", file name length: "0x0000000A", file size: "0x00000000"
839460        0xCCF24         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd5", file name length: "0x0000000A", file size: "0x00000000"
839580        0xCCF9C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/cls0", file name length: "0x0000000A", file size: "0x00000000"
839700        0xCD014         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ttyS1", file name length: "0x0000000B", file size: "0x00000000"
839824        0xCD090         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ppp", file name length: "0x00000009", file size: "0x00000000"
839944        0xCD108         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock1", file name length: "0x0000000F", file size: "0x00000000"
840072        0xCD188         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/flash0", file name length: "0x0000000C", file size: "0x00000000"
840196        0xCD204         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/null", file name length: "0x0000000A", file size: "0x00000000"
840316        0xCD27C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd6", file name length: "0x0000000A", file size: "0x00000000"
840436        0xCD2F4         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock6", file name length: "0x0000000F", file size: "0x00000000"
840564        0xCD374         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ptyp1", file name length: "0x0000000B", file size: "0x00000000"
840688        0xCD3F0         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock5", file name length: "0x0000000F", file size: "0x00000000"
840816        0xCD470         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtr0", file name length: "0x0000000A", file size: "0x00000000"
840936        0xCD4E8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd3", file name length: "0x0000000A", file size: "0x00000000"
841056        0xCD560         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/acl0", file name length: "0x0000000A", file size: "0x00000000"
841176        0xCD5D8         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd7", file name length: "0x0000000A", file size: "0x00000000"
841296        0xCD650         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ttyS0", file name length: "0x0000000B", file size: "0x00000000"
841420        0xCD6CC         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/i2s0", file name length: "0x0000000A", file size: "0x00000000"
841540        0xCD744         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ram", file name length: "0x00000009", file size: "0x00000000"
841660        0xCD7BC         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtd7ro", file name length: "0x0000000C", file size: "0x00000000"
841784        0xCD838         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ram0", file name length: "0x0000000A", file size: "0x00000000"
841904        0xCD8B0         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/rdm0", file name length: "0x0000000A", file size: "0x00000000"
842024        0xCD928         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ram2", file name length: "0x0000000A", file size: "0x00000000"
842144        0xCD9A0         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/ptmx", file name length: "0x0000000A", file size: "0x00000000"
842264        0xCDA18         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock0", file name length: "0x0000000F", file size: "0x00000000"
842392        0xCDA98         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/mtdblock4", file name length: "0x0000000F", file size: "0x00000000"
842520        0xCDB18         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/watchdog", file name length: "0x0000000E", file size: "0x00000000"
842644        0xCDB94         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/gpio", file name length: "0x0000000A", file size: "0x00000000"
842764        0xCDC0C         ASCII cpio archive (SVR4 with no CRC), file name: "/dev/console", file name length: "0x0000000D", file size: "0x00000000"
842888        0xCDC88         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin", file name length: "0x00000006", file size: "0x00000000"
843004        0xCDCFC         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/config.sh", file name length: "0x00000010", file size: "0x00001943"
849600        0xCF6C0         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/mdev", file name length: "0x0000000B", file size: "0x0000000F"
849740        0xCF74C         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/rmmod", file name length: "0x0000000C", file size: "0x0000000F"
849880        0xCF7D8         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/wan.sh", file name length: "0x0000000D", file size: "0x00000459"
851120        0xCFCB0         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/start.sh", file name length: "0x0000000F", file size: "0x00000804"
853300        0xD0534         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/ifconfig", file name length: "0x0000000F", file size: "0x0000000F"
853444        0xD05C4         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/video_ko.sh", file name length: "0x00000012", file size: "0x00000412"
854616        0xD0A58         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/dhcp6s", file name length: "0x0000000D", file size: "0x000213C0"
990868        0xF1E94         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/lsmod", file name length: "0x0000000C", file size: "0x0000000F"
991008        0xF1F20         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/config_save.sh", file name length: "0x00000015", file size: "0x000004BB"
992352        0xF2460         ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/dhcp6c", file name length: "0x0000000D", file size: "0x00032418"
1198324       0x1248F4        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/wifi_ap.sh", file name length: "0x00000011", file size: "0x000009E1"
1200984       0x125358        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/vconfig", file name length: "0x0000000E", file size: "0x0000000F"
1201124       0x1253E4        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/syslogd", file name length: "0x0000000E", file size: "0x0000000F"
1201264       0x125470        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/insmod", file name length: "0x0000000D", file size: "0x0000000F"
1201404       0x1254FC        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/runapp.sh", file name length: "0x00000010", file size: "0x000000EE"
1201772       0x12566C        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/reboot", file name length: "0x0000000D", file size: "0x0000000F"
1201912       0x1256F8        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/fdisk", file name length: "0x0000000C", file size: "0x0000000F"
1202052       0x125784        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/init", file name length: "0x0000000B", file size: "0x0000000F"
1202192       0x125810        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/klogd", file name length: "0x0000000C", file size: "0x0000000F"
1202332       0x12589C        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/logread", file name length: "0x0000000E", file size: "0x0000000F"
1202472       0x125928        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/halt", file name length: "0x0000000B", file size: "0x0000000F"
1202612       0x1259B4        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/wifi_nuotai.sh", file name length: "0x00000015", file size: "0x00000A08"
1205312       0x126440        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/poweroff", file name length: "0x0000000F", file size: "0x0000000F"
1205456       0x1264D0        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/chpasswd.sh", file name length: "0x00000012", file size: "0x00000169"
1205948       0x1266BC        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/route", file name length: "0x0000000C", file size: "0x0000000F"
1206088       0x126748        ASCII cpio archive (SVR4 with no CRC), file name: "/sbin/udhcpc", file name length: "0x0000000D", file size: "0x0000000F"
1206228       0x1267D4        ASCII cpio archive (SVR4 with no CRC), file name: "/media", file name length: "0x00000007", file size: "0x00000000"
1206348       0x12684C        ASCII cpio archive (SVR4 with no CRC), file name: "/home", file name length: "0x00000006", file size: "0x00000000"
1206464       0x1268C0        ASCII cpio archive (SVR4 with no CRC), file name: "/proc", file name length: "0x00000006", file size: "0x00000000"
1206580       0x126934        ASCII cpio archive (SVR4 with no CRC), file name: "/usr", file name length: "0x00000005", file size: "0x00000000"
1206696       0x1269A8        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin", file name length: "0x00000009", file size: "0x00000000"
1206816       0x126A20        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/expr", file name length: "0x0000000E", file size: "0x00000012"
1206960       0x126AB0        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/find", file name length: "0x0000000E", file size: "0x00000012"
1207104       0x126B40        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/tftp", file name length: "0x0000000E", file size: "0x00000012"
1207248       0x126BD0        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/printf", file name length: "0x00000010", file size: "0x00000012"
1207396       0x126C64        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/time", file name length: "0x0000000E", file size: "0x00000012"
1207540       0x126CF4        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/[", file name length: "0x0000000B", file size: "0x00000012"
1207684       0x126D84        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/logger", file name length: "0x00000010", file size: "0x00000012"
1207832       0x126E18        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/test", file name length: "0x0000000E", file size: "0x00000012"
1207976       0x126EA8        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/basename", file name length: "0x00000012", file size: "0x00000012"
1208124       0x126F3C        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/tr", file name length: "0x0000000C", file size: "0x00000012"
1208268       0x126FCC        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/[[", file name length: "0x0000000C", file size: "0x00000012"
1208412       0x12705C        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/killall", file name length: "0x00000011", file size: "0x00000012"
1208560       0x1270F0        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/uptime", file name length: "0x00000010", file size: "0x00000012"
1208708       0x127184        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/wc", file name length: "0x0000000C", file size: "0x00000012"
1208852       0x127214        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/free", file name length: "0x0000000E", file size: "0x00000012"
1208996       0x1272A4        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/bin/top", file name length: "0x0000000D", file size: "0x00000012"
1209140       0x127334        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/sbin", file name length: "0x0000000A", file size: "0x00000000"
1209260       0x1273AC        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/sbin/brctl", file name length: "0x00000010", file size: "0x00000012"
1209408       0x127440        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/sbin/udhcpd", file name length: "0x00000011", file size: "0x00000012"
1209556       0x1274D4        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/sbin/chpasswd", file name length: "0x00000013", file size: "0x00000012"
1209708       0x12756C        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/sbin/telnetd", file name length: "0x00000012", file size: "0x00000012"
1209856       0x127600        ASCII cpio archive (SVR4 with no CRC), file name: "/usr/codepages", file name length: "0x0000000F", file size: "0x00000000"
1209984       0x127680        ASCII cpio archive (SVR4 with no CRC), file name: "/sys", file name length: "0x00000005", file size: "0x00000000"
1210100       0x1276F4        ASCII cpio archive (SVR4 with no CRC), file name: "/etc", file name length: "0x00000005", file size: "0x00000000"
1210216       0x127768        ASCII cpio archive (SVR4 with no CRC), file name: "/etc/motd", file name length: "0x0000000A", file size: "0x00000011"
1210356       0x1277F4        ASCII cpio archive (SVR4 with no CRC), file name: "/etc/fstab", file name length: "0x0000000B", file size: "0x000001A8"
1210904       0x127A18        ASCII cpio archive (SVR4 with no CRC), file name: "/var", file name length: "0x00000005", file size: "0x00000000"
1211020       0x127A8C        ASCII cpio archive (SVR4 with no CRC), file name: "/mnt", file name length: "0x00000005", file size: "0x00000000"
1211136       0x127B00        ASCII cpio archive (SVR4 with no CRC), file name: "/init", file name length: "0x00000006", file size: "0x0000000C"
1211264       0x127B80        ASCII cpio archive (SVR4 with no CRC), file name: "/lib", file name length: "0x00000005", file size: "0x00000000"
1211380       0x127BF4        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libnvram.so.0", file name length: "0x00000013", file size: "0x00000013"
1211532       0x127C8C        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libpthread.so.0", file name length: "0x00000015", file size: "0x00000015"
1211688       0x127D28        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libm.so", file name length: "0x0000000D", file size: "0x0000000F"
1211828       0x127DB4        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libuClibc-0.9.28.so", file name length: "0x00000019", file size: "0x0005F634"
1602672       0x187470        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libcrypt.so", file name length: "0x00000011", file size: "0x00000013"
1602820       0x187504        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules", file name length: "0x0000000D", file size: "0x00000000"
1602944       0x187580        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21", file name length: "0x00000014", file size: "0x00000000"
1603076       0x187604        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel", file name length: "0x0000001B", file size: "0x00000000"
1603216       0x187690        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers", file name length: "0x00000023", file size: "0x00000000"
1603364       0x187724        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media", file name length: "0x00000029", file size: "0x00000000"
1603516       0x1877BC        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video", file name length: "0x0000002F", file size: "0x00000000"
1603676       0x18785C        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/videodev.ko", file name length: "0x0000003B", file size: "0x00009718"
1642528       0x191020        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/uvc", file name length: "0x00000033", file size: "0x00000000"
1642692       0x1910C4        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/uvc/uvcvideo.ko", file name length: "0x0000003F", file size: "0x000151E4"
1729368       0x1A6358        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/compat_ioctl32.ko", file name length: "0x00000041", file size: "0x00000660"
1731176       0x1A6A68        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/v4l1-compat.ko", file name length: "0x0000003E", file size: "0x00004ADC"
1750512       0x1AB5F0        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/modules/2.6.21/kernel/drivers/media/video/v4l2-common.ko", file name length: "0x0000003E", file size: "0x000054D0"
1772396       0x1B0B6C        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libcrypt.so.0", file name length: "0x00000013", file size: "0x00000013"
1772548       0x1B0C04        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libm-0.9.28.so", file name length: "0x00000014", file size: "0x00007848"
1803472       0x1B84D0        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libc.so.0", file name length: "0x0000000F", file size: "0x00000014"
1803620       0x1B8564        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libc.so", file name length: "0x0000000D", file size: "0x00000014"
1803764       0x1B85F4        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libpthread-0.9.28.so", file name length: "0x0000001A", file size: "0x00017BBC"
1901112       0x1D0238        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libutil.so.0", file name length: "0x00000012", file size: "0x00000012"
1901260       0x1D02CC        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libpthread.so", file name length: "0x00000013", file size: "0x00000015"
1901416       0x1D0368        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/ld-uClibc.so.0", file name length: "0x00000014", file size: "0x00000014"
1901568       0x1D0400        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libusb.so.1.0.0", file name length: "0x00000015", file size: "0x0000D248"
1955532       0x1DD6CC        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libdl-0.9.28.so", file name length: "0x00000015", file size: "0x000024A0"
1965040       0x1DFBF0        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libnvram-0.9.28.so", file name length: "0x00000018", file size: "0x00008524"
1999260       0x1E819C        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libcrypt-0.9.28.so", file name length: "0x00000018", file size: "0x000034D8"
2012924       0x1EB6FC        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libdl.so", file name length: "0x0000000E", file size: "0x00000010"
2013064       0x1EB788        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libutil-0.9.28.so", file name length: "0x00000017", file size: "0x000013A8"
2018232       0x1ECBB8        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libdl.so.0", file name length: "0x00000010", file size: "0x00000010"
2018376       0x1ECC48        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libutil.so", file name length: "0x00000010", file size: "0x00000012"
2018524       0x1ECCDC        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/ipsec", file name length: "0x0000000B", file size: "0x00000000"
2018648       0x1ECD58        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libm.so.0", file name length: "0x0000000F", file size: "0x0000000F"
2018792       0x1ECDE8        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/ld-uClibc-0.9.28.so", file name length: "0x00000019", file size: "0x00006790"
2045440       0x1F3600        ASCII cpio archive (SVR4 with no CRC), file name: "/lib/libnvram.so", file name length: "0x00000011", file size: "0x00000013"
2045588       0x1F3694        ASCII cpio archive (SVR4 with no CRC), file name: "/tmp", file name length: "0x00000005", file size: "0x00000000"
2045704       0x1F3708        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro", file name length: "0x00000008", file size: "0x00000000"
2045824       0x1F3780        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/web", file name length: "0x0000000C", file size: "0x00000000"
2045948       0x1F37FC        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/Wireless", file name length: "0x00000011", file size: "0x00000000"
2046076       0x1F387C        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/Wireless/RT2860AP", file name length: "0x0000001A", file size: "0x00000000"
2046212       0x1F3904        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/Wireless/RT2860AP/RT2860_default_novlan", file name length: "0x00000030", file size: "0x00000C07"
2049452       0x1F45AC        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/Wireless/RT2860AP/RT2860_default_vlan", file name length: "0x0000002E", file size: "0x00000B25"
2052464       0x1F5170        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/dhcp6c.conf", file name length: "0x00000014", file size: "0x00000070"
2052708       0x1F5264        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/wlan", file name length: "0x0000000D", file size: "0x00000000"
2052832       0x1F52E0        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/wlan/LEWEIAP_Password.dat", file name length: "0x00000022", file size: "0x00000E1F"
2056592       0x1F6190        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/wlan/RT5350_AP_1T1R_V1_0.bin", file name length: "0x00000025", file size: "0x00000200"
2057252       0x1F6424        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/dhcp6s.conf", file name length: "0x00000014", file size: "0x0000014A"
2057716       0x1F65F4        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/inittab", file name length: "0x00000010", file size: "0x0000002D"
2057892       0x1F66A4        ASCII cpio archive (SVR4 with no CRC), file name: "/etc_ro/rcS", file name length: "0x0000000C", file size: "0x000002C6"
2058728       0x1F69E8        ASCII cpio archive (SVR4 with no CRC), file name: "TRAILER!!!", file name length: "0x0000000B", file size: "0x00000000"
```

Once the firmware was extracted successfully, it didn't take much time to find
the telnet password, using `grep -r -i -a` for `login=` and `pass=`. The
winning combination was username: `tony`, password: `tony4321`, which is an
administrative user.

With this out of the way, my last objective was to figure out a replacement
for the iPhone app; if the app ever stopped working, I wanted to still be able
to view the video stream and change the settings. Check out part 3 for how I
used WireShark to figure this out.

[1]: https://amzn.to/2pXlelm
[2]: https://amzn.to/2GcJw4t
