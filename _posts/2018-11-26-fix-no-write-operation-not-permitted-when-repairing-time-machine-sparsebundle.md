---
title: Fix "NO WRITE" "Operation not permitted" when repairing Time Machine sparsebundle
date: 2018-11-26T16:46:09-07:00
author: n8henrie
layout: post
permalink: /2018/11/fix-no-write-operation-not-permitted-when-repairing-time-machine-sparsebundle/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- bugfix
- Mac OSX
- Terminal
---
**Bottom Line:** If you're getting a `NO WRITE` error on MacOS Mojave when trying to repair a
Time Machine sparsebundle, try adding `/sbin/fsck_hfs` to Full Disk Access.
<!--more-->

My Time Machine backup goes to a hard drive connected to my Airport Extreme.

Unfortunately, it's somewhat common to occasionally get an error messages that
goes something like: `Time Machine completed a verification of your backups on`
... `Time Machine must create a new backup for you`.

The fix for this is posted on numerous blogs, so when I occasionally get this
error, I usually just Google the message and follow the instructions.

However, yesterday I tried to run the commands and kept running into an error
when you get to the part about using `fsck_hfs` to actually *fix* the problem.

The error I kept getting was:

```console
$ sudo /sbin/fsck_hfs -drfy -c 2200m /dev/rdisk2s2
Unable to open block device /dev/disk2s2: Operation not permittedjournal_replay(/dev/disk2s2) returned 1
** /dev/rdisk2s2 (NO WRITE)
Can't open /dev/rdisk2s2: Operation not permitted
```

I searched around and couldn't find anything on this except to use `sudo
diskutil repairVolume /dev/disk2s2` instead of `fsck_hfs` -- which seemed to
work, but also seemed *agonizingly* ~50% in 12 hours, over a wired connection).

Luckily, I'd recently been doing some digging around with the new [`Full Disk
Access`](https://n8henrie.com/2018/11/how-to-give-full-disk-access-to-a-binary-in-macos-mojave/)
permissions in Mojave, so I thought I'd see if that was related.

Sure enough, once I added `/sbin/fsck_hfs` to `System Preferences` -> `Security
& Privacy` -> `Full Disk Access`, I could run the `fsck` command.

Unfortunately, it looks like my drive is probably failing. Good thing it's
Cyber Monday, I guess.
