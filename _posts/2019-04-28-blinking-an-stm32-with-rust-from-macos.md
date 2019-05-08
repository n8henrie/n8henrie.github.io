---
title: Blinking an STM32 with Rust from MacOS
date: 2019-04-28T16:07:45-06:00
author: n8henrie
layout: post
permalink: /2019/04/blinking-an-stm32-with-rust-from-macos/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- electronics
- IoT
- Mac OSX
- arduino
- rust
---
**Bottom Line:** I blinked an LED in Rust.
<!--more-->
I've been increasingly enthusiastic about Mozilla's new open source programming
language [Rust](https://www.rust-lang.org/) over the last year or so. There is
lots to read about the reasons that different people like rust, so I'll spare
you the details, but I think it's exciting that even an amateur like myself can
enjoy such a powerful, fast, and safe language.

One of the many promising things about Rust is its potential for safer and more
ergonomic low-level programming [in the embedded
world](https://www.rust-lang.org/what/embedded); I've been keeping a casual eye
on progress here as a tinkerer that really don't know much C++ (and so my
[Arduino and ATMEGA328p
adventures](https://n8henrie.com/2015/03/range-testing-for-wireless-arduino-projects-rf-433-mhz-and-nrf24l01/) tend to be pretty tame).

Recently, a quick glance through a [thread on
r/rust](https://www.reddit.com/r/rust/comments/aw8bwt/question_hardware_for_easy_start_in_embedded_rust/)
(which has been one of several examples of Rust's unusually welcoming
community) suggested that the [STM32 boards][2] were a good way for a beginner
to get started in embedded rust, so I picked one up.

I found a [*really* great "hello world" walkthrough][1] that took me most of
the way. Much of it has been copied verbatim below, though a few steps are
slightly different, and linked post has much more information about the steps
being taken, so I highly recomend you read through it. I've also put a basic
framework up as a git repo at
[github.com/n8henrie/rust-stm32](https://github.com/n8henrie/rust-stm32); it
already has the memory file, `.cargo/config`, and `Cargo.toml` as well as the
basic `main.rs`; once dependencies are installed, if you clone it you should be
able to `cargo build` get a binary you can use. The step below essentially walk
you through making your own identical repo, (like the author of the linked
blog post has also done [here](https://gitlab.com/jounathaen/stm32_blink)).

Requirements:
- [STM32 bluepill][2]
- [FTDI](https://amzn.to/2DVQuZv) for programming it (which seems to work fine
  instead of an ST-Link)
- Working rust setup (including `rustup` and `cargo`, I'm on rust 1.34.1)

Step by step:

1. `cargo install cargo-binutils` and `rustup component add llvm-tools-preview`
   to get the `cargo objcopy` commands [cargo-binutils
   repo](https://github.com/rust-embedded/cargo-binutils)
1. `rustup target add thumbv7m-none-eabi` (note this is `7m` and not `7em`,
   which may be a typo in the how-to post linked above)
1. make a new crate: `cargo new rust-stm32 && cd rust-stm32`
1. edit `Cargo.toml` to match [this
   example](https://github.com/n8henrie/rust-stm32/blob/master/Cargo.toml)
1. make `memory.x` as instructed
   [here](https://docs.rs/cortex-m-rt/0.6.8/cortex_m_rt/):
    ```console
    $ cat > memory.x <<EOF
    /* Linker script for the STM32F103C8T6 */
    MEMORY
    {
    FLASH : ORIGIN = 0x08000000, LENGTH = 64K
    RAM : ORIGIN = 0x20000000, LENGTH = 20K
    }
    EOF
    ```
1. Add to `./.cargo/config`:
    ```toml
    [build]
    # Instruction set of Cortex-M3 (used in BluePill)
    target = "thumbv7m-none-eabi"

    rustflags = [
    # use the Tlink.x script from the cortex-m-rt crate
    "-C", "link-arg=-Tlink.x",
    ]
    ```
1. make `src/main.rs`:
    - Example: <https://github.com/n8henrie/rust-stm32/blob/master/src/main.rs>
    - My STM was already blinking a few times per second by default, so
      consider changing the delay by an order of magnitude to make sure your
      code is being executed
1. `cargo build --release`
1. `cargo objcopy -- -O binary target/thumbv7m-none-eabi/release/rust-stm32
   rust-stm32.bin`
1. Build `stm32loader` to flash the code to the STM32 from MacOS:
    1. Clone repo: `git clone https://github.com/florisla/stm32loader.git`
    1. `cd stm32loader`
    1. Make venv: `python3 -m venv .venv`
    1. Source venv: `source ./.venv/bin/activate`
    1. Update pip to >= 19.1.1 `pip install --upgrade pip`
    1. Install in editable mode: `pip install -e .`
1. Connect the (unplugged) FTDI to the STM32 (as a mnemonic, remember "Tx to
   Ten", and also make sure your FTDI is set to 3.3v)

    FTDI|STM32
    ---|---
    TX|A10
    RX|A9
    3V|3V
    GND|GND
1. Move the jumper for BOOT0 (the one closer to edge of board) from 0 to 1
   (3.3v)
1. Flash the program: `stm32loader -p /dev/tty.usb1 -e -w -v
   /path/to/rust-stm32.bin`, where flags are for port, erase, write, and verify
1. If it looks like it flashed correctly, disconnect it, move BOOT0 back to 0 /
   off, reconnect power, and see if you have a blinking light!

Links:

- <https://jonathanklimt.de/electrics/programming/rust-STM32F103-blink>
- <https://github.com/florisla/stm32loader>

[1]: https://jonathanklimt.de/electrics/programming/rust-STM32F103-blink/
[2]: https://amzn.to/2JohIeU
