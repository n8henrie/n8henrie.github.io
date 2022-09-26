---
title: Linux VMs on my M1 Mac
date: 2022-09-24T11:36:54-06:00
author: n8henrie
layout: post
permalink: /2022/09/linux-vms-on-my-m1-mac/
categories:
- tech
excerpt: "Aarch64 VMs are not difficult to get running on an M1 Mac."
tags:
- linux
- Mac OSX
- MacOS
- nix
- Terminal
---
**Bottom Line:** Aarch64 Linux VMs are not difficult to get running on an M1 Mac.
<!--more-->

I ran across an article a few weeks ago which has some detailed instructions
for creating an aarch64 Ubuntu virtual machine on an M1 Mac through
[libvirt][1]. I'll be referring to this article frequently, so you may want to
have it open in another tab: <https://www.naut.ca/blog/2021/12/09/arm64-vm-on-macos-with-libvirt-qemu>

I was able to follow those instructions with minor issues and have since also
installed [kali][kali] and [nixos][nixos] aarch64 images, so I thought I'd make
a brief writeup of my process (which is largely just following the article
linked in the first sentence).

First, I recommend making a place to keep your virtual machine config files
(`~/vms` in my case), and I additionally recommend making a subdirectory to
keep the larger files like the disk images and installation ISOs
(`~/vms/storage`).

