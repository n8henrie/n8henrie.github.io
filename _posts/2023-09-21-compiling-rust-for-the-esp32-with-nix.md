---
title: Compiling Rust for the ESP32 with Nix
date: 2023-09-21T14:36:44-06:00
author: n8henrie
layout: post
permalink: /2023/09/compiling-rust-for-the-esp32-with-nix/
categories:
- tech
excerpt: "Nix's tooling for Rust compilation can target the ESP32."
tags:
- arduino
- electronics
- nix
- rust
- tech
---
**Bottom Line:** Nix's tooling for Rust compilation can target the ESP32.
<!--more-->

### Preface

This is a fairly long, meandering post about using nix to compile a `no_std`
Rust project for the ESP32C3. I was able to get things working eventually, and
I try to recreate the process that took me there, including several mistakes
along the way. Many of the error messages that I encountered seemed quite
obscure and had non-obvious (to me, at least) fixes. Worst of all was that I
found relatively few directly relevant or helpful blog posts in spite of fairly
diligent searches through DuckDuckGo, Google, Stack Overflow, GitHub, and the
NixOS Discourse. I decided to write this post in this style -- including the
error messages I encountered and what I did to resolve or work around them --
specifically hoping to provide future searchers with something more helpful
than what I found, should they run across similar errors. For anyone that just
wants to "flip to the solutions at the end of the textbook," feel free to
scroll to the bottom, where I've included the final nix config; you'll
obviously still need to clone the `esp-rs/no_std-training` repo to get the relevant
Rust code.

