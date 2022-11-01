---
title: Guix System (GuixSD) VM on an M1 Mac
date: 2022-10-24T09:33:08-06:00
author: n8henrie
layout: post
permalink: /2022/10/guix-system-guixsd-vm-on-an-m1-mac/
categories:
- tech
excerpt: "I got an aarch64 Guix System VM running on my M1 Mac."
tags:
- linux
- MacOS
- nix
- tech
---
**Bottom Line:** I got an aarch64 Guix System VM running on my M1 Mac.
<!--more-->
While learning about nix I've also been curious about [Guix][0]. It shares the
declarative approach and goals of reproducibility in a package manager (which
can reportedly be installed on *any* Linux system) and like NixOS also provides
its own linux distribution, called Guix System (previosly called GuixSD).

The Guix team provides an ISO installer as well as a VM image at
<https://guix.gnu.org/en/download/>. Unfortunately, at the time of writing,
there is no aarch64 installer or VM image ready for download. In addition, from
what I understand Guix will not run natively on a Mac (I tried using the
aarch64 binary they provide for download). However, with a little [help from
Reddit](https://www.reddit.com/r/GUIX/comments/y2af5b/no_aarch64_vm_image/) I
was able to get things running.

Unless you already have aarch64 Linux VMs running on your M1 Mac, I
**strongly** recommend pausing to read through my [prior article on the
topic][1] before continuing on.

I started with an aarch64 Ubuntu VM (as set up in [my prior post][1]) and had
no major issues [installing the Guix package
manager](https://guix.gnu.org/manual/en/html_node/Installation.html).

Next, I read through several pages of documentation:

- <https://guix.gnu.org/manual/en/html_node/Building-the-Installation-Image.html>
- <https://guix.gnu.org/manual/en/html_node/Invoking-guix-system.html>
- <https://guix.gnu.org/en/cookbook/en/html_node/Guix-System-Image-API.html>

I found a few official examples that seemed like they might work with the `guix
system image` command:

- <https://git.savannah.gnu.org/cgit/guix.git/tree/gnu/system/examples/vm-image.tmpl>
- <https://git.savannah.gnu.org/cgit/guix.git/tree/gnu/system/vm.scm>

I wanted to see where I could find `vm.scm` locally, so I downloaded it from
the link above, searched for its filename, and compared the md5:

```
$ sudo find /gnu -name 'vm.scm' -exec md5sum {} + | grep $(md5sum vm.scm | awk '{print $1}')
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/a61r3g1jvg8mn4f9pbmcskwny82gic4p-guix-d9c7435/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/g4wypm74nl6qi5an9z57v0i39ibkshz7-guix-729ce5f/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/xp5lyv6zd63a6ar50c8rr92anh24cli9-guix-0dec41f/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/f2l4hy1sixp9d12gddivx8ap75k02yr1-guix-e46bb5f/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/qnfgs950hkdy69v51x88iszfqm2kdikp-guix-1.3.0-29.9e46320/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/hhx4hvmbgiy86a0wr94mb2vyisnn7z64-guix-system-source/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/i8v8m9z2xz90kzf36syi40zkn5x171ml-guix-d3e982d/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/7fah4iizp1fkxdp3hm3w31dvgjzhpm3s-guix-17134b9/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/d2q9i2crjzwclrdrp5j2nsyv39h2s7b9-guix-system-source/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/cps9z7g84zcwn420cwrzqs4xcqgiz9xx-guix-17134b9ec-modules/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/ydyhgnzglb24v2hp9pbbn0w0qmp5iv19-guix-d9c7435f1-modules/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/nz2pwl8lz3pj46i6xnnkj93ilxxknbz5-guix-system-source/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/90ilpay9s10ynz5xklrhf910iq7pn62d-guix-e46bb5fd5-modules/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/0fg2v2w1sqgbnmvxpq3cjk9i21lvgzi1-guix-0dec41f32-modules/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/wn7hca1x9lkvps8q94962ms0yvhc29p1-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/vm.scm
57aa284b7ad7d519f4476b77b02af7e8  /gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/vm.scm
```

As you can see, there were *several* copies of this example VM configuration
pre-installed. Hopefully they have an option to automatically hardlink
duplicates [like nix](https://nixos.wiki/wiki/Storage_optimization)!

Next I picked one and attempted to build it:

```console
$ guix system image \
    --system=aarch64-linux \
    --image-type=uncompressed-iso9660 \
    /gnu/store/i8v8m9z2xz90kzf36syi40zkn5x171ml-guix-d3e982d/gnu/system/vm.scm
guix system: error: '/gnu/store/i8v8m9z2xz90kzf36syi40zkn5x171ml-guix-d3e982d/gnu/system/vm.scm' does not return an operating system or an image
```

Huh, didn't expect that one.

How about `vm-image.tmpl`?

```console
$ md5sum /gnu/store/z8w8km1bzsj5rfchasha4y03yphnl0cs-guix-system-source/gnu/system/examples/vm-image.tmpl
59b076b031d60d9aba0716938c5daf42  /gnu/store/z8w8km1bzsj5rfchasha4y03yphnl0cs-guix-system-source/gnu/system/examples/vm-image.tmpl
$ guix system image \
    --system=aarch64-linux \
    --image-type=qcow2 \
    /gnu/store/z8w8km1bzsj5rfchasha4y03yphnl0cs-guix-system-source/gnu/system/examples/vm-image.tmpl
```

This was giving me an error about failing the tests for `libnice`. It doesn't
look like `guix system image` recognizes the `--without-tests` flag, but I
wanted to see if skipping the tests would be sufficient, and the below
succeeded:

```console
$ guix build libnice --without-tests=libnice
```

And then tried again to build `vm-image.tmpl`, hoping it would use the
(cached?) `libnice` that I had just successfully built... but it again failed
to build `libnice`.

Then I tried with `--skip-checks`, which proceeds until
`xf86-video-intel-2.99.917-18.31486f4.drv` errors out with `checking
which acceleration method to use by default... configure: error: UXA requested
as default, but is not enabled`.

Since that wasn't working, I thought I'd try `lightweight-desktop.tmpl`, hoping
I'd have more luck with a less complex image. Unfortunately, it failed with the
same error about `libnice`, even with the `--skip-checks`. Huh.

(NB: Since drafting this post, instead of `libnice` I'm now getting a different
build failure, `umockdev`, reflected in the error below.)

```console
$ guix system image \
        --system=aarch64-linux \
        --image-type=qcow2 \
        --skip-checks \
        /gnu/store/fgplja88ndi9mh8wy86vl1sakx3zll4x-guix-1.3.0-32.682639c-checkout/gnu/system/examples/lightweight-desktop.tmpl
...
build of /gnu/store/ca9draiafh0w51a5n34fc87lzrgcaa0r-umockdev-0.17.13.drv failed
View build log at '/var/log/guix/drvs/ca/9draiafh0w51a5n34fc87lzrgcaa0r-umockdev-0.17.13.drv.gz'.
cannot build derivation `/gnu/store/30zdxxmg5s8781bvabcwhzy7n8cqvmps-upower-1.90.0.drv': 1 dependencies couldn't be built
guix system: error: build of `/gnu/store/30zdxxmg5s8781bvabcwhzy7n8cqvmps-upower-1.90.0.drv' failed
```

¯\\\_(ツ)_/¯

At this point I took a closer look at `vm-image.tmpl` vs
`lightweight-desktop.tmpl`, `bare-bones.tmpl`, and a few others, and they
actually seemed reasonably intelligible. As I don't really need a GUI at this
point, I decided to try `bare-bones.tmpl`. Unfortunately, it resulted in a file
not found error regarding `grub/i386-pc/moddep.lst` with both `qcow2` and
`efi-raw` image types. However, I tried with `uncompressed-iso9660` and it
successfully built an image -- huzzah, my first win!

```console
$ guix system image \
    --system=aarch64-linux \
    --image-type=uncompressed-iso9660 \
    /gnu/store/i8v8m9z2xz90kzf36syi40zkn5x171ml-guix-d3e982d/gnu/system/examples/bare-bones.tmpl
/gnu/store/782h7min991hjrn8m0infrx50ix0d1m1-image.iso
```

From there I was able to `scp` the image back to my Macbook host and there
convert it to `qcow2` format and resize it:

```console
$ qemu-img convert -f raw -O qcow2 782h7min991hjrn8m0infrx50ix0d1m1-image.iso guix.qcow2
$ qemu-img resize -f qcow2 guix.qcow2 50G
Image resized.
```

I then used the process described in [my other post][1] and was able to boot an
aarch64 Guix VM on my M1 Macbook and establish an SSH connection (after I
realized that `bare-bones.tmpl` had preconfigured an alternate SSH port, 2222).
Phew!

Next I tried to build the installer image -- I had actually built it once
before without much trouble (which inspired this post), and I was surprised to
see it now gave me an error:


```
$ guix system image --system=aarch64-linux --image-type=uncompressed-iso9660 /gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/install.scm
;;; compiling /gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl.go
;;; compiling /gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl.go
;;; compiling /gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/h76ijfhhjv2123mgssc5zn3g33s0l15i-guix-1.3.0-31.3170843/share/guile/site/3.0/gnu/system/examples/bare-bones.tmpl.go
Updating channel 'guix' from Git repository at 'https://git.savannah.gnu.org/git/guix.git'...
Computing Guix derivation for 'aarch64-linux'... |
substitute: updating substitutes from 'https://ci.guix.gnu.org'... 100.0%
substitute: updating substitutes from 'https://bordeaux.guix.gnu.org'... 100.0%
The following derivation will be built:
  /gnu/store/k8rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv

building /gnu/store/k8rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv...
builder for `/gnu/store/k8rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv' failed with exit code 1
build of /gnu/store/k8rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv failed
View build log at '/var/log/guix/drvs/k8/rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv.gz'.
guix system: error: build of `/gnu/store/k8rl88q6rqfhc381xhzwknrffnj77ixv-image.iso.drv' failed
```

I was confused at why it would now fail whereas it previously succeeded. I
wondered if it could be due to a change in the guix channel (what else could it
be?) and tried my first roll-back, followed by the same build command again:

```console
$ guix pull --list-generations
Generation 1 Oct 01 2022 05:55:27
  guix 0dec41f
    repository URL: https://git.savannah.gnu.org/git/guix.git
    branch: master
    commit: 0dec41f329c37a4293a2a8326f1fe7d9318ec455
Generation 2 Oct 12 2022 01:54:15
  guix e46bb5f
    repository URL: https://git.savannah.gnu.org/git/guix.git
    branch: master
    commit: e46bb5fd5af3adb931e0930326c60a7c2e4cbe4e
Generation 3 Oct 26 2022 21:10:26 (current)
  guix c07b55e
    repository URL: https://git.savannah.gnu.org/git/guix.git
    branch: master
    commit: c07b55eb94f8cfa9d0f56cfd97a16f2f7d842652
$ guix pull --roll-back
$ guix system image \
    --system=aarch64-linux \
    --image-type=uncompressed-iso9660 \
    /gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/install.scm
;;; compiling /gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl.go
;;; compiling /gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl.go
;;; compiling /gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl
;;; compiled /home/n8henrie/.cache/guile/ccache/3.0-LE-8-4.6/gnu/store/vfcrq67ylxv0iz4g50d5gi53s8hvca1s-guix-1.3.0-31.3170843-checkout/gnu/system/examples/bare-bones.tmpl.go
Updating channel 'guix' from Git repository at 'https://git.savannah.gnu.org/git/guix.git'...
Computing Guix derivation for 'aarch64-linux'... /
/gnu/store/3ffh297x66yrximn45vc099sv5857plm-image.iso
```

Cool, I was able to build the installer! (As a side note, I was eventually able
to create a separate, blank `qcow2` image, write a libvirt configuration in
which both the blank image *and* the installer image were mounted, and use the
installer to install a working system onto the blank image -- but I'll leave
this process as an exercise for the reader. I found the installer to be
surprisingly user-friendly -- good job Guix team!)

Finally, I tried my hand at making some modifications of `bare-bones.tmpl` as
the rudiments of my own, custom Guix system. After a modest amount of tinkering
and some help from the very nice people on the [Guix IRC][2], I came up with an
image that:

- uses efi booting
- imports my SSH public key from GitHub and authorizes it for SSH
- has vim and tmux available

The config is below; I formatted it *in my Guix vm* by using `scp` to copy it
as `guix.scm` and running `guix style -f guix.scm` on it. If any Guix veterans
have feedback or recommendations, please let me know! Like the others, I was
able to build it from my Ubuntu VM, `scp` it back to my M1 MacBook host, and
run it with `libvirt` without issues.

```scheme
(use-modules (gnu)
             (guix)
             (guix download))
(use-service-modules networking ssh)
(use-package-modules certs
                     screen
                     ssh
                     tmux
                     vim
                     wget)

(operating-system
  (host-name "guixvm")
  (timezone "America/Denver")
  (locale "en_US.utf8")

  (bootloader (bootloader-configuration
                (bootloader grub-efi-bootloader)
                (targets '("/boot/efi"))
                (terminal-outputs '(console))))

  (file-systems (cons (file-system
                        (mount-point "/")
                        (device "/dev/vda1")
                        (type "ext4")) %base-file-systems))

  (users (cons (user-account
                 (name "n8henrie")
                 ;; https://www.gnu.org/software/libc/manual/html_node/Passphrase-Storage.html#Passphrase-Storage
                 (password (crypt "changeme" "$6$fakesalt"))
                 (group "users")
                 (supplementary-groups '("wheel" "audio" "video")))
               %base-user-accounts))

  (sudoers-file (plain-file "sudoers"
                            "root ALL=(ALL) ALL\n%wheel ALL=NOPASSWD: ALL\n"))

  (packages (append (list tmux nss-certs vim wget) %base-packages))

  (services
   (append (list (service dhcp-client-service-type)
                 (service openssh-service-type
                          (openssh-configuration (openssh openssh-sans-x)
                                                 (password-authentication? #f)
                                                 (port-number 22)
                                                 (authorized-keys `(("n8henrie" ,(origin

                                                                                   (method
                                                                                    url-fetch)

                                                                                   (uri
                                                                                    "https://github.com/n8henrie.keys")

                                                                                   (sha256
                                                                                    (base32
                                                                                     "1zhq1r83v6sbrlv1zh44ja70kwqjifkqyj1c258lki2dixqfnjk7")))))))))
           %base-services))
  (name-service-switch %mdns-host-lookup-nss))
