---
title: Running NixOS and Ubuntu VMs on pfSense via bhyve
date: 2023-03-07T10:03:24-07:00
author: n8henrie
layout: post
permalink: /2023/03/running-nixos-and-ubuntu-vms-on-pfsense-via-bhyve/
categories:
- tech
excerpt: "With some effort, I got VMs running on my pfSense router/firewall."
tags:
- pfsense
- freebsd
- linux
- nix
---
**Bottom Line:** With some effort, I got VMs running on my pfSense
router/firewall.
<!--more-->

## Preface

Being a hobbyist without much experience in networking, this project took me a
fair amount of effort over a period of weeks. It is mostly proof-of-concept,
and I think there are good reasons *not* to use your firewall to host virtual
machines. I'm sure this could impair performanc or even compromise the security
and integrity of your network. If you decide to give this a shot, *caveat
emptor*! If you have recommendations for improving the process, please let me
know in the comments.

NB: I'm booting the VM via UEFI and using ZFS for storage, so you may need to
make adjustments if this is incompatible with your setup.

**Spoiler alert:** You might want to scroll down and read the [`Fixing
DNS`](#Fixing DNS) part *first*, since it requires changing a setting that
requires a reboot, and you basically have to start from scratch after a reboot.

## Introduction

I started using pfSense firewalls a year or so ago, and I've been overall very
happy with them. I put one on a [pre-built device from Amazon][0] that ran a
couple hundred dollars, and after warming up to the configuration and a few
power-user options, I bought a used Lenovo M93P for $80 US, designed and
printed a [custom bracket for a few SSDs][1], and installed pfSense on a
mirrored ZFS root there as well. My internet speeds went from ~300 mbps (I
always forget whether that's supposed to be capitalized or not) with the
commercial router I'd been using to a full 1 gbps with the cheaper used
hardware setup, which was fantastic! I also have unbound doing local DNS
resolution for performance and privacy, pfblocker-ng for network-wide
adblocking and improved security, tailscale and wireguard, automatic config
backups, bandwidthd, iperf... lots of great stuff.

My only beef with pfSense is that I don't know FreeBSD as well as I do Linux,
so when I want to do something simple like set up a little python service, I'm
kind of lost. Because pfSense is somewhat locked down (for security purposes),
it's harder than plain FreeBSD to [install freely available FreeBSD
packages][2].

After a year or so of stable performance and no major issues, and having heard
good things about the bhyve hypervisor, I thought I would try my hand at
installing a Linux VM, which would hopefully let me use my Linux knowledge
while still getting the benefits of the pfSense host.

This article will mostly be me trying to adapt the instructions from
<https://people.freebsd.org/~blackend/doc/handbook/virtualization-host-bhyve.html>,
which are for FreeBSD but not necessarily pfSense, and troubleshooting issues I
found along the way.

## Preparation

First of all, there are a few general notes and debugging steps I used along
the way that might have saved me a lot of time and effort had I adhered to them
from the beginning:

- If you see it below, `192.168.0.2` is my pfSense router's LAN address. It's
  running a DHCP server and local DNS resolution via unbound.
- pfSense's firewall filters and rules **do not** like it when you change
  things from the CLI. When it seems like something isn't working that was
  *just working a minute ago*, especially after a reboot, go back to the
  interfaces page at `/interfaces_assign.php`, click each interface in question
  as if to edit its configuration, change nothing, then click `Save`. Then do
  the same for the bridge at `/interfaces_bridge.php`. Then do the same for
  each relevant firewall rule at `/firewall_rules.php`. Then go to `Status` ->
  `Filter Reload` (`/status_filter_reload.php`) and reload the firewall.
  Several times this process got things working; I think it helps things
  re-sync after you change things from the command line.
- Anywhere possible, use `tmux` sessions to which you can reconnect (`tmux
  -a`), since you may end up interrupting your SSH connection repeatedly with
  all the firewall flushes and rule changes.
    - pfSense: `pkg install tmux`
    - Ubuntu server: pre-installed
    - NixOS: `nix-shell -p tmux`
        - You'll first need to get an IP address and possible need to specify
          an alternative DNS server by adding e.g. `nameserver 1.1.1.1` to
          `/etc/resolv.conf`
- In Ubuntu, don't forget to disable and flush the firewall when
  troubleshooting:
    - `ufw disable; iptables -F`
- When in doubt, use `tcpdump` (preinstalled on pfSense and Ubuntu, `nix-shell
  -p tcpdump`) on the host and guest to determine if packets are being sent and
  received as expected. A few useful flags:
    - `-i enp0s2`: only look at interface `enp0s2`
    - `-XXvv`: greatly increase verbosity and show the text content of the
      packet
    - `host 192.168.0.2 and udp`: only packets that *involve* `192.168.0.2` and
      are udp
    - `src 192.168.0.2 and udp`: only packets that are *from* `192.168.0.2` and
      are udp
    - `ether host 00:a0:98:c9:2a:33`: filter by mac address

Without further delay, starting in the pfSense CLI:

1. Follow the [FreeBSD.org instructions][3] to ensure your CPU is compatible
   and the prior bios settings are enabled. My [pre-built device][0] was ready
   to rock, but my Lenovo device did not have the approach bios settings. If
   the below `awk` script prints `OK` you should be set.
```console
$ awk < /var/run/dmesg.boot '
    /Features2.*POPCNT/ { popcnt=1 }
    /VT-x.*EPT.*UG/ { vtx=1 }
    /VT-x.*UG.*EPT/ { vtx=1 }
    popcnt && vtx { print "OK"; exit }
    '
```
1. Ensure bhyve is installed: `bhyve --help`
1. Follow the [freebsd.org instructions][3] to:
    1. Load the kernel module: `kldload vmm`
    1. Create a TAP device for your VM: `ifconfig tap0 create`
    1. Enable the TAP device: `sysctl net.link.tap.up_on_open=1`
    1. Stop here and skip to `Creating a FreeBSD Guest`. Specifically, do *not*
       create the bridge or do any bridge steps from the CLI.
    1. Create a dataset for VMs and a 16gb zvol inside that for this VM's
       storage disk, named `nixos0` in this case:
```console
$ zfs create pfSense/vm
$ zfs create -V16G -o volmode=dev pfSense/vm/nixos0
```
    1. Because -- for the moment -- these have to be repeated (once) after
       every reboot, I saved these in a script named `prepare.sh`:

    ```bash
    #!/usr/bin/env bash

    main() {
        kldload vmm
        ifconfig tap0 create
        sysctl net.link.tap.up_on_open=1
    }
    main "$@"
    ```

1. Download the ISO image for your distro of choice:
    - Ubuntu Server:
      <https://releases.ubuntu.com/22.04.2/ubuntu-22.04.2-live-server-amd64.iso>
    - NixOS minimal:
      <https://releases.nixos.org/nixos/22.11/nixos-22.11.2979.47c00341629/nixos-minimal-22.11.2979.47c00341629-x86_64-linux.iso>
    - My commands below might have a slightly different version number,
      reflecting the time elapsed between downloading them and writing this
    - Because pfSense doesn't have `wget`, I used `curl 'https://...' >
      image.iso` to download the images, but it looks like I could have used
      `fetch 'https://...'` instead
1. Preparing for UEFI booting was a little tricky, because pfSense doesn't
   include `edk2-bhyve` in its repos. We need this to get a copy of
   `BHYVE_UEFI.fd`, which is required for UEFI booting. This was the
   inspiration for [my recent post on installing FreeBSD packages on
   pfSense][4]; please refer there for the `install_from_freebsd` function that
   you'll need below.
    1. `install_from_freebsd edk2-bhyve`
    1. Copy the file to a safe place: `cp /usr/local/share/uefi-firmware/BHYVE_UEFI.fd .`
        - FWIW, mine has the sha256
          `7f93ab9fbd196c61b4a9e7040e94647b30d23acae14c2157fb015b223a9c8d5d`
    1. You can now remove `edk2-bhyve`, that's all we needed: `pkg remove
       edk2-bhyve`
1. Using a minimally modified command from [the FreeBSD instructions][3], start
   the installer image in a VM. Because I ran this *many* times, I saved it in
   a script named `run.sh`. You may need to alter the paths to your installer
   ISO, to the `.fd` file, etc.

```bash
#!/usr/bin/env bash

bhyve -A -H -P -D \
    -c 2 \
    -m 1024M \
    -s 0:0,hostbridge \
    -s 1:0,lpc \
    -s 2:0,virtio-net,tap0 \
    -s 3:0,ahci-cd,./nixos-minimal-22.11.1705.b83e7f5a04a-x86_64-linux.iso \
    -s 4:0,virtio-blk,/dev/zvol/pfSense/vm/nixos0 \
    -l com1,stdio \
    -l bootrom,./BHYVE_UEFI.fd \
    nixos0
    # Easily copy and paste these above to switch distros
    # -s 3:0,ahci-cd,./nixos-minimal-22.11.1705.b83e7f5a04a-x86_64-linux.iso \
    # -s 3:0,ahci-cd,./ubuntu-22.04.1-live-server-amd64.iso \
```
1. `./run.sh` and you should see the installer image start booting.
1. I was unable to complete the boot process for either image initially and had
   to take an extra step or two to enable serial output:
    - NixOS:
        1. Hit an uninteresting key a few times (like the down arrow)
        1. When able, arrow down to `HiDPI, Quirks and Accessibility`
        1. From this submenu, choose `Serial console=ttyS0,115200n8`
        1. Continue the boot process
    - Ubuntu has some weird keybindings, so be careful not to mistype:
        1. Arrow to `Try or Install Ubuntu Server`
        1. Hit the letter `e`
        1. Arrow down to the line with `linux`
        1. Hit `ctrl-e` to jump to the end of the line (after `---`)
        1. Add `console=ttyS0`
        1. Hit `ctrl-x` to boot
        1. If you mess up, hit `F2` and try again
        1. Once the boot process is complete and you see `Continue in rich
           mode`, hit `F2` to get a shell
1. Run `ip addr` ands note that you probably don't have an IP address.
1. As an aside, if you need to reboot the VM, I had to run `bhyvectl --destroy
   --vm=nixos0` from pfSense prior to being able to boot the VM a second time.

## Networking

Next we want to give this VM access to the LAN; run the followuping steps from
the pfSense web interface. I'll try to list both the `link name` as well as the
(`/url.php`) for these, since navigating the nested menus can be tough.

For much of this, I was following [this helpful thread][6] on the Netgate
forum.

### Assign `tap0` to an interface

1. `Interfaces` -> `Assignments` (`/interfaces_assign.php`)
1. `Available network ports:` -> `tap0` -> `Add`
1. Click the new interface to edit its configuration (`/interfaces.php?if=opt1`, mine was automatically named `OPT1`)
1. Check the box to `Enable interface`
1. Change description to `TAP0`
1. Leave remaining defaults, `Save`, `Apply Changes`

### Create a bridge with `LAN` and `TAP0`

1. `Interfaces` -> `Assignments` -> `Bridges` (`/interfaces_bridge.php`)
1. `Add`
1. Select both `LAN` and `TAP0`
1. `Save`

### Create an "allow all" firewall rule

1. `Firewall` -> `Rules` -> `TAP0` (`/firewall_rules.php?if=opt1`, not sure why
   the URL doesn't update with the new name)
1. `Add`
    1. `Interface` -> `TAP0`
    1. `Address Family` -> `IPv4+IPv6`
    1. `Protocol` -> `Any`
    1. `Save` and `Apply`

### Test DHCP

1. Return to your VM and see if you can get an IP address:
    - Ubuntu: `dhclient -v enp0s2`
    - NixOS: `sudo systemctl restart dhcpcd`
1. Hopefully `ip addr` now shows an IP address on your LAN!
1. From here, I found it *much* easier to SSH directly to the VM guest
    - Ubuntu
        1. set a password for `root` with `passwd`
        1. enable SSH password authentication for root by changing
           `PermitRootLogin` to `yes` in `/etc/ssh/sshd_config`
        1. `systemctl restart ssh` to pick up the new settings
        1. From your main workstation `ssh root@your_guest_ip_address`
    - NixOS
        1. set a password for `root`: `sudo passwd root`
        1. From your main workstation `ssh root@your_guest_ip_address`

### <a name="Fixing DNS"/>Fixing DNS

At this point, I found that I could:

- get an IP address via DHCP (in the LAN subnet)
- ping both internal and external hosts by IP address, including the host
  pfsense machine at 192.168.0.2
- send and receive TCP and UDP data with netcat to both internal and external
  hosts
- resolve DNS using an external DNS resolver (e.g. `host n8henrie.com 1.1.1.1`)

However, for some bizarre reason, I couldn't use my local DNS from the pfSense
host:

```console
$ host -4 n8henrie.com 192.168.0.2
;; connection timed out; no servers could be reached
```

I didn't see any relevant blocked packets in `/var/log/filter.log` (or in the
GUI), and the weirdest part was that I could *see* the responses -- including
the properly resolved IP address:

- First, in the VM guest, start requesting DNS resolution for `n8henrie.com`
  every second with a 1 second timeout: `watch host -W1 -4 n8henrie.com 192.168.0.2`
- CLI (from pfSense): `tcpdump -i tap0 src vm_ip_address and udp`, note
  requests to resolve `n8henrie.com`
- GUI: `Firewall` -> `pfblockerng` -> `Reports` -> `DNS Reply`
  (`/pfblockerng/pfblockerng_alerts.php?view=reply`), note propertly resolved
  requests to `n8henrie.com`

Even more strange was that I could see the DNS reply *in the VM as well*:
1. Open 2 panes in tmux
2. Pane 1: `watch host -W1 -4 n8henrie.com 192.168.0.2`
3. Pane 2:
```console
root@ubuntu-server:/# tcpdump -vv -i enp0s2 host 192.168.0.2 and udp
11:46:49.569313 IP (tos 0x0, ttl 64, id 34767, offset 0, flags [none], proto UDP (17), length 58)
    192.168.0.202.44462 > 192.168.0.2.domain: [udp sum ok] 59526+ A? n8henrie.com. (30)
11:46:49.576273 IP (tos 0x0, ttl 64, id 30262, offset 0, flags [none], proto UDP (17), length 90)
    192.168.0.2.domain > 192.168.0.202.44462: [bad udp cksum 0x8274 -> 0x871c!] 59526 q: A? n8henrie.com. 2/0/0 n8henrie.com. A 104.21.37.209, n8henrie.com. A 172.67.213.115 (62)
```

I got stuck here for over a week and just *could not* figure out why DNS
resolution was fine from a remote DNS server but not my VM host, with the same
behavior in both NixOS and Ubuntu. I tried asking on [r/PFSENSE][7],
[StackExchange][8], and the Netgate forums (the last of which I eventually
deleted with zero responses in a week or so).

Finally, this morning I took a closer look at the `tcpdump` output from the
guest, increasing verbosity with `-XXvv` and comparing it to the response for
an identical request on one of my other machines (which was working fine with
the same DNS server). I noticed a lot of `bad udp cksum` in the VM, where as
the other machine had all `udp sum ok`.

With a bit of searching, I eventually came across [this SO thread][9], which
led me to [this article from wireshark.org][10], and finally I came across
<https://docs.netgate.com/pfsense/en/latest/virtualization/virtio.html>:

> With the current state of VirtIO network drivers in FreeBSD, it is necessary
> to disable hardware checksum offload to reach systems (at least other VM
> guests, possibly others) protected by pfSense software directly from the VM
> host.

Sure enough `System` -> `Advanced` -> `Networking`
(`/system_advanced_network.php`), check to disable `Hardware
Checksum Offloading`, reboot, go through the above steps again, and I was
delighted to see:

```console
[root@nixos:~]# host -4 n8henrie.com 192.168.0.2
Using domain server:
Name: 192.168.0.2
Address: 192.168.0.2#53
Aliases:

n8henrie.com has address 104.21.37.209
n8henrie.com has address 172.67.213.115
n8henrie.com has IPv6 address 2606:4700:3037::6815:25d1
n8henrie.com has IPv6 address 2606:4700:3037::ac43:d573
```

Phew!

From here, you should be able to follow your choice of installation guides,
such as <https://nixos.wiki/wiki/NixOS_Installation_Guide>, to install your VM
into the zvol you created earlier. Don't forget to enable serial output
(`boot.kernelParams = [ "console=ttyS0" ];`) in your configuration prior to
`nixos-install`. After going through the install process, you should be able to
remove from `run.sh` the line referencing the installer ISO, run the `bhyvectl
destroy` step, then run `run.sh` again and you should boot into your installed
system.

In a future post I'll go over using `vm-bhyve` for a friendlier interface as
well as some settings that will persist the VM and configuration across
reboots; as is, you'll have to start from scratch (more or less) after a
reboot.

In the meantime, you almost certainly want to go back and tighten up some
security settings:

- turn off SSH password authentication for `root`
- rethink your life choices because you're running a VM on your firewall
- pick a stronger root password
- add some additional firewall rules

[0]: https://amzn.to/3SSnMOA
[1]: https://www.thingiverse.com/thing:5382521
[2]: /2023/01/quickly-add-freebsd-packages-to-pfsense/
[3]: https://people.freebsd.org/~blackend/doc/handbook/virtualization-host-bhyve.html
[4]: /2023/01/quickly-add-freebsd-packages-to-pfsense/
[5]: https://discourse.nixos.org/t/nixos-vm-under-freebsd-bhyve-failing/24964
[6]: https://forum.netgate.com/topic/76340/100-us-dollars-for-working-bhyve-instructions-on-pfsense-2-2/31
[7]: https://www.reddit.com/r/PFSENSE/comments/11a8t80/comment/j9v828a/?context=3
[8]: https://superuser.com/questions/1771966/pfsense-host-dns-resolver-not-working-in-guest-vm-ubuntu-or-nixos
[9]: https://security.stackexchange.com/questions/227220/tcpdump-packets-have-bad-and-incorrect-checksums-on-localhost-how-to-investigat
[10]: https://wiki.wireshark.org/CaptureSetup/Offloading#Checksum_Offload
[11]: https://docs.netgate.com/pfsense/en/latest/virtualization/virtio.html
