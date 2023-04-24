---
title: Persistent VMs on pfSense with vm-bhyve
date: 2023-03-16T10:40:20-06:00
author: n8henrie
layout: post
permalink: /2023/03/persistent-vms-on-pfsense-with-vmbhyve/
categories:
- tech
excerpt: "Configure your VMs to start and run automatically on pfSense with vm-bhyve."
tags:
- pfsense
- freebsd
- linux
- nix
---
**Bottom Line:** Configure your VMs to start and run automatically on pfSense
with vm-bhyve.
<!--more-->

If you're trying to get a Linux VM running under bhyve on pfSense, I strongly
recommend that you start with [my first post on the topic][0]. Once you have
things running interactively, it's time to try to get the VM to start and run
automatically.

[vm-bhyve] is designed to help make the process a little easier, and it's
available in the default pfSense repo, which is highly convenient.

First off, it's important to realize that pfSense apparently [does not use
the standard FreeBSD rc init
system](https://forum.netgate.com/topic/158096/what-is-the-pfsense-alternative-for-etc-rc-conf-in-freebsd-is-that-etc-rc-conf-local/2?_=1682355481742&lang=en-US);
I would have saved a lot of time had I realized this earlier, as it means that
the [default FreeBSD instructions on this
topic](https://people.freebsd.org/~blackend/doc/handbook/virtualization-host-bhyve.html#virtualization-bhyve-onboot), which advise adding a number of settings to `/etc/rc.conf`, **won't work**.

Further, at boot time, you *can* automatically run scripts in
`/usr/local/etc/rc.d/`, but they
[must end in `.sh` and be executable](https://docs.netgate.com/pfsense/en/latest/development/boot-commands.html#shell-script-option).

With these two facts in mind, the rest wasn't too difficult. As a reminder, I'm
using `bash` as my shell, and all commands below are being run as root (I'm
using `$` instead of `#` in codeblocks below for better markdown syntax
highlighting.)

You'll probably want to keep [vm-bhyve's GitHub page][vm-bhyve] open to
references its documentation.

1. Install `vm-bhyve` with `pkg install vm-bhyve`
1. Using the web interface, configure pfSense to load the necessary kernel
   modules on boot by adding the following to `/boot/loader.conf` (following
   the [official FreeBSD
   instructions](https://people.freebsd.org/~blackend/doc/handbook/virtualization-host-bhyve.html),
   though I didn't need `nmdm_load`):
```
vmm_load="YES"
if_bridge_load="YES"
if_tap_load="YES"
```
1. Configure pfSense to bring up your TAP interface on boot:
    - `System` -> `Advanced` -> `System Tunables` (`/system_advanced_sysctl.php`)
    - `+ New`
    - Tunable: `net.link.tap.up_on_open`
    - Value: `1`
    - Description: `Open TAP on boot for vm-bhyve`
1. This is probably a good time to reboot, which should load / activate the
    above settings and make sure they are working
1. Symlink `vm-bhyve`'s rc script to something pfSense will run:
```
$ ln -s /usr/local/etc/rc.d/vm /usr/local/etc/rc.d/vm.sh
```
1. Edit `/etc/rc.conf.local` and add `vm-bhyve`'s config. The contents of mine
   are the following lines, yours may vary:
```plaintext
vm_enable="YES"
vm_dir="zfs:pfSense/vm"
vm_list="nixos0"
vm_delay="5"
```
1. You may need to remove the remnants of the zfs virtual drive created in the
   prior post:
```console
$ zfs destroy pfSense/vm/nixos0
```
1. Create and populate vm-bhyve's directory structure: `$ vm init`
1. Copy the UEFI file we downloaded in the last post to a place that `vm-bhyve`
   will look for it:
```console
$ cp BHYVE_UEFI.fd /pfSense/vm/.config/
```
1. Next you need to configure the VM
    1. Start by looking through a few of the samples:
        - <https://github.com/churchers/vm-bhyve/blob/master/sample-templates/default.conf>
        - <https://github.com/churchers/vm-bhyve/blob/master/sample-templates/config.sample>
        - <https://github.com/churchers/vm-bhyve/blob/master/sample-templates/ubuntu.conf>
    1. Next, I downloaded and then edited the default config:
    ```console
    $ curl 'https://raw.githubusercontent.com/churchers/vm-bhyve/master/sample-templates/default.conf'  > /pfSense/vm/.templates/nixos.conf
    $ vim /pfSense/vm/.templates/nixos.conf
    ```

    My config ultimately ended up looking like this:
    ```plaintext
    loader="uefi-custom"
    cpu=1
    memory=1024M
    network0_type="virtio-net"
    network0_switch="public"
    disk0_type="virtio-blk"
    disk0_dev="sparse-zvol"
    disk0_name="nixos0"
    disk0_size="16G"
    graphics="no"
    ```

4. I had trouble with the vm-bhyve console until I configured it to run in
   tmux; if you're not a tmux user maybe skip this: `$ vm set console="tmux"`
5. Create a "manually" managed switch (since we've configured it in pfSense in
   the prior post, and pfSense will manage it)
```console
$ vm switch create -t manual -b bridge0 public
```
1. Create a VM named `nixos0` based on your customized `nixos` template:
```console
$ vm create -t nixos nixos0
```
3. Tell `vm-bhyve` to download the installer ISO:
```console
$ vm iso https://releases.nixos.org/nixos/22.11/nixos-22.11.2979.47c00341629/nixos-minimal-22.11.2979.47c00341629-x86_64-linux.iso
```
1. Install in the foreground using your currently active terminal session. Note
   that immediately after running this command I had to hold down the down
   arrow key and *keep tapping it* for 15 seconds or so, during which the
   entire SSH session seemed be frozen. Afterwards, it comes up with the option
   to go into `Accessibility` and redirect its output to the serial console,
   just like in the last post.
```console
$ vm install -f nixos0 nixos-minimal-22.11.2979.47c00341629-x86_64-linux.iso
```
1. At this point, you should be able to get a shell, `sudo su` to elevate,
   `systemctl start sshd`, `passwd` to set a root password, `ip addr` to get
   your IP address, and you're off to the races! (Don't forget to add
   `boot.kernelParams = [ "console=ttyS0" ];` if using NixOS, and you'll need
   SSH access configured so you can access the machine once it's booting in the
   background)
1. Once you've completed your installation, see if your VM comes up (make sure
   to give it a minute):
```console
$ vm poweroff nixos0
$ vm start -f nixos0
```
1. If that works, try SSH access. If that also works, try rebooting pfSense --
   your VM should automatically start in the background a few seconds after
   bootup is complete, at which point you should be able to connect via SSH
   (check your pfSense logs for the IP address, for which you might want to add
   a DHCP reservation at this point).
1. If you've made it to this point, everything seems to be working.
   Congratulations! All that's left is to make a snapshot of your working VM,
   which I suppose you should be able to `zfs send` to another machine, or to
   which you can roll back if something goes wrong in the future:

```console
$ vm stop nixos0
$ vm snapshot nixos0@booting
$ vm info nixos0
vm info nixos0
------------------------
Virtual Machine: nixos0
------------------------
  state: stopped
  datastore: default
  loader: uefi-custom
  uuid: 0b49b710-e2ce-11ed-b922-00e0672a504a
  uefi: default
  cpu: 1
  memory: 1024M

  network-interface
    number: 0
    emulation: virtio-net
    virtual-switch: public
    fixed-mac-address: 58:9c:fc:03:dc:eb
    fixed-device: -

  virtual-disk
    number: 0
    device-type: sparse-zvol
    emulation: virtio-blk
    options: -
    system-path: /dev/zvol/pfSense/vm/nixos0/nixos0
    bytes-size: 17179869184 (16.000G)
    bytes-used: 1650454528 (1.537G)

  snapshots
    pfSense/vm/nixos0@booting	0	Mon Apr 24 15:25 2023
    pfSense/vm/nixos0/nixos0@booting	0	Mon Apr 24 15:25 2023
```

I hope you've found this useful -- I still have a lot to learn, so if you see
any major missteps or recommendations for improvement please let me know in the
comments.

[0]: /2023/03/running-nixos-and-ubuntu-vms-on-pfsense-via-bhyve/
[vm-bhyve]: https://github.com/churchers/vm-bhyve
