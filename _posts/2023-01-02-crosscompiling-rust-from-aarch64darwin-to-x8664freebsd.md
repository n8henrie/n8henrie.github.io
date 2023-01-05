---
title: Cross-compiling Rust from aarch64-darwin to x86_64-freebsd
date: 2023-01-02T14:47:24-07:00
author: n8henrie
layout: post
permalink: /2023/01/crosscompiling-rust-from-aarch64darwin-to-x8664freebsd/
categories:
- tech
excerpt: "To build rust for x86_64-freebsd from M1 Macs, try `cross-rs`."
tags:
- MacOS
- rust
- tech
---
**Bottom Line:** To build rust for x86_64-freebsd from M1 Macs, try `cross-rs`.
<!--more-->

I started using [pfSense][0] as my home router / firewall a few months ago and
have been generally pretty happy. Last week I decided to make a simple tool
that I wanted to run as a scheduled task on the router, and I figured It would
try to build it in rust. I haven't done a *whole* lot of cross-compilation in
rust, but I didn't think it would be too difficult, even though I'm building on
an M1 Mac.

I was wrong.

For context, I enjoy writing Rust much more than Go, but Go's cross-compilation
story is *so good*:

```console
$ go mod init hello-world-pfsense-go
$ cat <<'EOF' > main.go
package main

func main() {
	println("hello from go")
}
EOF
$ GOOS=freebsd GOARCH=amd64 go build
```

And that's it. It "just worked":

```console
$ file hello-world-pfsense-go
hello-world-pfsense-go: ELF 64-bit LSB executable, x86-64, version 1 (FreeBSD), statically linked, Go BuildID=Z28o7oeyPtvBK_5PtRat/rrqLEVcYpz6TRemoEBw6/CKtjgYiTl36zk0WHzVqz/8Zb3Xo6ZzG3NTDrESVXO, with debug_info, not stripped
$ scp hello-world-pfsense-go router:/tmp
hello-world-pfsense-go    100% 1165KB   1.7MB/s   00:00
$ ssh router: /tmp/hello-world-pfsense-go
hello from go
```

Hoping in vain for something analogously simple from Rust, I started with:

```console
$ cargo new hello-world-pfsense && cd $_
$ rustup target add x86_64-unknown-freebsd
$ cargo build --target x86_64-unknown-freebsd
...
error: linking with `cc` failed: exit status: 1
```

I've seen some issues like this before. The below workaround ([see also][1])
requires a zig installation but works great for compiling for x86_64-linux:

```console
$ cat <<'EOF' > ~/.local/bin/zcc-x86_64-linux-gnu
#!/usr/bin/env bash

set -Eeuf -o pipefail

main() {
  local toolchain=${0#*zcc-}
  exec zig cc -target "${toolchain}" "$@"
}
main "$@"
EOF
$ cat <<'EOF' >> ~/.cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "/Users/n8henrie/.local/bin/zcc-x86_64-linux-gnu"
EOF
$ rustup target add x86_64-unknown-linux-gnu
$ cargo build --target x86_64-unknown-linux-gnu
```

So I thought I'd try the same zig-based solution:

```console
$ cp ~/.local/bin/zcc-x86_64-linux-gnu ~/.local/bin/zcc-x86_64-freebsd-gnu
$ cat <<'EOF' >> ~/.cargo/config.toml
[target.x86_64-unknown-freebsd]
linker = "/Users/n8henrie/.local/bin/zcc-x86_64-freebsd-gnu"
EOF
$ cargo build --target x86_64-unknown-freebsd
...
   Compiling hello-world-pfsense v0.1.0 (/Users/n8henrie/git/hello-world-pfsense)
error: linking with `/Users/n8henrie/.local/bin/zcc-x86_64-freebsd-gnu` failed: exit status: 1
...
          /opt/homebrew/Cellar/zig/0.10.0/lib/zig/include/inttypes.h:21:15/opt/homebrew/Cellar/zig/0.10.0/lib/zig/libunwind/src/config.h: fatal error: 21:
          /opt/homebrew/Cellar/zig/0.10.0/lib/zig/include/inttypes.h:21:15'inttypes.h' file not found:: fatal error: 'inttypes.h' file not found
...
          /opt/homebrew/Cellar/zig/0.10.0/lib/zig/include/inttypes.h:21:15: fatal error: 'inttypes.h' file not found
...
error: could not compile `hello-world-pfsense` due to previous error
```

No luck. (I opened <https://github.com/ziglang/zig/issues/14212>, perhaps I'm
doing something wrong here.)

Next I resorted to trying [`cross`][2], which uses docker to get the job done
(so you'll need a working docker installation). I'm not a big fan of docker,
especially since I often end up with a bunch of warnings about being on ARM64
machine when it expects AMD64, but I thought it was worth a shot.

However, after installing cross, things seemed to actually work, which is a
solid start:

```console
$ cargo install cross --git https://github.com/cross-rs/cross
$ cross build --target x86_64-unknown-freebsd
...
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
...
   Compiling hello-world-pfsense v0.1.0 (/project)
<jemalloc>: MADV_DONTNEED does not work (memset will be used instead)
<jemalloc>: (This is the expected behaviour if you are running under QEMU)
    Finished dev [unoptimized + debuginfo] target(s) in 12.93s
$ file target/x86_64-unknown-freebsd/debug/hello-world-pfsense
target/x86_64-unknown-freebsd/debug/hello-world-pfsense: ELF 64-bit LSB pie executable, x86-64, version 1 (FreeBSD), dynamically linked, interpreter /libexec/ld-elf.so.1, for FreeBSD 12.3, FreeBSD-style, with debug_info, not stripped
```

After copying this file to my pfSense machine confirmed I was greeted with a
friendly `Hello, world!`. Success!

However, the familiar docker warnings about my architechture made me suspect I
was leaving some performance on the table. After a `docker image prune` and
*lots* of prusing issues and tinkering, I seem to have gotten a proper ARM64
host image with the following:

```console
$ git clone https://github.com/cross-rs/cross
$ cd cross
$ git submodule update --init --remote
$ cargo build-docker-image \
    --platform=aarch64-unknown-linux-gnu \
    x86_64-unknown-freebsd \
    --tag local
$ cat <<'EOF' > Cross.toml
[target.x86_64-unknown-freebsd]
image.name = "ghcr.io/cross-rs/x86_64-unknown-freebsd:local"
image.toolchain = ["linux/arm64/v8=aarch64-unknown-linux-gnu"]
EOF
$ cross build --target x86_64-unknown-freebsd --release
   Compiling hello-world-pfsense v0.1.0 (/Users/n8henrie/git/hello-world-pfsense)
    Finished release [optimized] target(s) in 8.16s
$ echo $?
0
$
```

Phew!

### Notes

For `cross` to work, I had to use the current `main` (`cross 0.2.4 (1d9d310
2023-01-05)`), installed from github as shown above, and I had to put the
config into `Cross.toml` instead of using
`[package.metadata.cross.target.x86_64-unknown-freebsd]` in `Cargo.toml`, which
I *think* should have worked. More info and [issue here][3].

I'm also unclear if my approach with zig should have been expected to work, I
raised an [issue here][4] which may have more information by the time you read
this.

[0]: https://www.pfsense.org/
[1]: https://actually.fyi/posts/zig-makes-rust-cross-compilation-just-work/
[2]: https://github.com/cross-rs/cross/
[3]: https://github.com/cross-rs/cross/issues/1182
[4]: https://github.com/ziglang/zig/issues/14212
