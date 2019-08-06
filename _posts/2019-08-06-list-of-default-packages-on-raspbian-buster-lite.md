---
title: List of Default Packages on Raspbian Buster Lite
date: 2019-08-06T09:34:49-06:00
author: n8henrie
layout: post
permalink: /2019/08/list-of-default-packages-on-raspbian-buster-lite/
categories:
- tech
excerpt: >
    Here are the default packages on a fresh image of Raspbian Buster Lite
tags:
- linux
- raspberrypi
---
**Bottom Line:** Here are the default packages on a fresh image of Raspbian
Buster Lite
<!--more-->

Please see [my post of the packages on a default Raspbian Jessie and Wheezy
installation](https://n8henrie.com/2015/12/default-packages-on-raspbian-jessie-jessie-lite-and-wheezy/)
for background and "methodology."

Raspbian Buster Lite 2019-06-20<br/>
SHA-256: 9009409a9f969b117602d85d992d90563f181a904bc3812bdd880fc493185234

Of note, it looks like this info is also available from
<http://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2019-06-24/>
in the `.info` file.

```plaintext
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                           Version                     Architecture Description
+++-==============================-===========================-============-===============================================================================
ii  adduser                        3.118                       all          add and remove users and groups
ii  alsa-utils                     1.1.8-2                     armhf        Utilities for configuring and using ALSA
ii  apt                            1.8.2                       armhf        commandline package manager
ii  apt-listchanges                3.19                        all          package change history notification tool
ii  apt-transport-https            1.8.2                       all          transitional package for https support
ii  apt-utils                      1.8.2                       armhf        package management related utility programs
ii  avahi-daemon                   0.7-4+b1                    armhf        Avahi mDNS/DNS-SD daemon
ii  base-files                     10.3+rpi1                   armhf        Debian base system miscellaneous files
ii  base-passwd                    3.5.46                      armhf        Debian base system master password and group files
ii  bash                           5.0-4                       armhf        GNU Bourne Again SHell
ii  bash-completion                1:2.8-6                     all          programmable completion for the bash shell
ii  bind9-host                     1:9.11.5.P4+dfsg-5          armhf        DNS lookup utility (deprecated)
ii  binutils                       2.31.1-16+rpi1              armhf        GNU assembler, linker and binary utilities
ii  binutils-arm-linux-gnueabihf   2.31.1-16+rpi1              armhf        GNU binary utilities, for arm-linux-gnueabihf target
ii  binutils-common:armhf          2.31.1-16+rpi1              armhf        Common files for the GNU assembler, linker and binary utilities
ii  bluez                          5.50-1+rpt1                 armhf        Bluetooth tools and daemons
ii  bluez-firmware                 1.2-4+rpt2                  all          Firmware for Bluetooth devices
ii  bsdmainutils                   11.1.2                      armhf        collection of more utilities from FreeBSD
ii  bsdutils                       1:2.33.1-0.1                armhf        basic utilities from 4.4BSD-Lite
ii  build-essential                12.6                        armhf        Informational list of build-essential packages
ii  bzip2                          1.0.6-9                     armhf        high-quality block-sorting file compressor - utilities
ii  ca-certificates                20190110                    all          Common CA certificates
ii  cifs-utils                     2:6.8-2                     armhf        Common Internet File System utilities
ii  console-setup                  1.191                       all          console font and keymap setup program
ii  console-setup-linux            1.191                       all          Linux specific part of console-setup
ii  coreutils                      8.30-3                      armhf        GNU core utilities
ii  cpio                           2.12+dfsg-9                 armhf        GNU cpio -- a program to manage archives of files
ii  cpp                            4:8.3.0-1+rpi2              armhf        GNU C preprocessor (cpp)
ii  cpp-8                          8.3.0-6+rpi1                armhf        GNU C preprocessor
ii  crda                           3.18-1                      armhf        wireless Central Regulatory Domain Agent
ii  cron                           3.0pl1-133                  armhf        process scheduling daemon
ii  curl                           7.64.0-4                    armhf        command line tool for transferring data with URL syntax
ii  dash                           0.5.10.2-5                  armhf        POSIX-compliant shell
ii  dbus                           1.12.16-1                   armhf        simple interprocess messaging system (daemon and utilities)
ii  dc                             1.07.1-2                    armhf        GNU dc arbitrary precision reverse-polish calculator
ii  debconf                        1.5.71                      all          Debian configuration management system
ii  debconf-i18n                   1.5.71                      all          full internationalization support for debconf
ii  debconf-utils                  1.5.71                      all          debconf utilities
ii  debianutils                    4.8.6.1                     armhf        Miscellaneous utilities specific to Debian
ii  device-tree-compiler           1.4.7-3+rpt1                armhf        Device Tree Compiler for Flat Device Trees
ii  dhcpcd5                        1:7.0.8-0.1+rpt1            armhf        DHCPv4, IPv6RA and DHCPv6 client with IPv4LL support
ii  diffutils                      1:3.7-3                     armhf        File comparison utilities
ii  dirmngr                        2.2.12-1+rpi1               armhf        GNU privacy guard - network certificate management service
ii  distro-info-data               0.41                        all          information about the distributions' releases (data files)
ii  dmidecode                      3.2-1                       armhf        SMBIOS/DMI table decoder
ii  dmsetup                        2:1.02.155-2                armhf        Linux Kernel Device Mapper userspace library
ii  dosfstools                     4.1-2                       armhf        utilities for making and checking MS-DOS FAT filesystems
ii  dphys-swapfile                 20100506-5                  all          Autogenerate and use a swap file
ii  dpkg                           1.19.7                      armhf        Debian package management system
ii  dpkg-dev                       1.19.7                      all          Debian package development tools
ii  e2fsprogs                      1.44.5-1                    armhf        ext2/ext3/ext4 file system utilities
ii  ed                             1.15-1                      armhf        classic UNIX line editor
ii  ethtool                        1:4.19-1                    armhf        display or change Ethernet device settings
ii  fake-hwclock                   0.11+rpt1                   all          Save/restore system clock on machines without working RTC hardware
ii  fakeroot                       1.23-1                      armhf        tool for simulating superuser privileges
ii  fbset                          2.1-30                      armhf        framebuffer device maintenance program
ii  fdisk                          2.33.1-0.1                  armhf        collection of partitioning utilities
ii  file                           1:5.35-4                    armhf        Recognize the type of data in a file using "magic" numbers
ii  findutils                      4.6.0+git+20190209-2        armhf        utilities for finding files--find, xargs
ii  firmware-atheros               1:20190114-1+rpt2           all          Binary firmware for Atheros wireless cards
ii  firmware-brcm80211             1:20190114-1+rpt2           all          Binary firmware for Broadcom/Cypress 802.11 wireless cards
ii  firmware-libertas              1:20190114-1+rpt2           all          Binary firmware for Marvell wireless cards
ii  firmware-misc-nonfree          1:20190114-1+rpt2           all          Binary firmware for various drivers in the Linux kernel
ii  firmware-realtek               1:20190114-1+rpt2           all          Binary firmware for Realtek wired/wifi/BT adapters
ii  freetype2-doc                  2.9.1-3                     all          FreeType 2 font engine, development documentation
ii  g++                            4:8.3.0-1+rpi2              armhf        GNU C++ compiler
ii  g++-8                          8.3.0-6+rpi1                armhf        GNU C++ compiler
ii  gcc                            4:8.3.0-1+rpi2              armhf        GNU C compiler
ii  gcc-4.9-base:armhf             4.9.4-2+rpi1+b19            armhf        GCC, the GNU Compiler Collection (base package)
ii  gcc-5-base:armhf               5.5.0-8                     armhf        GCC, the GNU Compiler Collection (base package)
ii  gcc-6-base:armhf               6.5.0-1+rpi1+b1             armhf        GCC, the GNU Compiler Collection (base package)
ii  gcc-7-base:armhf               7.3.0-19                    armhf        GCC, the GNU Compiler Collection (base package)
ii  gcc-8                          8.3.0-6+rpi1                armhf        GNU C compiler
ii  gcc-8-base:armhf               8.3.0-6+rpi1                armhf        GCC, the GNU Compiler Collection (base package)
ii  gdb                            8.2.1-2                     armhf        GNU Debugger
ii  gdbm-l10n                      1.18.1-4                    all          GNU dbm database routines (translation files) 
ii  geoip-database                 20181108-1                  all          IP lookup command line tools that use the GeoIP library (country database)
ii  gettext-base                   0.19.8.1-9                  armhf        GNU Internationalization utilities for the base system
ii  gnupg                          2.2.12-1+rpi1               all          GNU privacy guard - a free PGP replacement
ii  gnupg-l10n                     2.2.12-1+rpi1               all          GNU privacy guard - localization files
ii  gnupg-utils                    2.2.12-1+rpi1               armhf        GNU privacy guard - utility programs
ii  gpg                            2.2.12-1+rpi1               armhf        GNU Privacy Guard -- minimalist public key operations
ii  gpg-agent                      2.2.12-1+rpi1               armhf        GNU privacy guard - cryptographic agent
ii  gpg-wks-client                 2.2.12-1+rpi1               armhf        GNU privacy guard - Web Key Service client
ii  gpg-wks-server                 2.2.12-1+rpi1               armhf        GNU privacy guard - Web Key Service server
ii  gpgconf                        2.2.12-1+rpi1               armhf        GNU privacy guard - core configuration utilities
ii  gpgsm                          2.2.12-1+rpi1               armhf        GNU privacy guard - S/MIME version
ii  gpgv                           2.2.12-1+rpi1               armhf        GNU privacy guard - signature verification tool
ii  grep                           3.3-1                       armhf        GNU grep, egrep and fgrep
ii  groff-base                     1.22.4-3                    armhf        GNU troff text-formatting system (base system components)
ii  gzip                           1.9-3                       armhf        GNU compression utilities
ii  hardlink                       0.3.2                       armhf        Hardlinks multiple copies of the same file
ii  hostname                       3.21                        armhf        utility to set/show the host name or domain name
ii  htop                           2.2.0-1                     armhf        interactive processes viewer
ii  ifupdown                       0.8.35                      armhf        high level tools to configure network interfaces
ii  info                           6.5.0.dfsg.1-4+b1           armhf        Standalone GNU Info documentation browser
ii  init                           1.56+nmu1                   armhf        metapackage ensuring an init system is installed
ii  init-system-helpers            1.56+nmu1                   all          helper tools for all init systems
ii  install-info                   6.5.0.dfsg.1-4+b1           armhf        Manage installed documentation in info format
ii  iproute2                       4.20.0-2                    armhf        networking and traffic control tools
ii  iptables                       1.8.2-4                     armhf        administration tools for packet filtering and NAT
ii  iputils-ping                   3:20180629-2                armhf        Tools to test the reachability of network hosts
ii  isc-dhcp-client                4.4.1-2                     armhf        DHCP client for automatically obtaining an IP address
ii  isc-dhcp-common                4.4.1-2                     armhf        common manpages relevant to all of the isc-dhcp packages
ii  iso-codes                      4.2-1                       all          ISO language, territory, currency, script codes and their translations
ii  iw                             5.0.1-1                     armhf        tool for configuring Linux wireless devices
ii  javascript-common              11                          all          Base support for JavaScript library packages
ii  kbd                            2.0.4-4                     armhf        Linux console font and keytable utilities
ii  keyboard-configuration         1.191                       all          system-wide keyboard preferences
ii  keyutils                       1.6-6                       armhf        Linux Key Management Utilities
ii  kmod                           26-1                        armhf        tools for managing Linux kernel modules
ii  less                           487-0.1                     armhf        pager program similar to more
ii  libacl1:armhf                  2.2.53-4                    armhf        access control list - shared library
ii  libalgorithm-diff-perl         1.19.03-2                   all          module to find differences between files
ii  libalgorithm-diff-xs-perl      0.04-5+b1                   armhf        module to find differences between files (XS accelerated)
ii  libalgorithm-merge-perl        0.08-3                      all          Perl module for three-way merge of textual data
ii  libapparmor1:armhf             2.13.2-10                   armhf        changehat AppArmor library
ii  libapt-inst2.0:armhf           1.8.2                       armhf        deb package format runtime library
ii  libapt-pkg5.0:armhf            1.8.2                       armhf        package management runtime library
ii  libargon2-1:armhf              0~20171227-0.2              armhf        memory-hard hashing function - runtime library
ii  libasan5:armhf                 8.3.0-6+rpi1                armhf        AddressSanitizer -- a fast memory error detector
ii  libasound2:armhf               1.1.8-1+rpt1                armhf        shared library for ALSA applications
ii  libasound2-data                1.1.8-1+rpt1                all          Configuration files and profiles for ALSA drivers
ii  libassuan0:armhf               2.5.2-1                     armhf        IPC library for the GnuPG components
ii  libatomic1:armhf               8.3.0-6+rpi1                armhf        support library providing __atomic built-in functions
ii  libattr1:armhf                 1:2.4.48-4                  armhf        extended attribute handling - shared library
ii  libaudit-common                1:2.8.4-3                   all          Dynamic library for security auditing - common files
ii  libaudit1:armhf                1:2.8.4-3                   armhf        Dynamic library for security auditing
ii  libavahi-common-data:armhf     0.7-4+b1                    armhf        Avahi common data files
ii  libavahi-common3:armhf         0.7-4+b1                    armhf        Avahi common library
ii  libavahi-core7:armhf           0.7-4+b1                    armhf        Avahi's embeddable mDNS/DNS-SD library
ii  libbabeltrace1:armhf           1.5.6-2                     armhf        Babeltrace conversion libraries
ii  libbind9-161:armhf             1:9.11.5.P4+dfsg-5          armhf        BIND9 Shared Library used by BIND
ii  libbinutils:armhf              2.31.1-16+rpi1              armhf        GNU binary utilities (private shared library)
ii  libblkid1:armhf                2.33.1-0.1                  armhf        block device ID library
ii  libboost-iostreams1.58.0:armhf 1.58.0+dfsg-5.1+rpi1+b4     armhf        Boost.Iostreams Library
ii  libbsd0:armhf                  0.9.1-2                     armhf        utility functions from BSD systems - shared library
ii  libbz2-1.0:armhf               1.0.6-9                     armhf        high-quality block-sorting file compressor library - runtime
ii  libc-bin                       2.28-10+rpi1                armhf        GNU C Library: Binaries
ii  libc-dev-bin                   2.28-10+rpi1                armhf        GNU C Library: Development binaries
ii  libc-l10n                      2.28-10+rpi1                all          GNU C Library: localization files
ii  libc6:armhf                    2.28-10+rpi1                armhf        GNU C Library: Shared libraries
ii  libc6-dbg:armhf                2.28-10+rpi1                armhf        GNU C Library: detached debugging symbols
ii  libc6-dev:armhf                2.28-10+rpi1                armhf        GNU C Library: Development Libraries and Header Files
ii  libcap-ng0:armhf               0.7.9-2                     armhf        An alternate POSIX capabilities library
ii  libcap2:armhf                  1:2.25-2                    armhf        POSIX 1003.1e capabilities (library)
ii  libcap2-bin                    1:2.25-2                    armhf        POSIX 1003.1e capabilities (utilities)
ii  libcc1-0:armhf                 8.3.0-6+rpi1                armhf        GCC cc1 plugin for GDB
ii  libcom-err2:armhf              1.44.5-1                    armhf        common error description library
ii  libcryptsetup12:armhf          2:2.1.0-5                   armhf        disk encryption support - shared library
ii  libcurl4:armhf                 7.64.0-4                    armhf        easy-to-use client-side URL transfer library (OpenSSL flavour)
ii  libdaemon0:armhf               0.14-7                      armhf        lightweight C library for daemons - runtime library
ii  libdb5.3:armhf                 5.3.28+dfsg1-0.5            armhf        Berkeley v5.3 Database Libraries [runtime]
ii  libdbus-1-3:armhf              1.12.16-1                   armhf        simple interprocess messaging system (library)
ii  libdebconfclient0:armhf        0.249                       armhf        Debian Configuration Management System (C-implementation library)
ii  libdevmapper1.02.1:armhf       2:1.02.155-2                armhf        Linux Kernel Device Mapper userspace library
ii  libdns-export1104              1:9.11.5.P4+dfsg-5          armhf        Exported DNS Shared Library
ii  libdns1104:armhf               1:9.11.5.P4+dfsg-5          armhf        DNS Shared Library used by BIND
ii  libdpkg-perl                   1.19.7                      all          Dpkg perl modules
ii  libdw1:armhf                   0.176-1.1                   armhf        library that provides access to the DWARF debug information
ii  libedit2:armhf                 3.1-20181209-1              armhf        BSD editline and history libraries
ii  libelf1:armhf                  0.176-1.1                   armhf        library to read and write ELF files
ii  libestr0:armhf                 0.1.10-2.1                  armhf        Helper functions for handling strings (lib)
ii  libevent-2.1-6:armhf           2.1.8-stable-4              armhf        Asynchronous event notification library
ii  libexpat1:armhf                2.2.6-1                     armhf        XML parsing C library - runtime library
ii  libext2fs2:armhf               1.44.5-1                    armhf        ext2/ext3/ext4 file system libraries
ii  libfakeroot:armhf              1.23-1                      armhf        tool for simulating superuser privileges - shared libraries
ii  libfastjson4:armhf             0.99.8-2                    armhf        fast json library for C
ii  libfdisk1:armhf                2.33.1-0.1                  armhf        fdisk partitioning library
ii  libffi6:armhf                  3.2.1-9                     armhf        Foreign Function Interface library runtime
ii  libfftw3-single3:armhf         3.3.8-2                     armhf        Library for computing Fast Fourier Transforms - Single precision
ii  libfile-fcntllock-perl         0.22-3+b4                   armhf        Perl module for file locking with fcntl(2)
ii  libfreetype6:armhf             2.9.1-3                     armhf        FreeType 2 font engine, shared library files
ii  libfreetype6-dev:armhf         2.9.1-3                     armhf        FreeType 2 font engine, development files
ii  libfribidi0:armhf              1.0.5-3.1                   armhf        Free Implementation of the Unicode BiDi algorithm
ii  libfstrm0:armhf                0.4.0-1                     armhf        Frame Streams (fstrm) library
ii  libgcc-8-dev:armhf             8.3.0-6+rpi1                armhf        GCC support library (development files)
ii  libgcc1:armhf                  1:8.3.0-6+rpi1              armhf        GCC support library
ii  libgcrypt20:armhf              1.8.4-5                     armhf        LGPL Crypto library - runtime library
ii  libgdbm-compat4:armhf          1.18.1-4                    armhf        GNU dbm database routines (legacy support runtime version) 
ii  libgdbm6:armhf                 1.18.1-4                    armhf        GNU dbm database routines (runtime version) 
ii  libgeoip1:armhf                1.6.12-1                    armhf        non-DNS IP-to-country resolver library
ii  libglib2.0-0:armhf             2.58.3-2                    armhf        GLib library of C routines
ii  libglib2.0-data                2.58.3-2                    all          Common files for GLib library
ii  libgmp10:armhf                 2:6.1.2+dfsg-4              armhf        Multiprecision arithmetic library
ii  libgnutls30:armhf              3.6.7-4                     armhf        GNU TLS library - main runtime library
ii  libgomp1:armhf                 8.3.0-6+rpi1                armhf        GCC OpenMP (GOMP) support library
ii  libgpg-error0:armhf            1.35-1                      armhf        GnuPG development runtime library
ii  libgpm2:armhf                  1.20.7-5                    armhf        General Purpose Mouse - shared library
ii  libgssapi-krb5-2:armhf         1.17-2                      armhf        MIT Kerberos runtime libraries - krb5 GSS-API Mechanism
ii  libhogweed4:armhf              3.4.1-1                     armhf        low level cryptographic library (public-key cryptos)
ii  libicu63:armhf                 63.1-6                      armhf        International Components for Unicode
ii  libident                       0.22-3.1                    armhf        simple RFC1413 client library - runtime
ii  libidn11:armhf                 1.33-2.2                    armhf        GNU Libidn library, implementation of IETF IDN specifications
ii  libidn2-0:armhf                2.0.5-1                     armhf        Internationalized domain names (IDNA2008/TR46) library
ii  libip4tc0:armhf                1.8.2-4                     armhf        netfilter libip4tc library
ii  libip6tc0:armhf                1.8.2-4                     armhf        netfilter libip6tc library
ii  libiptc0:armhf                 1.8.2-4                     armhf        netfilter libiptc library
ii  libisc-export1100:armhf        1:9.11.5.P4+dfsg-5          armhf        Exported ISC Shared Library
ii  libisc1100:armhf               1:9.11.5.P4+dfsg-5          armhf        ISC Shared Library used by BIND
ii  libisccc161:armhf              1:9.11.5.P4+dfsg-5          armhf        Command Channel Library used by BIND
ii  libisccfg163:armhf             1:9.11.5.P4+dfsg-5          armhf        Config File Handling Library used by BIND
ii  libisl19:armhf                 0.20-2                      armhf        manipulating sets and relations of integer points bounded by linear constraints
ii  libiw30:armhf                  30~pre9-13                  armhf        Wireless tools - library
ii  libjim0.77:armhf               0.77+dfsg0-3                armhf        small-footprint implementation of Tcl - shared library
ii  libjpeg62-turbo:armhf          1:1.5.2-2+b1                armhf        libjpeg-turbo JPEG runtime library
ii  libjs-jquery                   3.3.1~dfsg-3                all          JavaScript library for dynamic web applications
ii  libjson-c3:armhf               0.12.1+ds-2                 armhf        JSON manipulation library - shared library
ii  libk5crypto3:armhf             1.17-2                      armhf        MIT Kerberos runtime libraries - Crypto Library
ii  libkeyutils1:armhf             1.6-6                       armhf        Linux Key Management Utilities (library)
ii  libkmod2:armhf                 26-1                        armhf        libkmod shared library
ii  libkrb5-3:armhf                1.17-2                      armhf        MIT Kerberos runtime libraries
ii  libkrb5support0:armhf          1.17-2                      armhf        MIT Kerberos runtime libraries - Support library
ii  libksba8:armhf                 1.3.5-2                     armhf        X.509 and CMS support library
ii  libldap-2.4-2:armhf            2.4.47+dfsg-3+rpi1          armhf        OpenLDAP libraries
ii  libldap-common                 2.4.47+dfsg-3+rpi1          all          OpenLDAP common files for libraries
ii  liblmdb0:armhf                 0.9.22-1                    armhf        Lightning Memory-Mapped Database shared library
ii  liblocale-gettext-perl         1.07-3+b3                   armhf        module using libc functions for internationalization in Perl
ii  liblognorm5:armhf              2.0.5-1                     armhf        log normalizing library
ii  libluajit-5.1-2:armhf          2.1.0~beta3+dfsg-5.1        armhf        Just in time compiler for Lua - library version
ii  libluajit-5.1-common           2.1.0~beta3+dfsg-5.1        all          Just in time compiler for Lua - common files
ii  liblwres161:armhf              1:9.11.5.P4+dfsg-5          armhf        Lightweight Resolver Library used by BIND
ii  liblz4-1:armhf                 1.8.3-1                     armhf        Fast LZ compression algorithm library - runtime
ii  liblzma5:armhf                 5.2.4-1                     armhf        XZ-format compression library
ii  libmagic-mgc                   1:5.35-4                    armhf        File type determination library using "magic" numbers (compiled magic file)
ii  libmagic1:armhf                1:5.35-4                    armhf        Recognize the type of data in a file using "magic" numbers - library
ii  libmnl-dev                     1.0.4-2                     armhf        minimalistic Netlink communication library (devel)
ii  libmnl0:armhf                  1.0.4-2                     armhf        minimalistic Netlink communication library
ii  libmount1:armhf                2.33.1-0.1                  armhf        device mounting library
ii  libmpc3:armhf                  1.1.0-1                     armhf        multiple precision complex floating-point library
ii  libmpdec2:armhf                2.4.2-2                     armhf        library for decimal floating point arithmetic (runtime library)
ii  libmpfr6:armhf                 4.0.2-1                     armhf        multiple precision floating-point computation
ii  libmtp-common                  1.1.16-2                    all          Media Transfer Protocol (MTP) common files
ii  libmtp-runtime                 1.1.16-2                    armhf        Media Transfer Protocol (MTP) runtime tools
ii  libmtp9:armhf                  1.1.16-2                    armhf        Media Transfer Protocol (MTP) library
ii  libncurses6:armhf              6.1+20181013-2              armhf        shared libraries for terminal handling
ii  libncursesw5:armhf             6.1+20181013-2              armhf        shared libraries for terminal handling (wide character legacy version)
ii  libncursesw6:armhf             6.1+20181013-2              armhf        shared libraries for terminal handling (wide character support)
ii  libnetfilter-conntrack3:armhf  1.0.7-1                     armhf        Netfilter netlink-conntrack library
ii  libnettle6:armhf               3.4.1-1                     armhf        low level cryptographic library (symmetric and one-way cryptos)
ii  libnewt0.52:armhf              0.52.20-8                   armhf        Not Erik's Windowing Toolkit - text mode windowing with slang
ii  libnfnetlink0:armhf            1.0.1-3                     armhf        Netfilter netlink library
ii  libnfsidmap2:armhf             0.25-5.1                    armhf        NFS idmapping library
ii  libnftnl11:armhf               1.1.2-2                     armhf        Netfilter nftables userspace API library
ii  libnghttp2-14:armhf            1.36.0-2                    armhf        library implementing HTTP/2 protocol (shared library)
ii  libnl-3-200:armhf              3.4.0-1                     armhf        library for dealing with netlink sockets
ii  libnl-genl-3-200:armhf         3.4.0-1                     armhf        library for dealing with netlink sockets - generic netlink
ii  libnl-route-3-200:armhf        3.4.0-1                     armhf        library for dealing with netlink sockets - route interface
ii  libnpth0:armhf                 1.6-1                       armhf        replacement for GNU Pth using system threads
ii  libnss-mdns:armhf              0.14.1-1+b5                 armhf        NSS module for Multicast DNS name resolution
ii  libp11-kit0:armhf              0.23.15-2                   armhf        library for loading and coordinating access to PKCS#11 modules - runtime
ii  libpam-chksshpwd:armhf         1.3.1-5+rpt1                armhf        PAM module to enable SSH password checking support
ii  libpam-modules:armhf           1.3.1-5+rpt1                armhf        Pluggable Authentication Modules for PAM
ii  libpam-modules-bin             1.3.1-5+rpt1                armhf        Pluggable Authentication Modules for PAM - helper binaries
ii  libpam-runtime                 1.3.1-5+rpt1                all          Runtime support for the PAM library
ii  libpam-systemd:armhf           241-5+rpi1                  armhf        system and service manager - PAM module
ii  libpam0g:armhf                 1.3.1-5+rpt1                armhf        Pluggable Authentication Modules library
ii  libparted2:armhf               3.2-25                      armhf        disk partition manipulator - shared library
ii  libpcre2-8-0:armhf             10.32-5                     armhf        New Perl Compatible Regular Expression Library- 8 bit runtime files
ii  libpcre2-posix0:armhf          10.32-5                     armhf        New Perl Compatible Regular Expression Library - posix-compatible runtime files
ii  libpcre3:armhf                 2:8.39-12                   armhf        Old Perl 5 Compatible Regular Expression Library - runtime files
ii  libpcsclite1:armhf             1.8.24-1                    armhf        Middleware to access a smart card using PC/SC (library)
ii  libperl5.28:armhf              5.28.1-6                    armhf        shared Perl library
ii  libpipeline1:armhf             1.5.1-2                     armhf        pipeline manipulation library
ii  libpng-dev:armhf               1.6.36-6                    armhf        PNG library - development (version 1.6)
ii  libpng-tools                   1.6.36-6                    armhf        PNG library - tools (version 1.6)
ii  libpng16-16:armhf              1.6.36-6                    armhf        PNG library - runtime (version 1.6)
ii  libpolkit-agent-1-0:armhf      0.105-25                    armhf        PolicyKit Authentication Agent API
ii  libpolkit-backend-1-0:armhf    0.105-25                    armhf        PolicyKit backend API
ii  libpolkit-gobject-1-0:armhf    0.105-25                    armhf        PolicyKit Authorization API
ii  libpopt0:armhf                 1.16-12                     armhf        lib for parsing cmdline parameters
ii  libprocps7:armhf               2:3.3.15-2                  armhf        library for accessing process information from /proc
ii  libprotobuf-c1:armhf           1.3.1-1+b1                  armhf        Protocol Buffers C shared library (protobuf-c)
ii  libpsl5:armhf                  0.20.2-2                    armhf        Library for Public Suffix List (shared libraries)
ii  libpython-stdlib:armhf         2.7.16-1                    armhf        interactive high-level object-oriented language (Python2)
ii  libpython2-stdlib:armhf        2.7.16-1                    armhf        interactive high-level object-oriented language (Python2)
ii  libpython2.7-minimal:armhf     2.7.16-2                    armhf        Minimal subset of the Python language (version 2.7)
ii  libpython2.7-stdlib:armhf      2.7.16-2                    armhf        Interactive high-level object-oriented language (standard library, version 2.7)
ii  libpython3-stdlib:armhf        3.7.3-1                     armhf        interactive high-level object-oriented language (default python3 version)
ii  libpython3.7:armhf             3.7.3-2                     armhf        Shared Python runtime library (version 3.7)
ii  libpython3.7-minimal:armhf     3.7.3-2                     armhf        Minimal subset of the Python language (version 3.7)
ii  libpython3.7-stdlib:armhf      3.7.3-2                     armhf        Interactive high-level object-oriented language (standard library, version 3.7)
ii  libraspberrypi-bin             1.20190620-1                armhf        Miscellaneous Raspberry Pi utilities
ii  libraspberrypi-dev             1.20190620-1                armhf        EGL/GLES/OpenVG/etc. libraries for the Raspberry Pi's VideoCore IV (headers)
ii  libraspberrypi-doc             1.20190620-1                armhf        EGL/GLES/OpenVG/etc. libraries for the Raspberry Pi's VideoCore IV (headers)
ii  libraspberrypi0                1.20190620-1                armhf        EGL/GLES/OpenVG/etc. libraries for the Raspberry Pi's VideoCore IV
ii  libreadline6:armhf             6.3-9                       armhf        GNU readline and history libraries, run-time libraries
ii  libreadline7:armhf             7.0-5                       armhf        GNU readline and history libraries, run-time libraries
ii  librtmp1:armhf                 2.4+20151223.gitfa8646d.1-2 armhf        toolkit for RTMP streams (shared library)
ii  libsamplerate0:armhf           0.1.9-2                     armhf        Audio sample rate conversion library
ii  libsasl2-2:armhf               2.1.27+dfsg-1+b1            armhf        Cyrus SASL - authentication abstraction library
ii  libsasl2-modules-db:armhf      2.1.27+dfsg-1+b1            armhf        Cyrus SASL - pluggable authentication modules (DB)
ii  libseccomp2:armhf              2.3.3-4                     armhf        high level interface to Linux seccomp filter
ii  libselinux1:armhf              2.8-1+b1                    armhf        SELinux runtime shared libraries
ii  libsemanage-common             2.8-2                       all          Common files for SELinux policy management libraries
ii  libsemanage1:armhf             2.8-2                       armhf        SELinux policy management library
ii  libsepol1:armhf                2.8-1                       armhf        SELinux library for manipulating binary security policies
ii  libsigc++-1.2-5c2              1.2.7-2+b1                  armhf        type-safe Signal Framework for C++ - runtime
ii  libslang2:armhf                2.3.2-2                     armhf        S-Lang programming library - runtime version
ii  libsmartcols1:armhf            2.33.1-0.1                  armhf        smart column output alignment library
ii  libsqlite3-0:armhf             3.27.2-3                    armhf        SQLite 3 shared library
ii  libss2:armhf                   1.44.5-1                    armhf        command-line interface parsing library
ii  libssh2-1:armhf                1.8.0-2.1                   armhf        SSH2 client-side library
ii  libssl1.1:armhf                1.1.1c-1                    armhf        Secure Sockets Layer toolkit - shared libraries
ii  libstdc++-8-dev:armhf          8.3.0-6+rpi1                armhf        GNU Standard C++ Library v3 (development files)
ii  libstdc++6:armhf               8.3.0-6+rpi1                armhf        GNU Standard C++ Library v3
ii  libsystemd0:armhf              241-5+rpi1                  armhf        systemd utility library
ii  libtalloc2:armhf               2.1.14-2                    armhf        hierarchical pool based memory allocator
ii  libtasn1-6:armhf               4.13-3                      armhf        Manage ASN.1 structures (runtime)
ii  libtext-charwidth-perl         0.04-7.1+b1                 armhf        get display widths of characters on the terminal
ii  libtext-iconv-perl             1.7-5+b10                   armhf        converts between character sets in Perl
ii  libtext-wrapi18n-perl          0.06-7.1                    all          internationalized substitute of Text::Wrap
ii  libtinfo5:armhf                6.1+20181013-2              armhf        shared low-level terminfo library (legacy version)
ii  libtinfo6:armhf                6.1+20181013-2              armhf        shared low-level terminfo library for terminal handling
ii  libtirpc-common                1.1.4-0.4                   all          transport-independent RPC library - common files
ii  libtirpc3:armhf                1.1.4-0.4                   armhf        transport-independent RPC library
ii  libubsan1:armhf                8.3.0-6+rpi1                armhf        UBSan -- undefined behaviour sanitizer (runtime)
ii  libuchardet0:armhf             0.0.6-3                     armhf        universal charset detection library - shared library
ii  libudev0:armhf                 175-7.2                     armhf        libudev shared library
ii  libudev1:armhf                 241-5+rpi1                  armhf        libudev shared library
ii  libunistring2:armhf            0.9.10-1                    armhf        Unicode string library for C
ii  libusb-1.0-0:armhf             2:1.0.22-2                  armhf        userspace USB programming library
ii  libuuid1:armhf                 2.33.1-0.1                  armhf        Universally Unique ID library
ii  libv4l-0:armhf                 1.16.3-3                    armhf        Collection of video4linux support libraries
ii  libv4l2rds0:armhf              1.16.3-3                    armhf        Video4Linux Radio Data System (RDS) decoding library
ii  libv4lconvert0:armhf           1.16.3-3                    armhf        Video4linux frame format conversion library
ii  libwbclient0:armhf             2:4.9.5+dfsg-4              armhf        Samba winbind client library
ii  libwrap0:armhf                 7.6.q-28                    armhf        Wietse Venema's TCP wrappers library
ii  libx11-6:armhf                 2:1.6.7-1                   armhf        X11 client-side library
ii  libx11-data                    2:1.6.7-1                   all          X11 client-side library
ii  libxau6:armhf                  1:1.0.8-1+b2                armhf        X11 authorisation library
ii  libxcb1:armhf                  1.13.1-2                    armhf        X C Binding
ii  libxdmcp6:armhf                1:1.1.2-3                   armhf        X11 Display Manager Control Protocol library
ii  libxext6:armhf                 2:1.3.3-1+b2                armhf        X11 miscellaneous extension library
ii  libxml2:armhf                  2.9.4+dfsg1-7+b1            armhf        GNOME XML library
ii  libxmuu1:armhf                 2:1.1.2-2                   armhf        X11 miscellaneous micro-utility library
ii  libxtables12:armhf             1.8.2-4                     armhf        netfilter xtables library
ii  libzstd1:armhf                 1.3.8+dfsg-3+rpi1           armhf        fast lossless compression algorithm
ii  linux-libc-dev:armhf           4.18.20-2+rpi1              armhf        Linux support headers for userspace development
ii  locales                        2.28-10+rpi1                all          GNU C Library: National Language (locale) data [support]
ii  login                          1:4.5-1.1                   armhf        system login tools
ii  logrotate                      3.14.0-4                    armhf        Log rotation utility
ii  lsb-base                       10.2019051400+rpi1          all          Linux Standard Base init script functionality
ii  lsb-release                    10.2019051400+rpi1          all          Linux Standard Base version reporting utility
ii  lua5.1                         5.1.5-8.1                   armhf        Simple, extensible, embeddable programming language
ii  luajit                         2.1.0~beta3+dfsg-5.1        armhf        Just in time compiler for Lua programming language version 5.1
ii  make                           4.2.1-1.2                   armhf        utility for directing compilation
ii  man-db                         2.8.5-2                     armhf        on-line manual pager
ii  manpages                       4.16-2                      all          Manual pages about using a GNU/Linux system
ii  manpages-dev                   4.16-2                      all          Manual pages about using GNU/Linux for development
ii  mawk                           1.3.3-17                    armhf        a pattern scanning and text processing language
ii  mime-support                   3.62                        all          MIME files 'mime.types' & 'mailcap', and support programs
ii  mount                          2.33.1-0.1                  armhf        tools for mounting and manipulating filesystems
ii  multiarch-support              2.28-10+rpi1                armhf        Transitional package to ensure multiarch compatibility
ii  nano                           3.2-2                       armhf        small, friendly text editor inspired by Pico
ii  ncdu                           1.13-1                      armhf        ncurses disk usage viewer
ii  ncurses-base                   6.1+20181013-2              all          basic terminal type definitions
ii  ncurses-bin                    6.1+20181013-2              armhf        terminal-related programs and man pages
ii  ncurses-term                   6.1+20181013-2              all          additional terminal type definitions
ii  net-tools                      1.60+git20180626.aebd88e-1  armhf        NET-3 networking toolkit
ii  netbase                        5.6                         all          Basic TCP/IP networking system
ii  netcat-openbsd                 1.195-2                     armhf        TCP/IP swiss army knife
ii  netcat-traditional             1.10-41.1                   armhf        TCP/IP swiss army knife
ii  nfs-common                     1:1.3.4-2.5                 armhf        NFS support files common to client and server
ii  openresolv                     3.8.0-1                     armhf        management framework for resolv.conf
ii  openssh-client                 1:7.9p1-10                  armhf        secure shell (SSH) client, for secure access to remote machines
ii  openssh-server                 1:7.9p1-10                  armhf        secure shell (SSH) server, for secure access from remote machines
ii  openssh-sftp-server            1:7.9p1-10                  armhf        secure shell (SSH) sftp server module, for SFTP access from remote machines
ii  openssl                        1.1.1c-1                    armhf        Secure Sockets Layer toolkit - cryptographic utility
ii  parted                         3.2-25                      armhf        disk partition manipulator
ii  passwd                         1:4.5-1.1                   armhf        change and administer password and group data
ii  patch                          2.7.6-3                     armhf        Apply a diff file to an original
ii  paxctld                        1.2.1-1                     armhf        Daemon to automatically set appropriate PaX flags
ii  perl                           5.28.1-6                    armhf        Larry Wall's Practical Extraction and Report Language
ii  perl-base                      5.28.1-6                    armhf        minimal Perl system
ii  perl-modules-5.28              5.28.1-6                    all          Core Perl modules
ii  pi-bluetooth                   0.1.11                      all          Raspberry Pi 3 bluetooth
ii  pinentry-curses                1.1.0-2                     armhf        curses-based PIN or pass-phrase entry dialog for GnuPG
ii  pkg-config                     0.29-6                      armhf        manage compile and link flags for libraries
ii  policykit-1                    0.105-25                    armhf        framework for managing administrative policies and privileges
ii  procps                         2:3.3.15-2                  armhf        /proc file system utilities
ii  psmisc                         23.2-1                      armhf        utilities that use the proc file system
ii  publicsuffix                   20190415.1030-1             all          accurate, machine-readable list of domain name suffixes
ii  python                         2.7.16-1                    armhf        interactive high-level object-oriented language (Python2 version)
ii  python-apt-common              1.8.4                       all          Python interface to libapt-pkg (locales)
ii  python-minimal                 2.7.16-1                    armhf        minimal subset of the Python2 language
ii  python-rpi.gpio                0.6.5-1                     armhf        Module to control Raspberry Pi GPIO channels (Python 2)
ii  python2                        2.7.16-1                    armhf        interactive high-level object-oriented language (Python2 version)
ii  python2-minimal                2.7.16-1                    armhf        minimal subset of the Python2 language
ii  python2.7                      2.7.16-2                    armhf        Interactive high-level object-oriented language (version 2.7)
ii  python2.7-minimal              2.7.16-2                    armhf        Minimal subset of the Python language (version 2.7)
ii  python3                        3.7.3-1                     armhf        interactive high-level object-oriented language (default python3 version)
ii  python3-apt                    1.8.4                       armhf        Python 3 interface to libapt-pkg
ii  python3-certifi                2018.8.24-1                 all          root certificates for validating SSL certs and verifying TLS hosts (python3)
ii  python3-chardet                3.0.4-3                     all          universal character encoding detector for Python3
ii  python3-debconf                1.5.71                      all          interact with debconf from Python 3
ii  python3-idna                   2.6-1                       all          Python IDNA2008 (RFC 5891) handling (Python 3)
ii  python3-minimal                3.7.3-1                     armhf        minimal subset of the Python language (default python3 version)
ii  python3-pkg-resources          40.8.0-1                    all          Package Discovery and Resource Access using pkg_resources
ii  python3-requests               2.21.0-1                    all          elegant and simple HTTP library for Python3, built for human beings
ii  python3-six                    1.12.0-1                    all          Python 2 and 3 compatibility library (Python 3 interface)
ii  python3-urllib3                1.24.1-1                    all          HTTP library with thread-safe connection pooling for Python3
ii  python3.7                      3.7.3-2                     armhf        Interactive high-level object-oriented language (version 3.7)
ii  python3.7-minimal              3.7.3-2                     armhf        Minimal subset of the Python language (version 3.7)
ii  raspberrypi-bootloader         1.20190620-1                armhf        Raspberry Pi bootloader
ii  raspberrypi-kernel             1.20190620-1                armhf        Raspberry Pi bootloader
ii  raspberrypi-net-mods           1.2.8                       all          Network configuration for the Raspberry Pi UI
ii  raspberrypi-sys-mods           20190429                    armhf        System tweaks for the Raspberry Pi
ii  raspbian-archive-keyring       20120528.2                  all          GnuPG archive keys of the raspbian archive
ii  raspi-config                   20190607                    all          Raspberry Pi configuration tool
ii  raspi-copies-and-fills         0.13                        armhf        ARM-accelerated versions of selected functions from string.h
ii  readline-common                7.0-5                       all          GNU readline and history libraries, common files
ii  rfkill                         2.33.1-0.1                  armhf        tool for enabling and disabling wireless devices
ii  rng-tools                      2-unofficial-mt.14-1        armhf        Daemon to use a Hardware TRNG
ii  rpcbind                        1.2.5-0.3                   armhf        converts RPC program numbers into universal addresses
ii  rpi-update                     20140705                    all          Raspberry Pi firmware updating tool
ii  rpi.gpio-common:armhf          0.6.5-1                     armhf        Module to control Raspberry Pi GPIO channels (common files)
ii  rsync                          3.1.3-6                     armhf        fast, versatile, remote (and local) file-copying tool
ii  rsyslog                        8.1901.0-1                  armhf        reliable system and kernel logging daemon
ii  sed                            4.7-1                       armhf        GNU stream editor for filtering/transforming text
ii  sensible-utils                 0.0.12                      all          Utilities for sensible alternative selection
ii  shared-mime-info               1.10-1                      armhf        FreeDesktop.org shared MIME database and spec
ii  ssh                            1:7.9p1-10                  all          secure shell client and server (metapackage)
ii  ssh-import-id                  5.7-1                       all          securely retrieve an SSH public key and install it locally
ii  strace                         4.26-0.2                    armhf        System call tracer
ii  sudo                           1.8.27-1                    armhf        Provide limited super user privileges to specific users
ii  systemd                        241-5+rpi1                  armhf        system and service manager
ii  systemd-sysv                   241-5+rpi1                  armhf        system and service manager - SysV links
ii  sysvinit-utils                 2.93-8                      armhf        System-V-like utilities
ii  tar                            1.30+dfsg-6                 armhf        GNU version of the tar archiving utility
ii  tasksel                        3.53                        all          tool for selecting tasks for installation on Debian systems
ii  tasksel-data                   3.53                        all          official tasks used for installation of Debian systems
ii  traceroute                     1:2.1.0-2                   armhf        Traces the route taken by packets over an IPv4/IPv6 network
ii  triggerhappy                   0.5.0-1                     armhf        global hotkey daemon for Linux
ii  tzdata                         2019a-1                     all          time zone and daylight-saving time data
ii  ucf                            3.0038+nmu1                 all          Update Configuration File(s): preserve user changes to config files
ii  udev                           241-5+rpi1                  armhf        /dev/ and hotplug management daemon
ii  unzip                          6.0-23                      armhf        De-archiver for .zip files
ii  usb-modeswitch                 2.5.2+repack0-2             armhf        mode switching tool for controlling "flip flop" USB devices
ii  usb-modeswitch-data            20170806-2                  all          mode switching data for usb-modeswitch
ii  usb.ids                        2019.04.23-1                all          USB ID Repository
ii  usbutils                       1:010-3                     armhf        Linux USB utilities
ii  util-linux                     2.33.1-0.1                  armhf        miscellaneous system utilities
ii  v4l-utils                      1.16.3-3                    armhf        Collection of command line video4linux utilities
ii  vim-common                     2:8.1.0875-5                all          Vi IMproved - Common files
ii  vim-tiny                       2:8.1.0875-5                armhf        Vi IMproved - enhanced vi editor - compact version
ii  wget                           1.20.1-1.1                  armhf        retrieves files from the web
ii  whiptail                       0.52.20-8                   armhf        Displays user-friendly dialog boxes from shell scripts
ii  wireless-regdb                 2018.05.09-0~rpt1           all          wireless regulatory database
ii  wireless-tools                 30~pre9-13                  armhf        Tools for manipulating Linux Wireless Extensions
ii  wpasupplicant                  2:2.7+git20190128+0c1e29f-6 armhf        client support for WPA and WPA2 (IEEE 802.11i)
ii  xauth                          1:1.0.10-1                  armhf        X authentication utility
ii  xdg-user-dirs                  0.17-2                      armhf        tool to manage well known user directories
ii  xkb-data                       2.26-2                      all          X Keyboard Extension (XKB) configuration data
ii  xxd                            2:8.1.0875-5                armhf        tool to make (or reverse) a hex dump
ii  xz-utils                       5.2.4-1                     armhf        XZ-format compression utilities
ii  zlib1g:armhf                   1:1.2.11.dfsg-1             armhf        compression library - runtime
ii  zlib1g-dev:armhf               1:1.2.11.dfsg-1             armhf        compression library - development
```