```

I hope this is helpful, I've been interested in checking out Guix for a while,
and since my Macbook is my primary machine, I think this will make it much
easier to experiment before I decide whether Guix or NixOS is a better fit for
me.

## Troubleshooting

### Expanding the partition and filesystem

The default image has a very small root partition, because it's a small image.
The `qemu-img` commands above will resize the image, but the underlying
partition and filesystem will still be small. To expand the partition and
filesystem, after running the `qemu-img` commands from above, one easy way is
to use `sfdisk`, reboot, then `resize2fs`.

```console
$ echo ',+,' | sudo sfdisk --force -N2 /dev/vda # Expand partition 2 to the
remainder of disk size
$ sudo reboot # reboot to recognize the new partition size; could also use
partprobe if installed
$ sudo resize2fs /dev/vda2 # after reboot, expand the filesysystem to match partition size
```

As noted, you might also be able to use something like `guix shell parted --
sudo partprobe` instead of rebooting, but I haven't confirmed.

### DNS resolution not working

At one point I was unable to perform DNS resolution for some reason, so I had
to run:

```console
$ sudo dhclient -v eth0
```

### Unable to build images that seemed to work above

If things won't build for you but seemed to be working for me, you might
consider resetting guix to the specific commit of guix that I was using:

```console
$ guix describe
  guix 682639c
    repository URL: https://git.savannah.gnu.org/git/guix.git
    branch: master
    commit: 682639c107908426fe6bf0a1b8404b98b7820290
```

I *think* that can be done with: `guix pull
--commit=682639c107908426fe6bf0a1b8404b98b7820290`

Good luck with Guix!

[0]: https://guix.gnu.org/
[1]: /2022/09/linux-vms-on-my-m1-mac/
[2]: https://guix.gnu.org/en/contact/irc/
