---
title: Cross-Compile Rust for x86 Linux from M1 Mac with Nix
date: 2023-09-06T14:24:35-06:00
author: n8henrie
layout: post
permalink: /2023/09/crosscompile-rust-for-x86-linux-from-m1-mac-with-nix/
categories:
- tech
excerpt: "Nix make cross-compiling Rust fairly straightforward."
tags:
- nix
- rust
- linux
- MacOS
- tech
---
**Bottom Line:** Nix makes cross-compiling Rust fairly straightforward.
<!--more-->

I have been tinkering with using nix to build Rust projects over the last
couple of weeks and decided to try my hand at cross-compiling Rust for
x86_64-linux from my M1 Mac (aarch64-darwin) via nix. Currently, several of my
machines are running various flavors of NixOS (several aarch64-linux Raspberry
Pis, a few x86_64-linux machines, an aarch64-linux Asahi-turned-NixOS machine,
my MBP with nix-darwin), but it's still really important for me to be able to
compile for regular non-NixOS Linux machines.

Via rustup, rust does a great job providing toolchains to facilitate
cross-compiling: simply `rustup target add x86_64-unknown-linux-gnu`.
Unfortunately it doesn't provide *linkers*, so even after you've added the
toolchain, if you try to compile for linux, it's not going to work:

```console
$ cargo new linux-cross-example && cd linux-cross-example
$ rustup target add x86_64-unknown-linux-gnu
info: component 'rust-std' for target 'x86_64-unknown-linux-gnu' is up to date
$ cargo build --target=x86_64-unknown-linux-gnu
...
  = note: clang: warning: argument unused during compilation: '-pie' [-Wunused-command-line-argument]
          ld: unknown option: --as-needed
...
```

There are a number of workarounds, including downloading linkers via homebrew,
various GitHub projects, using docker, or -- my favorite -- using [zig to do
the work for you][0] (although this doesn't seem to be working currently for
musl targets, [issue](https://github.com/ziglang/zig/issues/5320)).

With nix, the current best practice seems to be having nix (as opposed to cargo
/ rust) do the heavy lifting of cross-compilation. Continuing in the
`linux-cross-example` directory created above, I created a basic `flake.nix`,
including these inputs:

```
inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
};
```

Perhaps the key feature of nix is ensuring reproducibility, so to that end, if
readers are not having luck following this post, it may be necessary to pin the
inputs to these specific revisions:

```console
$ nix flake metadata
warning: Git tree '/Users/n8henrie/Desktop/linux-cross' is dirty
Resolved URL:  git+file:///Users/n8henrie/Desktop/linux-cross
Locked URL:    git+file:///Users/n8henrie/Desktop/linux-cross
Description:   Example of cross-compiling Rust on aarch64-darwin for x86_64-linux
Path:          /nix/store/d67wnc6v391x4gq5a24wzxbxxxfbvx07-source
Last modified: 1969-12-31 17:00:00
Inputs:
├───nixpkgs: github:nixos/nixpkgs/3c15feef7770eb5500a4b8792623e2d6f598c9c1
└───rust-overlay: github:oxalica/rust-overlay/a8b4bb4cbb744baaabc3e69099f352f99164e2c1
    ├───flake-utils: github:numtide/flake-utils/cfacdce06f30d2b68473a46042957675eebb3401
    │   └───systems: github:nix-systems/default/da67096a3b9bf56a91d16901293e51ba5b49a27e
    └───nixpkgs: github:NixOS/nixpkgs/96ba1c52e54e74c3197f4d43026b3f3d92e83ff9
```

For our first trick, we'll try to compile a `hello world` program for
`x86_64-unknown-linux-gnu`, probably better known as "your run-of-the-mill
standard Linux system." Here is the rest of my `flake.nix`:


```nix
{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
  }: let
    system = "aarch64-darwin";
    overlays = [(import rust-overlay)];
    pkgs = import nixpkgs {
      inherit overlays system;
      crossSystem = {
        config = "x86_64-unknown-linux-gnu";
        rustc.config = "x86_64-unknown-linux-gnu";
      };
    };
  in {
    packages.${system} = {
      default = self.outputs.packages.${system}.x86_64-linux-example;
      x86_64-linux-example = pkgs.callPackage ./. {};
    };
  };
}
```

To go along with the above, we'll use this very simple `default.nix` (which is
the file that will be called by "default" via `pkgs.callPackage ./.`, or if one
were to `import` a directory as in `import ./.`):

```
{rustPlatform}:
rustPlatform.buildRustPackage {
  name = "rust-cross-test";
  src = ./.;
  cargoLock.lockFile = ./Cargo.lock;
}
```

So currently our working directory looks like this:

```console
$ tree .
.
├── Cargo.toml
├── default.nix
├── flake.nix
└── src
    └── main.rs

2 directories, 4 files
```

Amazingly, all that it takes for a successful build from here is to first run
`cargo update` (or `cargo build`) to generate `Cargo.lock`, and then run `nix
build`!

```console
$ cargo update
$ nix build
warning: Git tree '/Users/n8henrie/Desktop/linux-cross' is dirty
warning: creating lock file '/Users/n8henrie/Desktop/linux-cross/flake.lock'
warning: Git tree '/Users/n8henrie/Desktop/linux-cross' is dirty
$ echo $?
0
```

We can see that the resulting file seems to have the expected architecture:

```console
$ file result/bin/linux-cross-example
result/bin/linux-cross-example: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /nix/store/2abz7cq1p8c1pg38prm2gpja67bzr9gq-glibc-x86_64-unknown-linux-gnu-2.37-8/lib/ld-linux-x86-64.so.2, for GNU/Linux 3.10.0, not stripped
```

I used `scp` to copy the binary from `./result/bin/linux-cross-example` to my
Arch linux machine. Unfortunately, upon trying to run it, I got a surprising
error:

```console
$ cat /etc/os-release
NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
ANSI_COLOR="38;2;23;147;209"
HOME_URL="https://archlinux.org/"
DOCUMENTATION_URL="https://wiki.archlinux.org/"
SUPPORT_URL="https://bbs.archlinux.org/"
BUG_REPORT_URL="https://bugs.archlinux.org/"
PRIVACY_POLICY_URL="https://terms.archlinux.org/docs/privacy-policy/"
LOGO=archlinux-logo
$ ./linux-cross-example
-bash: ./linux-cross-example: cannot execute: required file not found
```

Huh.

```console
$ ldd ./linux-cross-example
        linux-vdso.so.1 (0x00007ffc363a4000)
        libgcc_s.so.1 => /usr/lib/libgcc_s.so.1 (0x00007f5dc90ed000)
        libc.so.6 => /usr/lib/libc.so.6 (0x00007f5dc8e00000)
        /nix/store/2abz7cq1p8c1pg38prm2gpja67bzr9gq-glibc-x86_64-unknown-linux-gnu-2.37-8/lib/ld-linux-x86-64.so.2 => /usr/lib64/ld-linux-x86-64.so.2 (0x00007f5dc91a6000)
```

Huh, so it seems to be looking for `ld-linux-x86-64.so.2` in `/nix/store` but
isn't finding it (because it's not there).