<hr />
<br />
I occasionally like to tinker with electronics, like [toy projects on an
arduino](https://n8henrie.com/tags/#arduino-ref), or sometimes building for
even cheaper targets like the [ESP01](https://amzn.to/3Lw87C2) or an
[ATMEGA328P](https://amzn.to/46kaorV) directly.

I've traditionally used the Arduino IDE and/or
[PlatformIO](https://platformio.org/) to get the job done, and since I hardly
know any C, I've also experimented with [micropython](https://micropython.org)
(whose support for the ESP8266 is particularly welcome).

More recently, as I continue learning about Rust, one of the features that
particularly appeals to me is the support for compiling for "bare-metal"
[`no_std`](https://docs.rust-embedded.org/book/intro/no-std.html) targets,
including my beloved ATMEGA328p (`--target avr-unknown-gnu-atmega328`). Perhaps
an even more exciting target is the ESP32C3, for which an [incredible amount of
(ongoing) work](https://mabez.dev/blog/posts/) is making this a wifi-enabled
`no_std` Rust-compatible chip: <https://github.com/esp-rs/esp-wifi>

Because I'm only an *occasional* tinkerer with these types of projects, one
issue that has bitten me more than once is when updates to the tooling and
ecosystem make it so that once-working code no longer works when I come back to it
after a hiatus. While many of these projects can run for years or decades once
flashed to a device, I often find that if I return to update or modify a
project months or years later, that so much of the tooling has changed that I
can't get the project to compile (even with no changes to my code) or perhaps
the tooling to flash the binary has changed or become outdated. While it's
great that arduino, platformio, esptool, ampy, etc. are continuing to evolve
and improve, it is certainly frustrating when things have changed so much that
existing projects no longer work.

The Rust tooling is already pretty solid at protecting against this; for
example, one can include a `rust-toolchain.toml` file along with a project and
pin a specific version of the Rust compiler (e.g. `nightly-2020-07-10`), and
even specify included components and targets:
<https://rust-lang.github.io/rustup/overrides.html>

I think this would *probably* suffice for making it highly likely that one
could return to a Rust-based microcontroller project years later and still be
able to produce a usable binary. However, this is the type of problem for which
nix **really** shines -- it can help guarantee that all of the dependencies for
a project are reproducible down to first principles and even leverages a
binary cache that can help ensure that tools are available for use in nix
projects even if their original sources are taken offline. If one knows
beforehand that it may be many years before they return to a project, it's even
possible to vendor archives of all of these dependencies, guarding against the
hypothetical possibility that the `nightly-2020-07-10` version of Rust is taken
down and no longer available for download (see also: `nix nar`, `nix bundle`,
`nix-copy-closure`).

For the purposes of this post, I found that -- with some effort -- I was able
to use the nix tooling to compile a `no_std` project for the ESP32C3 that
successfully connects to wifi. I think the best place to start is by putting
nix aside for a moment to focus on the Rust code.

I started by dusting off my [ESP32C3](https://amzn.to/48rT8mo) and referring to
the [esp-rs/esp-wifi repo](https://github.com/esp-rs/esp-wifi). I had toyed
with it a year or two ago, but the esp-rs team has put a *lot* of work into it
since then, so I wanted to see how well the updates worked. I was able to get
the code in `examples-esp32c3/examples/dhcp.rs` to work, but as of the time of
writing [the instructions][2] are set up for this to be run as an example
(`cargo run --example dhcp --release --features "embedded-svc,wifi"`) from the
root of the repo, and I found it fairly difficult to make modifications to this
code for a standalone project, in part due to the inter-dependencies within the
workspace.

Luckily, while poking around, I found a fairly new repo at
[github.com/esp-rs/no_std-training](https://github.com/esp-rs/no_std-training)
that seemed to be just the ticket -- in `no_std-training/intro/http-client`, I
found an example project including a `Cargo.toml`, `rust-toolchain.toml`, and
sample code in a subdirectory at `examples/http-client.rs` that seems like a
great start. At the time of writing `src/main.rs` seemed incomplete and was not
working -- this project appears to be a work in progress.

On my M1 Mac, I found that I was able to compile this code with no difficulty:

```console
$ git clone git@github.com:esp-rs/no_std-training.git
$ cd no_std-training
$ git checkout 88bc692d81dfcf9491c80dc7c9e8601b702e465a
$ cd intro/http-client
$ cat examples/http-client.rs > src/main.rs
$ rustup target add riscv32imc-unknown-none-elf
$ export SSID=foo PASSWORD=bar
$ cargo build
$ file target/riscv32imc-unknown-none-elf/debug/http-client
target/riscv32imc-unknown-none-elf/debug/http-client: ELF 32-bit LSB executable, UCB RISC-V, RVC, soft-float ABI, version 1 (SYSV), statically linked, with debug_info, not stripped
```

**NB:** the esp-rs team strongly recommends building in `--release` mode, and
cautions that the code may fail to run if compiled in debug mode (the default)
like I've done above; I'm just using debug mode to check my work while writing
this post because it's faster to compile.

With that working, I set about to putting dependencies into nix to hopefully
help *keep* it working. One of the first steps to help this process is to pin
any `git` dependencies in `Cargo.toml`, to make sure we're always pulling down
the same version.

Thankfully, reviewing `Cargo.toml` shows only a single `git` dependency, on
`esp-wifi` itself, which we can pin to a recent and known working commit by
adding a `rev` to the `esp-wifi` line:

```toml
esp-wifi = { git = "https://github.com/esp-rs/esp-wifi/", features = ["esp32c3", "wifi-logs", "wifi"], rev = "e7140fd35852dadcd1df7592dc149e876256348f" }
```

I usually start adding nix to my projects using a flake template, which I've
made available at [github.com/n8henrie/flake-templates][0] and can be used like
so:

```nix
$ nix flake init -t github:n8henrie/flake-templates#trivial
```

This includes a function named `systemClosure` that helps reduce some
boilerplate to expose outputs for multiple systems. (Most people use
`flake-utils` for this, no specific reason that I don't.)

Next, I add an input for [oxalica/rust-overlay][1], which is an overlay that --
among other things -- makes it easier to leverage an existing
`rust-toolchain.toml` file in order to specify the desired versions of the Rust
tools. I pinned its input to match my nixpkgs version:

```nix
inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.05";
    rust-overlay = {
        url = "github:oxalica/rust-overlay";
        inputs.nixpkgs.follows = "nixpkgs";
    };
};
```

Next, I did the *easy* part, by making a dev shell that includes the version of
cargo specified by `rust-toolchain.toml`, by adding the following (I have
ommitted some context for the sake of brevity; the full final file is at the
bottom of the post):

```nix
let
    pkgs = import nixpkgs {
        inherit system;
        overlays = [(import rust-overlay)];
    };
    toolchain = (
        pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml
    );
in
    devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
            pkgs.cargo-espflash
            toolchain
        ];
    };
```

This allows me to:

```console
$ git add flake.nix
$ nix develop
$ # show that cargo is being provided by nix:
$ type -p cargo
/nix/store/5sdglskvfpv67kw2hcp8pnkvk7w5d4rl-rust-default-1.72.0-nightly-2023-06-25/bin/cargo
$ # cargo has the expected version:
$ cargo --version
cargo 1.72.0-nightly (03bc66b55 2023-06-23)
$ cargo build
$ # nix's cargo compiles the project without errors:
$ file target/riscv32imc-unknown-none-elf/debug/http-client
target/riscv32imc-unknown-none-elf/debug/http-client: ELF 32-bit LSB executable, UCB RISC-V, RVC, soft-float ABI, version 1 (SYSV), statically linked, with debug_info, not stripped
$ # show that the espflash utility is also available
$ type -p cargo-espflash
/nix/store/yf5d1k5mdqxghpb89qfqglcxqs4ksx0n-cargo-espflash-1.7.0/bin/cargo-espflash
```

**Hint**: if nix gives you `error: getting status of... default.nix': No such
file or directory`, when there *clearly* is a `default.nix`, it probably means
that you're working in a git repo (which we are) but haven't added that file;
try `git add default.nix` (or whatever the file is) and run the nix command
again.

Cool, it worked!

This is *probably* good enough for most intents and purposes, at it should
provide a reproducible Rust / cargo toolchain (and the espflash utility used to
flash the code onto the esp32). One simply has to `nix develop` and they should
be dropped into a shell environment with all of the required tools, and that
environment should be reproducible in the future.

However, I've seen that nix also includes tooling for building a Rust package
directly with the likes of `buildRustPackage`. Recommended reading:

- <https://nixos.wiki/wiki/Rust>
- [https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/rust.section.md][5]

I wanted to explore this approach as well, and this is where things got a
little hairy.

To start, I added a `default.nix` with the following contents:

```nix
{
  lib,
  rustPlatform,
  name,
}: (rustPlatform.buildRustPackage
  {
    inherit name;
    src = lib.cleanSource ./.;
  })
```

and I added the following to my `flake.nix`:

```nix
packages.${system}.default = pkgs.callPackage ./. {
    inherit ((builtins.fromTOML (builtins.readFile ./Cargo.toml)).package) name;
};
```

For anyone less familiar with nix, this pulls the `name` attribute from
`Cargo.toml` and passes it to `default.nix` using the `callPackage` pattern.
`pkgs.callPackage` is not required in this case but is a handy pattern in
general because nix automatically resolves input dependencies that are
available attributes of `pkgs` (in this case `rustPlatform`) but
also allows for passing in dependencies manually. This allows me to pass in
`name` (which is not an attribute of `pkgs`), or I could also override
`rustPlatform` if desired. When one has *dozens* of inputs it can be
particularly handy, as one can override a single one of them while letting the
remainder be resolved automatically to their defaults. Also, `default.nix` --
as its name suggests -- is picked up automatically by `callPackage ./.`, but I
could have named it `foo.nix` and used `callPackage ./foo.nix`.

Let's see where this gets us:

```console
$ nix build
error: getting status of '/nix/store/s9af3f3j2lz0sa9l3n6d2lsxhngyqq96-source/intro/http-client/default.nix': No such file or directory
$ # whups, see my hint above
$ git add default.nix
$ nix build
error: cargoSha256, cargoHash, cargoVendorDir, or cargoLock must be set
```

Ok, so nix wants me to point it to a `Cargo.lock` file so it can ensure that
all of the Rust dependencies are reproducible. Thankfully we should still have
one hanging around from the `cargo build --target=...` step above. (If not
you'll need to re-run that step.) Add the following to `default.nix`:

```nix
cargoLock.lockFile = ./Cargo.lock;
```

One *might* also need to add `Cargo.lock` to git at this point, but in this
case it's already being tracked. Sometimes it is `.gitignore`d in which case
one might choose to `git add -f Cargo.lock`.

Next error:

```console
$ nix build
error: No hash was found while vendoring the git dependency esp-wifi-0.1.0. You can add
       a hash through the `outputHashes` argument of `importCargoLock`:

       outputHashes = {
         "esp-wifi-0.1.0" = "<hash>";
       };

       If you use `buildRustPackage`, you can add this attribute to the `cargoLock`
       attribute set.
```

Ok, so let's change the `cargoLock` part to the following, knowing that we'll
get an error about an invalid hash (the error message will tell us the correct
value to fill in):

```nix
cargoLock = {
    lockFile = ./Cargo.lock;
    outputHashes = {
        "esp-wifi-0.1.0" = "";
    };
};
```

```console
$ nix build
error: hash mismatch in fixed-output derivation '/nix/store/c0icjxbnwfhbw2w0pk5vd4dcw9p6irpr-esp-wifi-b54310e.drv':
         specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
            got:    sha256-IUkX3inbeeRZk9q/mdg56h+qft+0/TVpOM4rCKNOwz8=
```

Ok, let's fill that in:

```nix
cargoLock = {
    lockFile = ./Cargo.lock;
    outputHashes = {
        "esp-wifi-0.1.0" = "sha256-IUkX3inbeeRZk9q/mdg56h+qft+0/TVpOM4rCKNOwz8=";
    };
};
```

This time we get a different error:

```console
$ nix build
      > error: "/nix/store/8sindl6wnv2s5z1zwvq0rkffacicx80d-rustc-1.69.0/lib/rustlib/src/rust/Cargo.lock" does not exist, unable to build with the standard library, try:
       >         rustup component add rust-src
```

Now this one left me scratching my head for a little while, because I knew that
the esp-rs team had conveniently put the `rust-src` dependency in our
`rust-toolchain.toml` for us:

```console
$ cat rust-toolchain.toml
[toolchain]
channel = "nightly-2023-06-25"
components = ["rust-src"]
targets = ["riscv32imc-unknown-none-elf"]
```

Eventually I realized that the version numbers didn't add up: note the
`rustc-1.69.0` here as opposed to `rust-default-1.72.0-nightly` above. So
clearly one issue is that the toolchain from the `oxalica` override is *not*
being used. Which makes sense, because we're using nix's default
`rustPlatform`.

After reading the nix + Rust links above a few more times, I noticed [this
section][6] on building Rust nightly with `buildRustPackage`, which refers to
the `makeRustPlatform` function and thankfully uses the `oxalica` overlay in
its example! Taking from there, I added an additional variable to `flake.nix`:

```nix
rustPlatform = pkgs.makeRustPlatform {
    rustc = toolchain;
    cargo = toolchain;
};
```

and, lower in the same file, I used this to pass it as the `rustPlatform` input
to `default.nix`:

```nix
packages.${system}.default = pkgs.callPackage ./. {
    inherit ((builtins.fromTOML (builtins.readFile ./Cargo.toml)).package) name;
    inherit rustPlatform;
};
```

Now, I got a new error:

```console
$ nix build
error: no matching package named `addr2line` found
```

Here, I eventually came across [this related post][7] in the NixOS Discourse
that has a suggested workaround. Essentially, certain packages that are
required by the `rust-std` feature need to be downloaded (at build time), which
`cargo` usually takes care of. However, the "purity" of nix builds disallows
network access\*, so this step fails. Instead, one needs to manually specify
these dependencies in `Cargo.toml`, and apparently the `dev-dependencies` is
the proper section for this (perhaps because they are required to build the
build tooling, not to build the crate itself -- let me know if this is way off
base).

\* At least outside of explicit downloads with tools like `pkgs.fetchurl`,
which also require a `hash` to verify that the resulting download's contents
are exactly correct.

One way to add these to `Cargo.toml` is via `cargo add`, which should result in
two new lines at the bottom:

```console
$ cargo add --dev addr2line
$ tail -2 Cargo.toml
[dev-dependencies]
addr2line = "0.21.0"
```

Re-running `nix build` at this point gave me a slightly different error:

```console
> error: failed to select a version for the requirement `addr2line = "^0.19.0"` (locked to 0.19.0)
> candidate versions found which didn't match: 0.21.0
```

I eventually sorted out that I needed to pin that exact version by editing
`Cargo.toml` adding an `=` just before the version number:

```diff
[dev-dependencies]
addr2line = "=0.19.0"
```

Interestingly, upon re-running `nix build`, I got the *exact same error*:

```
> error: failed to select a version for the requirement `addr2line = "^0.19.0"` (locked to 0.19.0)
> candidate versions found which didn't match: 0.21.0
```

I eventually realized that the change I made to `Cargo.toml` wasn't reflected
in `Cargo.lock`; for that, I needed to run `cargo update`. After a `cargo
update` and another attempt at building, I see an error also discussed in that
thread:

```
$ cargo update && nix build
...
> error: no matching package named `compiler_builtins` found
```

Here we'll repeat the same procedure:

1. `cargo add --dev compiler_builtins`
1. `cargo update && nix build`
1. If there is an error about the version, pin it by modifying the respective
   line in `Cargo.toml` from `compiler_builtins = "some_version_number"` to
   `compiler_builtins = "=other_version_number"` (don't forget the extra `=`),
   where `other_version_number` is taken from `(locked to ...)` in the error
   message.
1. `cargo update && nix build` again, evaluate for new error message

I then repeated this process a fair number of times and eventually made it to a
dependency that *wouldn't* work:

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
error: failed to select a version for the requirement `hermit-abi = "=0.3.0"`
candidate versions found which didn't match: 0.3.3, 0.3.2, 0.2.6, ...
location searched: crates.io index
required by package `http-client v0.1.0 (/Users/n8henrie/git/no_std-training/intro/http-client)`
perhaps a crate was updated and forgotten to be re-vendored?
```

I eventually navigated to <https://crates.io/crates/hermit-abi/versions> and
found that the `0.3.0` version we need has been **yanked**. *Ugh*.

I tried looking at the documentation for [`patch`ing dependencies][8], but I
couldn't find an obvious way to override the version of an intermediate
dependency. Eventually I gave up and changed the version of the toolchain
in `rust-toolchain.toml` (I found that `nightly-2023-08-23` worked).
Unfortunately, this also means that I had to delete all those
`dev-dependencies` and start again, since these are additional dependencies
required to build Rust's build tools (I think).

Many rounds of `cargo update && nix build` later, I came across a new error:

```console
   > LLVM ERROR: Global variable '_start_rust' has an invalid section specifier '.init.rust': mach-o section specifier requires a segment and section separated by a comma.
       > error: could not compile `esp-riscv-rt` (lib)
       > warning: build failed, waiting for other jobs to finish...
       > LLVM ERROR: Global variable '__EXTERNAL_INTERRUPTS' has an invalid section specifier '.trap.rodata': mach-o section specifier requires a segment and section separated by a comma.
```

At this point, I figured that the error was related to the fact that I wasn't
cross-compiling at all, something I had noticed in the build logs earlier in
the process:

```
++ env CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ cargo build -j 8 --target aarch64-apple-darwin --frozen --release
```

Here's the same command split into separate lines for readability:

```
++ env \
  CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc \
  CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ \
  CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc \
  CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ \
  cargo build \
  -j 8 \
  --target aarch64-apple-darwin \
  --frozen \
  --release
```

If you'll look carefull at that long incantation, you'll see `--target
aarch64-apple-darwin`. When building with `cargo`, we were able to lean on
`./.cargo/config.toml`, conveniently provided by the esp-rs team, which sets a
default build target. Nix apparently doesn't take that into account and is
building for the host system architecture.

It seems that the nix way to cross-compile Rust for other architectures is
**not** by setting cargo's `--target` directly (although it seems like
previously this was the case, but no longer). Instead, one is expected to use
the usual nix cross-compilation strategy of [setting a `crossSystem` with the
desired config][9]. Here is the example from that link:

```nix
import <nixpkgs> {
  crossSystem = (import <nixpkgs/lib>).systems.examples.armhf-embedded // {
    rustc.config = "thumbv7em-none-eabi";
  };
}
```

I thought this seemed easy enough and set about trying to figure out the right
combination. Cargo specifies the target as `riscv32imc-unknown-none-elf`, so
one can search the available nix-provided examples by looking at
[lib/systems/examples.nix](https://github.com/NixOS/nixpkgs/blob/cdb6bfeab9e1e24091e289c2fea3cf40a007cc78/lib/systems/examples.nix),
or by using the following command to search for examples containing `riscv`:

```console
$ nix eval --json \
        --apply builtins.attrNames \
        nixpkgs#lib.systems.examples |
    jq -r .[] |
    grep -i riscv
riscv32
riscv32-embedded
riscv64
riscv64-embedded
```

`riscv32-embedded` sounds pretty promising, right? Let's change `flake.nix` to
use this cross system for `rustPlatform`:

```nix
rustPlatform = let
    pkgsCross = import nixpkgs {
        inherit system;
        crossSystem =
            lib.systems.examples.riscv32-embedded
            // {
                rustc.config = "riscv32imc-unknown-none-elf";
            };
        };
    in
        pkgsCross.makeRustPlatform
        {
            rustc = toolchain;
            cargo = toolchain;
        };
```

This gets us a new error:

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
error: builder for '/nix/store/szli9axz1hgswa0b9k3327pl506hmhi6-http-client-riscv32-none-elf.drv' failed with exit code 101;
       last 10 log lines:
       > error[E0432]: unresolved import `core::sync::atomic::AtomicUsize`
       >   --> /private/tmp/nix-build-http-client-riscv32-none-elf.drv-0/cargo-vendor-dir/atomic-waker-1.1.2/src/lib.rs:27:5
       >    |
       > 27 | use core::sync::atomic::AtomicUsize;
       >    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ no `AtomicUsize` in `sync::atomic`
       >
       >    Compiling managed v0.8.0
       > For more information about this error, try `rustc --explain E0432`.
       > error: could not compile `atomic-waker` (lib) due to previous error
       > warning: build failed, waiting for other jobs to finish...
       For full logs, run 'nix log /nix/store/szli9axz1hgswa0b9k3327pl506hmhi6-http-client-riscv32-none-elf.drv'.
```

At this point I did a lot of reading about nix cross-compiling, including some
[excellent
comments](https://github.com/oxalica/rust-overlay/pull/58#issuecomment-970100892)
and [a few
examples](https://github.com/oxalica/rust-overlay/blob/master/examples/cross-aarch64/shell.nix)
by Oxalica, but there were few results for this *exact* error. [This
thread](https://github.com/espressif/rust-esp32-example/issues/3) is relevant
and has some notes from one of the main esp-rs developers (@MabezDev on
GitHub), but seemed to be about compiling `std`, and this is a `no_std`
project. Taking a second look at the log output (again split into separate
lines for readability):

```
++ env \
    CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc \
    CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ \
    CC_riscv32imc-unknown-none-elf=/nix/store/lasmnmwpszbyv8xambkxyhyvwi3164w2-riscv32-none-elf-stage-final-gcc-wrapper-12.2.0/bin/riscv32-none-elf-cc \
    CXX_riscv32imc-unknown-none-elf=/nix/store/lasmnmwpszbyv8xambkxyhyvwi3164w2-riscv32-none-elf-stage-final-gcc-wrapper-12.2.0/bin/riscv32-none-elf-c++ \
    cargo build \
    -j 8 \
    --target riscv32imc-unknown-none-elf \
    --frozen \
    --release
```

It looks like the `target` is being set correctly, but in true `nix` cross
compilation fashion it looked like it might also be using a cross-compiled
version of the compiler (based on the `CC_*` variables). That seems
unnecessary, since we've already proven that an `aarch64-darwin` compiled
toolchain can do the heavy lifting of cross compilation, we're just trying to
set the desired `--target`.

I browsed `nixpkgs` until I found [where it seems to be setting `--target` in
the `cargo` call][10], which sets it to `rustTargetPlatformSpec`. This, in
turn, is being set to `rust.toRustTargetSpec stdenv.hostPlatform` [here][11].
`toRustTargetSpec` is defined [here][12] as the following:

```nix
toRustTarget = platform: let
    inherit (platform.parsed) cpu kernel abi;
    cpu_ = platform.rustc.platform.arch or {
      "armv7a" = "armv7";
      "armv7l" = "armv7";
      "armv6l" = "arm";
      "armv5tel" = "armv5te";
      "riscv64" = "riscv64gc";
    }.${cpu.name} or cpu.name;
    vendor_ = toTargetVendor platform;
  in platform.rustc.config
    or "${cpu_}-${vendor_}-${kernel.name}${lib.optionalString (abi.name != "unknown") "-${abi.name}"}";

toRustTargetSpec = platform:
    if platform ? rustc.platform
    then builtins.toFile (toRustTarget platform + ".json") (builtins.toJSON platform.rustc.platform)
    else toRustTarget platform;
```

So for the case at hand, I read this as:

1. Does `pkgs.stdenv.hostPlatform` have a `rustc.platform` attribute? No
   (otherwise would make a `.json` target from the platform).
2. Therefore, use `toRustTarget pkgs.stdenv.hostPlatform`.
3. Continuing in `toRustTarget`, does `pkgs.stdenv.hostPlatform` have a
   `rustc.config` attribute? Yes.
4. Therefore, use `rustc.config` (otherwise would construct a string from
   `cpu`, `vendor`, `abi`, etc.).

So it looks like `rust.config` may be all that's required to set the
`--target`. Let's try the following:

```nix
rustPlatform = let
    pkgsCross = import nixpkgs {
        inherit system;
        rustc.config = "riscv32imc-unknown-none-elf";
    };
in
    pkgsCross.makeRustPlatform
    {
        rustc = toolchain;
        cargo = toolchain;
    };
```

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
error: builder for '/nix/store/9w5m6wb7di7br2ar3wy5a9kcrc6dizj3-http-client.drv' failed with exit code 101;
       last 10 log lines:
       >    Compiling enumset v1.1.2
       >    Compiling managed v0.8.0
       >    Compiling atomic-waker v1.1.2
       >    Compiling bitflags v1.3.2
       >    Compiling no-std-net v0.5.0
       > LLVM ERROR: Global variable '_start_rust' has an invalid section specifier '.init.rust': mach-o section specifier requires a segment and section separated by a comma.
       > error: could not compile `esp-riscv-rt` (lib)
       > warning: build failed, waiting for other jobs to finish...
       > LLVM ERROR: Global variable '__EXTERNAL_INTERRUPTS' has an invalid section specifier '.trap.rodata': mach-o section specifier requires a segment and section separated by a comma.
       > error: could not compile `esp32c3` (lib)
       For full logs, run 'nix log /nix/store/9w5m6wb7di7br2ar3wy5a9kcrc6dizj3-http-client.drv'.
```

Well, now we're back to an error we've seen before, when we were compiling for
the wrong architecture. Sure enough, glancing through the log, we're back to
`--target aarch64-apple-darwin` -- a step in the wrong direction. Let's put the
`crossSystem` back:

```nix
rustPlatform = let
    pkgsCross = import nixpkgs {
        inherit system;
        crossSystem = {
            inherit system;
            rustc.config = "riscv32imc-unknown-none-elf";
        };
    };
in
    pkgsCross.makeRustPlatform
    {
        rustc = toolchain;
        cargo = toolchain;
    };
```

This gets us to our next error. Progress!

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
error: builder for '/nix/store/2fp9fkha1qjnand2xwrrair8jg86ml65-http-client-aarch64-apple-darwin.drv' failed with exit code 101;
       last 10 log lines:
       > error: environment variable `PASSWORD` not defined at compile time
       >   --> src/main.rs:26:24
       >    |
       > 26 | const PASSWORD: &str = env!("PASSWORD");
       >    |                        ^^^^^^^^^^^^^^^^
       >    |
       >    = help: use `std::env::var("PASSWORD")` to read the variable at run time
       >    = note: this error originates in the macro `env` (in Nightly builds, run with -Z macro-backtrace for more info)
       >
       > error: could not compile `http-client` (bin "http-client") due to 2 previous errors
       For full logs, run 'nix log /nix/store/2fp9fkha1qjnand2xwrrair8jg86ml65-http-client-aarch64-apple-darwin.drv'.
```

Looking through the build logs, the `cargo build` seems to be doing what we had
hoped; I see an `aarch64-darwin` toolchain and a `riscv32` target:

```
++ env \
    CC_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/cc \
    CXX_aarch64-apple-darwin=/nix/store/p72lcp92djj8xpdjm27rjrrxznjjgvyi-clang-wrapper-11.1.0/bin/c++ \
    CC_riscv32imc-unknown-none-elf=/nix/store/py4adxsy9vzdgb7qlqv570wdc9rsayhf-aarch64-apple-darwin-clang-wrapper-11.1.0/bin/aarch64-apple-darwin-cc \
    CXX_riscv32imc-unknown-none-elf=/nix/store/py4adxsy9vzdgb7qlqv570wdc9rsayhf-aarch64-apple-darwin-clang-wrapper-11.1.0/bin/aarch64-apple-darwin-c++ \
    cargo build \
    -j 8 \
    --target riscv32imc-unknown-none-elf \
    --frozen \
    --release
```

The new error is one I actually understand (for once): the `esp-rs` authors
have the project configured to read the wifi credentials from the build
environment at compile time with the `env!` macro. When comiling with `cargo`,
we can just export these in the build environment, but `nix build`
intentionally cleans impurities (like the build environment), so it won't be
able to see these by default. I don't know of any way to configure the runtime
environment on the esp32, so I don't think we can use the compiler's suggestion
(using `std::env::var`). Instead, we know that `nix` will generally pass along
values that are set in a `mkDerivation` call as environment variables, so we'll
just try setting some dummy values in `default.nix`, to see if that allows the
build to proceed:

```
SSID = "foo";
PASSWORD = "bar";
```

**NB**: Like basically everything else in `nix`, these will get built into a
derivation in `/nix/store` that is **world readable**. Passwords and other
secrets in nix are [an entire
topic](https://nixos.wiki/wiki/Comparison_of_secret_managing_schemes) on its
own. For the moment, just know that this route of setting the wifi credentails
will make them discoverable by anyone with read access to your device. I
believe this would still be the case if using `builtins.getEnv` + `--impure`
instead of building it into the derivation.

That was a pretty easy fix, and successfully leads us to our next error:

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
error: builder for '/nix/store/p2gp7hl5xnddn3w8snn6dfpbzrj9dyfd-http-client-aarch64-apple-darwin.drv' failed with exit code 101;
       last 10 log lines:
       >   = note: second definition in `core` loaded from /nix/store/cjc6j5r11wqmdkp6f5mcbrzb938rg9dw-rust-std-1.74.0-nightly-2023-08-23-riscv32imc-unknown-none-elf/lib/rustlib/riscv32imc-unknown-none-elf/lib/libcore-68e03c5be2ffebdc.rlib
       >
       > error[E0152]: duplicate lang item in crate `core` (which `alloc` depends on): `CStr`.
       >   |
       >   = note: the lang item is first defined in crate `core` (which `twox_hash` depends on)
       >   = note: first definition in `core` loaded from /private/tmp/nix-build-http-client-aarch64-apple-darwin.drv-0/source/target/riscv32imc-unknown-none-elf/release/deps/libcore-dc12a78182d2c0a4.rmeta
       >   = note: second definition in `core` loaded from /nix/store/cjc6j5r11wqmdkp6f5mcbrzb938rg9dw-rust-std-1.74.0-nightly-2023-08-23-riscv32imc-unknown-none-elf/lib/rustlib/riscv32imc-unknown-none-elf/lib/libcore-68e03c5be2ffebdc.rlib
       >
       > For more information about this error, try `rustc --explain E0152`.
       > error: could not compile `twox-hash` (lib) due to 121 previous errors
       For full logs, run 'nix log /nix/store/p2gp7hl5xnddn3w8snn6dfpbzrj9dyfd-http-client-aarch64-apple-darwin.drv'.
```

``duplicate lang item in crate `core` `` -- what's that all about? I found a few
GitHub issues and SO posts that didn't give me much insight (or hope), but
you're welcome to peruse:

- <https://github.com/rust-lang/wg-cargo-std-aware/issues/56>
- <https://github.com/rust-lang/rust/issues/115963>
- <https://stackoverflow.com/questions/59388952/how-to-solve-substrate-duplicate-lang-item-in-crate-std-which-myexternalcra>

Thankfully, I eventually found [this SO
post](https://stackoverflow.com/questions/63961435/cargo-test-fails-for-arduino-targets-with-duplicate-lang-item-in-crate)
which linked to [this
comment](https://github.com/Rahix/avr-hal/issues/71#issuecomment-695108184),
talking about how `cargo test` for embedded targets perhaps didn't make much
sense (yet). By default, `nix` generally tries to test everything it can prior
to saying that "everything compiled fine", so it would make sense that perhaps
it was running `cargo test` and having trouble there. Sure enough, digging
deeper through the log:

```
++ cargo test -j 8 --release --target riscv32imc-unknown-none-elf --frozen -- --test-threads=8
   Compiling stable_deref_trait v1.2.0
   Compiling thiserror-core v1.0.38
   Compiling crc32fast v1.3.2
   Compiling thiserror-core-impl v1.0.38
   Compiling static_assertions v1.1.0
   Compiling adler v1.0.2
   Compiling memchr v2.5.0
   Compiling cpp_demangle v0.4.3
error[E0463]: can't find crate for `std`
  |
  = note: the `riscv32imc-unknown-none-elf` target may not support the standard library
  = note: `std` is required by `stable_deref_trait` because it does not declare `#![no_std]`
  = help: consider building the standard library from source with `cargo build -Zbuild-std`
```

What happens if we just disable the tests, by adding `doCheck = false;` to
`default.nix`?

```console
$ cargo update && nix build
    Updating crates.io index
    Updating git repository `https://github.com/esp-rs/esp-wifi/`
$ echo $?
0
$ file result/bin/http-client
result/bin/http-client: ELF 32-bit LSB executable, UCB RISC-V, RVC, soft-float ABI, version 1 (SYSV), statically linked, with debug_info, not stripped
```

Holy cow, a successful build. But does it work?

Running `espflash flash` seems to connect and tell us which serial port to use,
but needs us to specify the firmware file:

```console
$ nix develop --command espflash flash
New version of espflash is available: v2.0.1

Serial port: /dev/tty.usbserial-1110
Connecting...

Chip type:         ESP32-C3 (revision 3)
Crystal frequency: 40MHz
Flash size:        4MB
Features:          WiFi
MAC address:       84:f7:03:39:f1:cc
Error:
  × No such file or directory (os error 2)
```

Adding the file and specifying `--monitor` seems to work, and gives us some
output that confirms it's running!

```console
$ nix develop --command espflash --monitor ./result/bin/http-client
New version of espflash is available: v2.0.1

Serial port: /dev/tty.usbserial-1110
Connecting...

Chip type:         ESP32-C3 (revision 3)
Crystal frequency: 40MHz
Flash size:        4MB
Features:          WiFi
MAC address:       84:f7:03:39:f1:cc
App/part. size:    516368/4128768 bytes, 12.51%
[00:00:01] ########################################      12/12      segment 0x0
[00:00:00] ########################################       1/1       segment 0x8000
[00:00:31] ########################################     269/269     segment 0x10000
Flashing has completed!
Commands:
    CTRL+R    Reset chip
    CTRL+C    Exit

ESP-ROM:esp32c3-api1-20210207
Build:Feb  7 2021
rst:0x1 (POWERON),boot:0xc (SPI_FAST_FLASH_BOOT)
SPIWP:0xee
mode:DIO, clock div:1
load:0x3fcd6100,len:0x172c
load:0x403ce000,len:0x928
0x403ce000 - .L17
    at ??:??
load:0x403d0000,len:0x2ce0
0x403d0000 - .L17
    at ??:??
entry 0x403ce000
0x403ce000 - .L17
    at ??:??
I (30) boot: ESP-IDF v4.4-dev-2825-gb63ec47238 2nd stage bootloader
I (30) boot: compile time 12:10:40
I (30) boot: chip revision: 3
I (33) boot_comm: chip revision: 3, min. bootloader chip revision: 0
I (41) boot.esp32c3: SPI Speed      : 80MHz
I (45) boot.esp32c3: SPI Mode       : DIO
I (50) boot.esp32c3: SPI Flash Size : 4MB
I (55) boot: Enabling RNG early entropy source...
I (60) boot: Partition Table:
I (64) boot: ## Label            Usage          Type ST Offset   Length
I (71) boot:  0 nvs              WiFi data        01 02 00009000 00006000
I (78) boot:  1 phy_init         RF data          01 01 0000f000 00001000
I (86) boot:  2 factory          factory app      00 00 00010000 003f0000
I (93) boot: End of partition table
I (98) boot_comm: chip revision: 3, min. application chip revision: 0
I (105) esp_image: segment 0: paddr=00010020 vaddr=3c060020 size=125f8h ( 75256) map
I (125) esp_image: segment 1: paddr=00022620 vaddr=3fc84588 size=01214h (  4628) load
I (126) esp_image: segment 2: paddr=0002383c vaddr=3fc9d958 size=00168h (   360) load
I (130) esp_image: segment 3: paddr=000239ac vaddr=40380000 size=04584h ( 17796) load
I (142) esp_image: segment 4: paddr=00027f38 vaddr=00000000 size=080e0h ( 32992)
I (152) esp_image: segment 5: paddr=00030020 vaddr=42000020 size=5e0c0h (385216) map
I (215) boot: Loaded app from partition at offset 0x10000
I (215) boot: Disabling RNG early entropy source...
Wi-Fi set_configuration returned Ok(())
Is wifi started: Ok(true)
Start Wifi Scan
AccessPointInfo { ssid: "REDACTED", bssid: [...], channel: 6, secondary_channel: None, signal_strength: -43, protocols: EnumSet(), auth_method: WPAWPA2Personal }
AccessPointInfo { ssid: "REDACTED2", bssid: [...], channel: 6, secondary_channel: None, signal_strength: -85, protocols: EnumSet(), auth_method: None }
Ok(EnumSet(Client | AccessPoint))
Wi-Fi connect: Ok(())
Wait to get connected
Disconnected
```

Finally, we can add one more convenience to our `flake.nix` by moving our
definition of `name` up a layer and defining a default `app` that does the
flashing:

```nix
apps.${system}.default = let
    flash = pkgs.writeShellApplication {
        name = "flash-${name}";
        runtimeInputs = [pkgs.cargo-espflash];
        text = ''
            espflash --monitor ${self.packages.${system}.default}/bin/${name}
        '';
    };
in {
    type = "app";
    program = "${flash}/bin/flash-${name}";
};
```

With this in place, a simple `nix run` builds and flashes! (For the below, I've
put proper values into the `SSID` and `PASSWORD`.)

```console
$ nix run
New version of espflash is available: v2.0.1

Serial port: /dev/tty.usbserial-1110
Connecting...

Chip type:         ESP32-C3 (revision 3)
Crystal frequency: 40MHz
Flash size:        4MB
Features:          WiFi
MAC address:       84:f7:03:39:f1:cc
App/part. size:    516448/4128768 bytes, 12.51%
[00:00:01] ########################################      12/12      segment 0x0
[00:00:00] ########################################       1/1       segment 0x8000
[00:00:32] ########################################     269/269     segment 0x10000
Flashing has completed!
Commands:
    CTRL+R    Reset chip
    CTRL+C    Exit

ESP-ROM:esp32c3-api1-20210207
Build:Feb  7 2021
rst:0x1 (POWERON),boot:0xc (SPI_FAST_FLASH_BOOT)
SPIWP:0xee
mode:DIO, clock div:1
load:0x3fcd6100,len:0x172c
load:0x403ce000,len:0x928
0x403ce000 - .L17
    at ??:??
load:0x403d0000,len:0x2ce0
0x403d0000 - .L17
    at ??:??
entry 0x403ce000
0x403ce000 - .L17
    at ??:??
I (30) boot: ESP-IDF v4.4-dev-2825-gb63ec47238 2nd stage bootloader
I (30) boot: compile time 12:10:40
I (30) boot: chip revision: 3
I (33) boot_comm: chip revision: 3, min. bootloader chip revision: 0
I (41) boot.esp32c3: SPI Speed      : 80MHz
I (45) boot.esp32c3: SPI Mode       : DIO
I (50) boot.esp32c3: SPI Flash Size : 4MB
I (55) boot: Enabling RNG early entropy source...
I (60) boot: Partition Table:
I (64) boot: ## Label            Usage          Type ST Offset   Length
I (71) boot:  0 nvs              WiFi data        01 02 00009000 00006000
I (78) boot:  1 phy_init         RF data          01 01 0000f000 00001000
I (86) boot:  2 factory          factory app      00 00 00010000 003f0000
I (93) boot: End of partition table
I (98) boot_comm: chip revision: 3, min. application chip revision: 0
I (105) esp_image: segment 0: paddr=00010020 vaddr=3c060020 size=125f8h ( 75256) map
I (125) esp_image: segment 1: paddr=00022620 vaddr=3fc84588 size=01214h (  4628) load
I (126) esp_image: segment 2: paddr=0002383c vaddr=3fc9d958 size=00168h (   360) load
I (130) esp_image: segment 3: paddr=000239ac vaddr=40380000 size=04584h ( 17796) load
I (142) esp_image: segment 4: paddr=00027f38 vaddr=00000000 size=080e0h ( 32992)
I (152) esp_image: segment 5: paddr=00030020 vaddr=42000020 size=5e11ch (385308) map
I (215) boot: Loaded app from partition at offset 0x10000
I (215) boot: Disabling RNG early entropy source...
Wi-Fi set_configuration returned Ok(())
Is wifi started: Ok(true)
Start Wifi Scan
AccessPointInfo { ssid: "REDACTED1", bssid: [...], channel: 6, secondary_channel: None, signal_strength: -39, protocols: EnumSet(), auth_method: WPA2Personal }
AccessPointInfo { ssid: "REDACTED2", bssid: [...], channel: 6, secondary_channel: None, signal_strength: -39, protocols: EnumSet(), auth_method: WPAWPA2Personal }
AccessPointInfo { ssid: "REDACTED3", bssid: [...], channel: 11, secondary_channel: None, signal_strength: -81, protocols: EnumSet(), auth_method: WPA2Personal }
Ok(EnumSet(Client | AccessPoint))
Wi-Fi connect: Ok(())
Wait to get connected
Ok(true)
Wait to get an ip address
got ip Ok(IpInfo { ip: 192.168.1.123, subnet: Subnet { gateway: 192.168.1.4, mask: Mask(24) }, dns: Some(192.168.1.4), secondary_dns: None })
Start busy loop on main
Making HTTP request
HTTP/1.0 200 OK
X-Cloud-Trace-Context: b3a2f08c40d782146364b65262968b33
Server: Google Frontend
Content-Length: 335
Date: Tue, 26 Sep 2023 16:49:18 GMT
Expires: Tue, 26 Sep 2023 16:59:18 GMT
Cache-Control: public, max-age=600
ETag: "uJJDjQ"
Content-Type: text/html
Age: 0
<!DOCTYPE html>
<html>
<head>
    <title>Nothing here</title>
</head>
<body>
<pre>
    __________________________
    < Hello fellow Rustaceans! >
     --------------------------
            \
             \
                _~^~^~_
            \) /  o o  \ (/
              '_   -   _'
              / '-----' \
</pre>
</body>
</html>
```

Phew, well that was a lot of work, but with any luck it's work we should only
have to do *once*, and going forward the same project should -- theoretically,
if done from the same archtecture -- continue to compile and continue to flash,
no matter how much time passes before returning to tinker.

As I'm sure is obvious, I'm no expert in Rust, embedded systems, electronics,
or nix, so if you have suggestions for improvement, I'd love to hear about it
in the comments section.

I'm not going to bother making a GitHub repo for these, since they require
pinning specific versions of so many dependencies (which will likely be
outdated or unrelated to your specific project), but below you can reference
the final version of the relevant files. That's all for now!

`rust-toolchain.toml`:

```toml
[toolchain]
channel = "nightly-2023-08-23"
components = ["rust-src"]
targets = ["riscv32imc-unknown-none-elf"]
```

`Cargo.toml`:

```toml
[package]
name = "http-client"
version = "0.1.0"
authors = ["Sergio Gasquez <sergio.gasquez@gmail.com>"]
edition = "2021"
license = "MIT OR Apache-2.0"
# TODO: Explain
resolver = "2"

# TODO: Explain
[profile.release]
# Explicitly disable LTO which the Xtensa codegen backend has issues
lto = "off"
opt-level = 3
[profile.dev]
lto = "off"

[dependencies]
hal             = { package = "esp32c3-hal", version = "0.12.0" }
esp-backtrace   = { version = "0.8.0", features = ["esp32c3", "panic-handler", "exception-handler", "print-uart"] }
esp-println     = { version = "0.6.0", features = ["esp32c3", "log"] }
esp-wifi        = { git = "https://github.com/esp-rs/esp-wifi/", features = ["esp32c3", "wifi-logs", "wifi"], rev = "e7140fd35852dadcd1df7592dc149e876256348f" }
smoltcp = { version = "0.10.0", default-features=false, features = ["proto-igmp", "proto-ipv4", "socket-tcp", "socket-icmp", "socket-udp", "medium-ethernet", "proto-dhcpv4", "socket-raw", "socket-dhcpv4"] }
embedded-svc = { version = "0.25.0", default-features = false, features = [] }
embedded-io = "0.4.0"
heapless = { version = "0.7.14", default-features = false }

[dev-dependencies]
compiler_builtins = "=0.1.100"
addr2line = "0.21.0"
allocator-api2 = "=0.2.15"
dlmalloc = "0.2.4"
fortanix-sgx-abi = "0.5.0"
getopts = "0.2.21"
hermit-abi = "=0.3.2"
libc = "=0.2.147"
miniz_oxide = "0.7.1"
object = "=0.32.0"
rustc-demangle = "0.1.23"
wasi = "0.11.0"
cc = "=1.0.79"
memchr = "=2.5.0"
unicode-width = "=0.1.10"
```

```nix
{
  description = "Flake to accompany https://n8henrie.com/2023/09/compiling-rust-for-the-esp32-with-nix/";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.05";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
  }: let
    inherit (nixpkgs) lib;
    systems = ["aarch64-darwin" "x86_64-linux" "aarch64-linux"];
    systemClosure = attrs:
      builtins.foldl' (acc: system:
        lib.recursiveUpdate acc (attrs system)) {}
      systems;
  in
    systemClosure (
      system: let
        inherit ((builtins.fromTOML (builtins.readFile ./Cargo.toml)).package) name;
        pkgs = import nixpkgs {
          inherit system;
          overlays = [(import rust-overlay)];
        };
        toolchain = (
          pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml
        );
        rustPlatform = let
          pkgsCross = import nixpkgs {
            inherit system;
            crossSystem = {
              inherit system;
              rustc.config = "riscv32imc-unknown-none-elf";
            };
          };
        in
          pkgsCross.makeRustPlatform
          {
            rustc = toolchain;
            cargo = toolchain;
          };
      in {
        packages.${system}.default = pkgs.callPackage ./. {
          inherit name rustPlatform;
        };

        devShells.${system}.default = pkgs.mkShell {
          buildInputs = [
            pkgs.cargo-espflash
            toolchain
          ];
        };

        apps.${system}.default = let
          flash = pkgs.writeShellApplication {
            name = "flash-${name}";
            runtimeInputs = [pkgs.cargo-espflash];
            text = ''
              espflash --monitor ${self.packages.${system}.default}/bin/${name}
            '';
          };
        in {
          type = "app";
          program = "${flash}/bin/flash-${name}";
        };
      }
    );
}
```

`default.nix`:

```nix
{
  lib,
  rustPlatform,
  name,
}: (rustPlatform.buildRustPackage
  {
    inherit name;
    src = lib.cleanSource ./.;
    cargoLock = {
      lockFile = ./Cargo.lock;
      outputHashes = {
        "esp-wifi-0.1.0" = "sha256-IUkX3inbeeRZk9q/mdg56h+qft+0/TVpOM4rCKNOwz8=";
      };
    };
    SSID = "foo";
    PASSWORD = "bar";
    doCheck = false;
  })
```

Currently working versions of the flake inputs:

```console
$ nix flake metadata
Resolved URL:  git+file:///Users/n8henrie/git/no_std-training?dir=intro%2fhttp-client
Locked URL:    git+file:///Users/n8henrie/git/no_std-training?dir=intro%2fhttp-client
Description:   Flake to accompany https://n8henrie.com/2023/09/compiling-rust-for-the-esp32-with-nix/
Path:          /nix/store/dr1pc7kzsal5ndzwgj0lgypkr7fyvsiy-source
Last modified: 2023-09-18 00:51:10
Inputs:
├───nixpkgs: github:nixos/nixpkgs/43257a0d289e9f3fd5e3ad0dd022e911d9781a37
└───rust-overlay: github:oxalica/rust-overlay/23224b680af0b27b320adec2a0dae4eef29350e6
    ├───flake-utils: github:numtide/flake-utils/cfacdce06f30d2b68473a46042957675eebb3401
    │   └───systems: github:nix-systems/default/da67096a3b9bf56a91d16901293e51ba5b49a27e
    └───nixpkgs follows input 'nixpkgs'
```

Finally, as noted above, I used `esp-rs/no_std-training` at commit
`88bc692d81dfcf9491c80dc7c9e8601b702e465a`. If at some point this repo (or
`esp-wifi`) are taken down, I've made forks available at e.g.
[github.com/n8henrie/esp-wifi](https://github.com/n8henrie/esp-wifi).

[0]: https://github.com/n8henrie/flake-templates/blob/274e5d613b0c4b9de4089b3db18126bcc29ea7a4/trivial/flake.nix
[1]: https://github.com/oxalica/rust-overlay
[2]: https://github.com/esp-rs/esp-wifi/blob/b54310ece09141d116c94f64ff8559810c64b6be/examples.md?plain=1#L5
[4]: https://github.com/esp-rs/no_std-training/blob/88bc692d81dfcf9491c80dc7c9e8601b702e465a/intro/http-client/examples/http-client.rs
[5]: https://github.com/NixOS/nixpkgs/blob/05a907557826942cdf601c96d3dea0e8d4924491/doc/languages-frameworks/rust.section.md
[6]: https://github.com/NixOS/nixpkgs/blob/05a907557826942cdf601c96d3dea0e8d4924491/doc/languages-frameworks/rust.section.md#using-rust-nightly-in-a-derivation-with-buildrustpackage-using-rust-nightly-in-a-derivation-with-buildrustpackage
[7]: https://discourse.nixos.org/t/build-rust-app-using-cargos-build-std-feature-with-naersk-fails-because-rust-src-is-missing/13161/4
[8]: https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html
[9]: https://github.com/NixOS/nixpkgs/blob/15047c5ec025a693bea60a17b5305a68424d9e93/doc/languages-frameworks/rust.section.md#cross-compilation-cross-compilation
[10]: https://github.com/NixOS/nixpkgs/blob/ef8f77d411558688ffa2ec7a11671139f50a7913/pkgs/build-support/rust/hooks/cargo-build-hook.sh#L39
[11]: https://github.com/NixOS/nixpkgs/blob/5e05bf13858a4240d99190b9fd651a25b696c651/pkgs/build-support/rust/hooks/default.nix#L29
[12]: https://github.com/NixOS/nixpkgs/blob/5e05bf13858a4240d99190b9fd651a25b696c651/pkgs/build-support/rust/lib/default.nix#L57
