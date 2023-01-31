---
title: Quickly add FreeBSD Packages to pfSense
date: 2023-01-31T11:19:22-07:00
author: n8henrie
layout: post
permalink: /2023/01/quickly-add-freebsd-packages-to-pfsense/
categories:
- tech
excerpt: "I wrote a bash function to add packages directly from FreeBSD to pfSense."
tags:
- tech
- terminal
- pfsense
- freebsd
- bash
---
**Bottom Line:** I wrote a bash function to add packages directly from FreeBSD
to pfSense.
<!--more-->

Disclaimer: Modifying your firewall is a security risk. Please don't use the
information on this page unless you know what you are doing and are willing to
accept the consequences for yourself and anyone on your network.

I've been happily using pfSense for a year or so now. I am getting more

comfortable with Linux over time but know very little about FreeBSD, on which
pfSense is based.

As I explore pfSnse, I occasionally want to add a package from the main FreeBSD
repos. Netgate provides instructions on how to add the FreeBSD repos at
<https://docs.netgate.com/pfsense/en/latest/recipes/freebsd-pkg-repo.html>;
essentially you change `FreeBSD: { enabled: yes }` in
`/usr/local/etc/pkg/repos/FreeBSD.conf` and `/usr/local/etc/pkg/repos/pfSense.conf`.

However, changing this messes with your whole `pkg` database (ask how I know)
and they have a very visible warning that this is generally **not** a good
idea.

They also list another way to install a specific package:

```console
$ pkg add http://pkg.freebsd.org/FreeBSD:11:amd64/latest/All/tshark-3.2.6.txz
```

This looks much better to me, but unfortunately it's pretty difficult (or was
for me anyway) to figure out the exact path to a specific package.
Unfortunately, attempting to browse
<https://pkg.freebsd.org/FreeBSD:12:amd64/latest/All> gives me a `403
Forbidden` error, and a directory above that just includes some compressed
directories that aren't really helpful in a web browser.

Thankfuly, the base pfSense install includes a few basic utilities like `curl`
and `jq` that let me piece together the below function:

```bash
install_from_freebsd() {
    pkgname=$1
    base_url='https://pkg.freebsd.org/FreeBSD:12:amd64/latest'
    path=$(
        curl -s "${base_url}/packagesite.txz" |
            tar -xzf- --to-stdout packagesite.yaml |
            jq -r --arg pkgname "${pkgname}" \
                'select(.name == $pkgname) | .path'
    )
    pkg add "${base_url}/${path}"
}
```

Once you've entered `bash` and defined / sourced the function, it works like
a charm:

```console
$ bash
$ install_from_freebsd tshark
```

Once I verified it was working, I went ahead and put it in `~/.bashrc` so it
would be available automatically in `bash`.