Skipping back up a few lines, we actually already saw this path in the output
from the `file` command, run locally on MacOS: `dynamically linked, interpreter
/nix/store/2abz7c...`

After a bit of investigative work, it seems that rust binaries are [*mostly*
statically linked by default][1], but do need to find a few libraries like
`glibc`, which are dynamically linked. Nix is creating this binary in such a
way that it is trying to find nix's copy of this required file, but the nix
version doesn't exist on my Arch machine. Apparently most Linux machines put it
in `/lib64/` or perhaps `/usr/lib64/`; on my Arch machine, it looks like
`/lib64/` should work (which is a symlink to `/usr/lib/`):

```console
$ stat /lib64/ld-linux-x86-64.so.2
  File: /lib64/ld-linux-x86-64.so.2
  Size: 216192    	Blocks: 424        IO Block: 4096   regular file
Device: 0,25	Inode: 17427431    Links: 1
Access: (0755/-rwxr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2023-09-05 14:40:37.920798992 -0600
Modify: 2023-08-17 09:05:37.000000000 -0600
Change: 2023-08-22 14:10:02.729886634 -0600
 Birth: 2023-08-22 14:10:02.729886634 -0600
 ```

Thankfully, nix provides a tool called `patchelf` that can patch the binary to
look in a non-default location for this required file. We'll add it to
`default.nix`:

```nix
{rustPlatform}:
rustPlatform.buildRustPackage {
  name = "rust-cross-test";
  src = ./.;
  cargoLock.lockFile = ./Cargo.lock;
  postBuild = ''
    patchelf --set-interpreter /lib64/ld-linux-x86-64.so.2 target/x86_64-unknown-linux-gnu/release/linux-cross-example
  '';
}
```

We'll once again run `nix build`, use `scp` to copy the binary, and...

```console
$ ./linux-cross-example
Hello, world!
```

Sweet, it works! We cross-compiled Rust from our M1 Mac to x86_64-linux with
just a few lines of nix code!

For our next challenge, let's see if we can build a **fully static**
`x86_64-unknown-linux-gnu` binary! We'll modify `default.nix` by removing the
`patchelf` code (since this will by *fully static* and not require the
`--set-interpreter` business) and adding a few lines of code from [the same
StackOverflow thread from above][1]:


```nix
{
  rustPlatform,
  glibc,
}:
rustPlatform.buildRustPackage {
  name = "rust-cross-test";
  src = ./.;
  cargoLock.lockFile = ./Cargo.lock;
  buildInputs = [glibc.static];
  RUSTFLAGS = ["-C" "target-feature=+crt-static"];
}
```

