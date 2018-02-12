---
title: Pyenv Size and Python 3.6 Speed and Installation Time on Raspberry Pi
date: 2018-02-09T20:54:01-07:00
author: n8henrie
layout: post
permalink: /2018/02/pyenv-size-and-python-36-speed-installation-time-on-raspberry-pi/
categories:
- tech
excerpt: >
    This post includes sizes and time-to-install Python3 on a Raspberry
    Pi via pyenv."
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- homeautomation
- python
- raspberrypi
---
**Bottom Line:** This post includes sizes and time-to-install Python3 on a
Raspberry Pi via pyenv.
<!--more-->

I like Python 3.6, and I've converted over a few of [my little GitHub
projects](https://github.com/n8henrie/) to require Python >= 3.6 so that I can
leverage features like f-strings, the new type hint syntax, updates to asyncio
(like async generators), and [other new additions to the
language](https://docs.python.org/3/whatsnew/3.6.html).

I run most of my projects on a few Raspberry Pis (including a B+, a 2, a few
3s, and a zero), currently all running Raspbian Stretch Lite. The newest Python
available in Stretch is 3.5.3 at the time of writing, so I use
[pyenv](https://github.com/pyenv/pyenv/) to install 3.6. I generally compile
with `CONFIGURE_OPTS="--enable-optimizations"` to squeeze a little extra speed
out of the Pi if I can, realizing that compiling with optimizations takes quite
a bit longer, but I think it's worth it in the long run (since this is only
once every few months at most).

Recently, I [had an interesting
discussion](https://github.com/n8henrie/fauxmo/issues/44) with another
developer who generously maintains compatibility with older Python versions for
the sake of his users. He was understandably frustrated that one of my
libraries requires a Python version more recent than what is available in the
Raspbian repos. He seemed hesitant to install pyenv on his Pi.

I decided to take a closer look at exactly how much time and space it takes
to install Python3 via Pyenv on a Raspberry Pi.

The script below 
- Shows the latest Python3 version at /usr/bin/python3 and does a simple
  pystone benchmark
- Installs this same Python version via Pyenv and shows the new repo size and
  its pystone benchmark
- Repeats this with the `optimizations` flag I mentioed above
- Repeats this with Python 3.6.4 (most recent release at time of writing) and
  the `optimizations` flag

All of the below is run on a Raspberry Pi 3 (BCM2835) unless noted otherwise.

### Results

For comparison, it looks like the python3 package takes about 68 MB:

```shellsession
$ sudo apt-get --assume-no autoremove python3
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following packages will be REMOVED:
  apparmor dh-python libapparmor-perl libpython3-dev libpython3-stdlib
  libpython3.5-dev python3 python3-cffi-backend python3-crypto
  python3-cryptography python3-dbus python3-dev python3-gi python3-idna
  python3-keyring python3-keyrings.alt python3-minimal python3-pigpio
  python3-pip python3-pkg-resources python3-pyasn1 python3-secretstorage
  python3-setuptools python3-six python3-venv python3-virtualenv python3-wheel
  python3-xdg python3.5
  python3.5-dev python3.5-minimal python3.5-venv ufw virtualenv
0 upgraded, 0 newly installed, 34 to remove and 0 not upgraded.
After this operation, 68.3 MB disk space will be freed.
Do you want to continue? [Y/n] N
Abort.
```

In comparison, pyenv [has some
dependencies](https://github.com/pyenv/pyenv/wiki#suggested-build-environment)
that seem to total about ~13.9 MB. The repo itself is about 4.8 MB, and with
Python 3.5.3 installed it goes up to 169 MB, bringing it up to 183 MB total
space requirement for a pyenv-installed 3.5.3.

```plaintext
make Installed-Size: 1,196 kB
build-essential Installed-Size: 20.5 kB
libssl-dev Installed-Size: 5,135 kB
zlib1g-dev Installed-Size: 393 kB
libbz2-dev Installed-Size: 85.0 kB
libreadline-dev Installed-Size: 473 kB
libsqlite3-dev Installed-Size: 1,702 kB
wget Installed-Size: 2,734 kB
curl Installed-Size: 316 kB
llvm Installed-Size: 62.5 kB
libncurses5-dev Installed-Size: 1,207 kB
xz-utils Installed-Size: 513 kB
tk-dev Installed-Size: 22.5 kB
```

The pystone benchmark for the pyenv-installed 3.5.3 is slightly slower than the
Raspbian repo 3.5.3: **2.1506** vs **2.24193** seconds for 20,000 passes, for a
difference of about **4%**. It took **979 seconds** to install (~16.3 mins).

The optimized 3.5.3, on the other hand, is only about 3 MB heavier and fares
much better at **1.8656 seconds** for 20,000 passes on pystone, about **13%
faster**. The build time, however, is much longer at **36,690 seconds** (about
10 hours).

An optimized 3.6.4 is 2 MB heavier than this (174 MB + 13 MB pyenv deps = 187
MB total) and fares even better against Raspbian's 3.5.3: **2.1506** for 20,000
passes, about **16% improvement**. For some reason, it took about half the time
to build as the optimized 3.5.3 (**16845 seconds**, < 5 hours).

Finally, while not reflected in the script and output below, I did compare
build time and pystone results on my Pi Zero -- for an optimized 3.6.4, it took
about **34815 seconds** (9.6 hours) to build and took **4.71322** for 20,000
passes on pystone (compared to 5.87804 for its Raspbian-installed 3.5.3, nearly
**20% faster**).

So overall, a pyenv-installed, optimized Python build on my Pi 3:

- Adds about 175 MB or so for every Python version
- Requires an overnight build process
- Runs about 15% faster than the Raspbian Python3
- Gives me access to use the latest Python features in my home automation setup

For me, this tradeoff is worthwhile; a 64 GB micro SD card [runs about
$22](http://amzn.to/2Elfprz) as of the time of writing, so that's around 10
cents worth of storage plus an overnight build every few months. For others it
may not be, and that's okay too.

The scripts I used to get this data are included below. I don't claim to be an
expert, so feel free to comment if you think I've gone about this wrong or want
to suggest an improvement or correction.

### Script and Output

```bash
#! /bin/bash

set -euf -o pipefail

test_pystone() {
  local python_path="${1}"
  local opts="$([ -z "${2:-""}" ] && echo "" || echo "with ${2:-""}")"
  local pystone_loops=20000
  local loops=10


  echo "Testing pystone for ${python_path} $($python_path --version) ${opts}"
  best_pystone=$(for (( i = 0; i < $loops; i++ )); do
  "${python_path}" -m test.pystone $pystone_loops | head -n 1 | sed 's|^.*= ||'
  done | sort -n | head -1)
  echo "best of $loops sets of $pystone_loops loops, lower is better: ${best_pystone}"
}

pyenv_install() {
  local version="${1}"
  local opts="${2:-""}"

  echo -e "\nInstalling python ${version} with options: ${2:-none}"

  local TIMEFORMAT=%R
  local python_install_time="$(time ( \
    export PYENV_ROOT=./pyenv
    [ -n "${opts}" ] && export ${opts}
    ./pyenv/bin/pyenv install "${version}" &>/dev/null \
    ) 2>&1)"
  echo "Time to install: $python_install_time"
}

pyenv_uninstall() {
  local version="${1}"
  PYENV_ROOT=./pyenv ./pyenv/bin/pyenv uninstall -f "${version}"
  if [ ! -d ./pyenv/versions/"${version}" ]; then
    echo "Uninstalled python ${version} from ./pyenv"
  else
    echo "Unable to uninstall python ${version}, exiting"
    exit 1
  fi
}

latest_pyenv_raw=$(curl -s https://github.com/pyenv/pyenv/tags.atom | grep -om 1 '    <title>.*</title>')
[[ $latest_pyenv_raw =~ \<title\>(.*)\</title\> ]] && latest_pyenv_version="${BASH_REMATCH[1]}"

rm -rf ./pyenv
git clone --branch="$latest_pyenv_version" --depth=1 https://github.com/pyenv/pyenv.git >/dev/null
echo "Bare pyenv directory size: $(du -sh ./pyenv)"
echo

raspbian_python3_version="$(/usr/bin/python3 --version | sed 's|^Python ||')"
echo "Comparing with Raspbian Python $raspbian_python3_version"
test_pystone /usr/bin/python3
echo

pyenv_install $raspbian_python3_version
echo "pyenv directory size with (only) $raspbian_python3_version installed: $(du -sh ./pyenv)"
test_pystone ./pyenv/versions/$raspbian_python3_version/bin/python3
pyenv_uninstall $raspbian_python3_version
echo

pyenv_install $raspbian_python3_version "CONFIGURE_OPTS=--enable-optimizations"
echo "pyenv directory size with (only) optimized $raspbian_python3_version installed: $(du -sh ./pyenv)"
test_pystone ./pyenv/versions/$raspbian_python3_version/bin/python3 "CONFIGURE_OPTS=--enable-optimizations"
pyenv_uninstall $raspbian_python3_version
echo

pyenv_install 3.6.4 "CONFIGURE_OPTS=--enable-optimizations"
echo "pyenv directory size with (only) optimized 3.6.4 installed: $(du -sh ./pyenv)"
test_pystone ./pyenv/versions/3.6.4/bin/python3 "CONFIGURE_OPTS=--enable-optimizations"
pyenv_uninstall 3.6.4
```

Output:

```
Bare pyenv directory size: 4.8M	./pyenv

Comparing with Raspbian Python 3.5.3
Testing pystone for /usr/bin/python3 Python 3.5.3 
best of 10 sets of 20000 loops, lower is better: 2.1506


Installing python 3.5.3 with options: none
Time to install: 979.572
pyenv directory size with (only) 3.5.3 installed: 169M	./pyenv
Testing pystone for ./pyenv/versions/3.5.3/bin/python3 Python 3.5.3 
best of 10 sets of 20000 loops, lower is better: 2.24193
Uninstalled python 3.5.3 from ./pyenv


Installing python 3.5.3 with options: CONFIGURE_OPTS=--enable-optimizations
Time to install: 36690.053
pyenv directory size with (only) optimized 3.5.3 installed: 172M	./pyenv
Testing pystone for ./pyenv/versions/3.5.3/bin/python3 Python 3.5.3 with CONFIGURE_OPTS=--enable-optimizations
best of 10 sets of 20000 loops, lower is better: 1.8656
Uninstalled python 3.5.3 from ./pyenv


Installing python 3.6.4 with options: CONFIGURE_OPTS=--enable-optimizations
Time to install: 16845.605
pyenv directory size with (only) optimized 3.6.4 installed: 174M	./pyenv
Testing pystone for ./pyenv/versions/3.6.4/bin/python3 Python 3.6.4 with CONFIGURE_OPTS=--enable-optimizations
best of 10 sets of 20000 loops, lower is better: 1.80994
Uninstalled python 3.6.4 from ./pyenv
```