Next, use [Homebrew](https://brew.sh/) to install and start some dependencies:

```console
$ brew install qemu libvirt gcc
$ cat <<'EOF' >> /opt/homebrew/etc/libvirt/qemu.conf
security_driver = "none"
dynamic_ownership = 0
remember_owner = 0
EOF
$ brew services start libvirt
```

I am not sure why `gcc` is required here, but it seems to be suggested on a few
instructional posts I've seen. I already had it installed for unrelated
reasons; if anybody tries without `gcc` please let me know whether or not it
works.

Next, I would recommend excluding `~/vms/storage` from your Time Machine backup
directories, as these are large files that will change frequently in ways that
I don't expect Time Machine to handle well; the ability to exclude the whole
folder is why I put them into a subdirectory. `System Preferences` -> `Time
Machine` -> `Options`. (I also exclude from restic: `touch
~/.vms/storage/.norestic`.)

Next, download your aarch64 installation ISO and put it in `~/vms/storage/`:

- Ubuntu 22.04: <https://cdimage.ubuntu.com/releases/22.04/release/ubuntu-22.04.1-live-server-arm64.iso>
- Kali 2022.3: <https://cdimage.kali.org/kali-2022.3/kali-linux-2022.3-live-arm64.iso>
- NixOS 22.05: <https://hydra.nixos.org/build/191936160/download/1/nixos-minimal-22.05.3210.4e10ae831a9-aarch64-linux.iso>

You'll also need to create a `.qcow2` image file that will act as your "hard
drive" for the VM (you'll use the installer ISO to install to this "drive"),
using a 50 Gb drive and `nixos.qcow2` for example:

```console
$ qemu-img create -f qcow2 ~/vms/storage/nixos.qcow2 50g
```

Once that's done, you'll need to create an XML config for each VM. Below is the
template I use, again copied from the link in the first sentence, with a few
minor modifications:

- Replace `NAMEHERE` and `UUIDHERE` with a memorable name and a unique UUID.
    - You can use the built-in `uuidgen` command to generate a UUID.
- Replace `COWFILE` and `ISOFILE` with the absolute paths to the respective
  files
- Change the `passwd` for VNC
    - Note that the built-in MacOS `Screen Sharing` app works great to connect
      via VNC but doesn't seem to be able to connect without a password, which
      was a major point of difficulty during my first attempt
- You may want to change the ports for VNC and SSH

```xml
<domain type='hvf' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
    <name>NAMEHERE</name>
    <uuid>UUIDHERE</uuid>
    <memory unit='GiB'>2</memory>
    <cpu mode='custom' match="exact">
       <model>host</model>
    </cpu>
    <vcpu>2</vcpu>
    <features>
        <gic version='2'/>
    </features>
    <os firmware='efi'>
        <type arch='aarch64' machine='virt'>hvm</type>
    </os>
    <clock offset='localtime'/>
    <devices>
        <emulator>/opt/homebrew/bin/qemu-system-aarch64</emulator>
        <controller type='usb' model='qemu-xhci'/>
        <disk type='file' device='disk'>
            <driver name='qemu' type='qcow2'/>
            <source file='QCOWFILE'/>
            <target dev='vda' bus='virtio'/>
            <boot order='1'/>
        </disk>
        <disk type='file' device='disk'>
            <driver name='qemu' type='raw'/>
            <source file='ISOFILE'/>
            <target dev='vdb' bus='virtio'/>
            <boot order='2'/>
        </disk>
        <console type='pty'>
            <target type='serial'/>
        </console>
        <input type='tablet' bus='usb'/>
        <input type='keyboard' bus='usb'/>
        <graphics type='vnc' port='5900' listen='127.0.0.1' passwd='changeme'/>
        <video>
            <model type='virtio' vram='32768'/>
        </video>
    </devices>
    <seclabel type='none'/>
    <qemu:commandline>
        <qemu:arg value='-machine'/>
        <qemu:arg value='highmem=off'/>
        <qemu:arg value='-netdev'/>
        <qemu:arg value='user,id=n1,hostfwd=tcp::2222-:22'/>
        <qemu:arg value='-device'/>
        <qemu:arg value='virtio-net-pci,netdev=n1,bus=pcie.0,addr=0x19'/>
    </qemu:commandline>
</domain>
```

With this done, one should be able to define and start the VM like so, using
`nixos.xml` and `nixos` as an example config file and `name`:

```console
$ virsh define nixos.xml
$ virsh start nixos
```

From here, to complete the installation, you can connect graphically to VNC
using the built-in `Screen Sharing` app by connecting to
`vnc://:PASSWORD@localhost:5900` through a variety of means:

- Opening the app: `/System/Library/CoreServices/Applications/Screen
  Sharing.app`
- From a Finder window using the keyboard shortcut <kbd>⌘</kbd><kbd>k</kbd>
- Running from a terminal: `open 'vnc://:PASSWORD@localhost:5900'`
- You'll obviously need to use the VNC `PASSWORD` you defined in the config
  file
- For some distros, or after you've gone through installing a distribution and
  creating a user, you may need to use those credentials to connect via VNC:
  `vnc://USERNAME:PASSWORD@localhost:5900`

At this point you're up and running, and you'll need to refer to the
documentation for your specific distro to go through the installaion process; I
was able to get all three working with minimal issues:

- Kali had some trouble with the installer, some error about mounting and CDROM
  that I resolved with some help from StackOverflow:
  <https://superuser.com/questions/962926/cant-install-kali-linux-from-usb-fails-to-find-cd-rom-drive>
- Kali wasn't able to install the default packages; I was able to skip this
  step and later install them with `apt install -y kali-linux-default`
- I had a few issues getting NixOS installed on my usual BTRFS root setup; it
  eventually worked with the default setup using `systemd-boot` and EFI mounted
  at `/boot`

Additionally, if you're as new to `libvirt` as me, you'll want to be familiar
with a few additional commands, such as:

- Using a machine named `x` based on config `y`:`virsh define y.xml`
    - Do this again after making changes to config
- Start / stop the vm: `virsh start x`, `virsh stop x`
- Shutdown the machine: `virsh shutdown x`
    - In most cases I had to specify `virsh shutdown --mode=acpi x`
- Hard reboot (if `virsh reboot --mode=acpi x` isn't working): `virsh reset x`
- `virsh console x`
- Check the status: `virsh list`

[0]: https://www.naut.ca/blog/2021/12/09/arm64-vm-on-macos-with-libvirt-qemu
[1]: https://libvirt.org/
[kali]: https://www.kali.org/
[nixos]: https://nixos.org/