```console
$ nix build
$ file result/bin/linux-cross-example
result/bin/linux-cross-example: ELF 64-bit LSB pie executable, x86-64, version 1 (GNU/Linux), static-pie linked, for GNU/Linux 3.10.0, not stripped
```

It certainly *looks* like a static binary. Sure enough, our it runs like a
champ on our Linux machine!

```console
$ ldd linux-cross-example
        statically linked
$ ./linux-cross-example
Hello, world!
```

For our last trick, we'll try to compile a fully static musl build, which
should run on basically any `x86_64-linux` machine. For this, we can revert our
`default.nix` back to the very simple way it started:

```nix
{rustPlatform}:
rustPlatform.buildRustPackage {
  name = "rust-cross-test";
  src = ./.;
  cargoLock.lockFile = ./Cargo.lock;
}
```

And simply change `flake.nix` to reflect the `musl` target triple, setting
`isStatic = true;`:

```nix
{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
  }: let
    system = "aarch64-darwin";
    overlays = [(import rust-overlay)];
    pkgs = import nixpkgs {
      inherit overlays system;
      crossSystem = {
        config = "x86_64-unknown-linux-musl";
        rustc.config = "x86_64-unknown-linux-musl";
        isStatic = true;
      };
    };
  in {
    packages.${system} = {
      default = self.outputs.packages.${system}.x86_64-linux-musl-example;
      x86_64-linux-musl-example = pkgs.callPackage ./. {};
    };
  };
}
```

```console
$ nix build
$ file result/bin/linux-cross-example
result/bin/linux-cross-example: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), static-pie linked, not stripped
```

On the Arch machine:

```console
$ ldd linux-cross-example
        statically linked
$ ./linux-cross-example
Hello, world!
```

Cool! It took a little bit of reading and tinkering to sort this out, but in
the end it's a *remarkably* simple setup requiring very few lines of code (at
least for this `hello world` project). As a side note, I didn't have any luck
statically compiling for `x86_64-unknown-linux-gnu` with the `isStatic`
setting; for me this results in a unsupported system error.

Putting everything together, with a little bit of refactoring, and adding a
bonus config for `aarch64-unknown-linux-musl` (which runs without issue on an
`aarch64-linux` Raspberry Pi):

```nix
{
  description = "Example of cross-compiling Rust on aarch64-darwin for x86_64-linux";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
  }: let
    system = "aarch64-darwin";
    overlays = [(import rust-overlay)];
    makePkgs = config:
      import nixpkgs {
        inherit overlays system;
        crossSystem = {
          inherit config;
          rustc = {inherit config;};
          isStatic = builtins.elem config [
            "aarch64-unknown-linux-musl"
            "x86_64-unknown-linux-musl"
          ];
        };
      };
  in {
    packages.${system} = {
      default = self.outputs.packages.${system}.x86_64-linux-gnu-example;
      x86_64-linux-gnu-example = (makePkgs "x86_64-unknown-linux-gnu").callPackage ./. {};
      x86_64-linux-gnu-static-example = (makePkgs "x86_64-unknown-linux-gnu").callPackage ./. {buildGNUStatic = true;};
      x86_64-linux-musl-example = (makePkgs "x86_64-unknown-linux-musl").callPackage ./. {};
      aarch64-linux-musl-example = (makePkgs "aarch64-unknown-linux-musl").callPackage ./. {};
    };
  };
}
```

```nix
{
  rustPlatform,
  glibc,
  targetPlatform,
  lib,
  buildGNUStatic ? false,
}:
rustPlatform.buildRustPackage ({
    name = "rust-cross-test";
    src = ./.;
    cargoLock.lockFile = ./Cargo.lock;
  }
  // (
    if buildGNUStatic
    then {
      buildInputs = [glibc.static];
      RUSTFLAGS = ["-C" "target-feature=+crt-static"];
    }
    else
      lib.optionalAttrs (targetPlatform.config == "x86_64-unknown-linux-gnu") {
        postBuild = ''
          patchelf --set-interpreter /lib64/ld-linux-x86-64.so.2 target/x86_64-unknown-linux-gnu/release/linux-cross-example
        '';
      }
  ))
```

From here, one should be able to `nix build .#x86_64-linux-musl-example` and be
off to the races! And thanks to the power of nix, with any luck, and if you pin
your inputs to the versions listed towards the beginning of this post, you
should theoretically be able to rely on a successful build today, tomorrow, and
maybe months, years, or -- who knows -- [maybe even a decade from
now](https://blinry.org/nix-time-travel/)!

[0]: https://actually.fyi/posts/zig-makes-rust-cross-compilation-just-work/
[1]: https://stackoverflow.com/questions/31770604/how-to-generate-statically-linked-executables
