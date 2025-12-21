---
title: "Nix: Debugging MacOS / Darwin Sandbox Issues"
date: 2025-12-21T08:30:12-07:00
author: n8henrie
layout: post
permalink: /2025/12/nix-debugging-macos-darwin-sandbox-issues/
categories:
- tech
excerpt: "Filtering the macos logs for sandbox violations can help flesh out the root cause of sandbox-related crashes when building with nix."
tags:
- debugging
- Mac OSX
- MacOS
- nix
---
**Bottom Line:** Filtering the macos logs for sandbox violations can help flesh out the root cause of sandbox-related crashes when building with nix.
<!--more-->

I recently started getting some unexpected build failures when trying to rebuild my `nix-darwin` system:

```
$ nix build -v --print-build-logs github:nixos/nixpkgs/2bdc7039afa38f4330de69360a817e11f7e2f2c5#mpv-unwrapped
...
mpv> buildPhase completed in 38 seconds
mpv> Running phase: installPhase
mpv> mesonInstallPhase flags: ''
mpv> Installing mpv.1 to /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man/share/man/man1
mpv> Installing libmpv.2.dylib to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib
mpv> Installing mpv to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/include/mpv/client.h to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/include/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/include/mpv/render.h to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/include/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/include/mpv/render_gl.h to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/include/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/include/mpv/stream_cb.h to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/include/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/build/meson-private/mpv.pc to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib/pkgconfig
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/input.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mplayer-input.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/restore-old-bindings.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/restore-osc-bindings.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv.bash-completion to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/bash-completion/completions
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/_mpv.zsh to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/zsh/site-functions
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv.fish to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/fish/vendor_completions.d
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv.metainfo.xml to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/metainfo
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/encoding-profiles.conf to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/etc/mpv
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-icon-8bit-16x16.png to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/16x16/apps
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-icon-8bit-32x32.png to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/32x32/apps
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-icon-8bit-64x64.png to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/64x64/apps
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-icon-8bit-128x128.png to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/128x128/apps
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-gradient.svg to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/scalable/apps
mpv> Installing /nix/var/nix/builds/nix-58338-1051359316/source/etc/mpv-symbolic.svg to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/icons/hicolor/symbolic/apps
mpv> Installing symlink pointing to libmpv.2.dylib to /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib/libmpv.dylib
mpv> /nix/var/nix/builds/nix-58338-1051359316/source/TOOLS /nix/var/nix/builds/nix-58338-1051359316/source/build
mpv> /nix/var/nix/builds/nix-58338-1051359316/source/build
mpv> Running phase: fixupPhase
mpv> Moving /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc to /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc/share/doc
mpv> Moving /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib/pkgconfig to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib/pkgconfig
mpv> Patching '/nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib/pkgconfig/mpv.pc' includedir to output /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev
mpv> checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0...
mpv> patching script interpreter paths in /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0
mpv> /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/umpv: interpreter directive changed from "#!/usr/bin/env python3" to "/nix/store/xcjk9ill54kjk8mzgq6yydnx9015lidg-python3-3.13.9/bin/python3"
mpv> /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv_identify.sh: interpreter directive changed from "#!/bin/sh" to "/nix/store/19zw2r9dl44wk3j5ncwsk743zr9fc584-bash-interactive-5.3p3/bin/sh"
mpv> stripping (with command strip and flags -S) in  /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/Applications
mpv> checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev...
mpv> patching script interpreter paths in /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev
mpv> stripping (with command strip and flags -S) in  /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib
mpv> checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc...
mpv> patching script interpreter paths in /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc
mpv> checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man...
mpv> gzipping man pages under /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man/share/man/
mpv> patching script interpreter paths in /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man
mpv> Running phase: installCheckPhase
mpv> Executing versionCheckPhase
mpv> Did not find version 0.40.0 in the output of the command /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --help
mpv>
mpv> Did not find version 0.40.0 in the output of the command /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --version
mpv>
error: Cannot build '/nix/store/y75gpq7cpspdlj0pyz7vz2dza8p8vrfb-mpv-0.40.0.drv'.
       Reason: builder failed with exit code 2.
       Output paths:
         /nix/store/0k1fix2idrk4jwvq8m1l8sx6sqqrqc6v-mpv-0.40.0-dev
         /nix/store/261j9ny9h3vjd7654wc388j9jibhi9xv-mpv-0.40.0-man
         /nix/store/j4k3k512157c73falxnqshmqa35whxg6-mpv-0.40.0-doc
         /nix/store/jndgs2x8g080032gma77ikcbw4vrp2bx-mpv-0.40.0
       Last 25 log lines:
       > /nix/var/nix/builds/nix-58338-1051359316/source/TOOLS /nix/var/nix/builds/nix-58338-1051359316/source/build
       > /nix/var/nix/builds/nix-58338-1051359316/source/build
       > Running phase: fixupPhase
       > Moving /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/share/doc to /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc/share/doc
       > Moving /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib/pkgconfig to /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib/pkgconfig
       > Patching '/nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib/pkgconfig/mpv.pc' includedir to output /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev
       > checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0...
       > patching script interpreter paths in /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0
       > /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/umpv: interpreter directive changed from "#!/usr/bin/env python3" to "/nix/store/xcjk9ill54kjk8mzgq6yydnx9015lidg-python3-3.13.9/bin/python3"
       > /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv_identify.sh: interpreter directive changed from "#!/bin/sh" to "/nix/store/19zw2r9dl44wk3j5ncwsk743zr9fc584-bash-interactive-5.3p3/bin/sh"
       > stripping (with command strip and flags -S) in  /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/lib /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/Applications
       > checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev...
       > patching script interpreter paths in /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev
       > stripping (with command strip and flags -S) in  /nix/store/xbv4gki5sms5zcx592dnb8n8sirylpqv-mpv-0.40.0-dev/lib
       > checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc...
       > patching script interpreter paths in /nix/store/lzr5jj41d40378vwvpix0lw5mp8vf8lz-mpv-0.40.0-doc
       > checking for references to /nix/var/nix/builds/nix-58338-1051359316/ in /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man...
       > gzipping man pages under /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man/share/man/
       > patching script interpreter paths in /nix/store/fpvji1dkf6ciql0icyc4fa7rab8k5zvb-mpv-0.40.0-man
       > Running phase: installCheckPhase
       > Executing versionCheckPhase
       > Did not find version 0.40.0 in the output of the command /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --help
       >
       > Did not find version 0.40.0 in the output of the command /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --version
       >
       For full logs, run:
         nix log /nix/store/y75gpq7cpspdlj0pyz7vz2dza8p8vrfb-mpv-0.40.0.drv
```

It was especially unusual because the build phase itself seemed to succeed, only the version check (which had been recently added [by this commit][1]) appeared to be failing:

```
> Did not find version 0.40.0 in the output of the command /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --version
```

(NB: if one has already successfully built a package the `checkPhase` doesn't re-run, so it may be necesarry to add the `--rebuild` flag to reproduce this error.)

The `versionCheckHook` essentially just runs your binary with `--help` and then `--version` and looks for the specified package version in the stdout or stderr of either of those.
Oddly, using that exact path and command seemed to work fine outside of the build environment, and indeed shows `0.40.0` in the output:

```
$ /nix/store/6jdaccxf7ic245vvqslcd28imkwikzn8-mpv-0.40.0/bin/mpv --version
mpv v0.40.0 Copyright © 2000-2025 mpv/MPlayer/mplayer2 projects
 built on Jan  1 1980 00:00:00
libplacebo version: v7.351.0
FFmpeg version: 8.0
FFmpeg library versions:
   libavcodec      62.11.100
   libavdevice     62.1.100
   libavfilter     11.4.100
   libavformat     62.3.100
   libavutil       60.8.100
   libswresample   6.1.100
   libswscale      9.1.100
```

Digging a litle deeper, I added `set -x` to the `preVersionCheck` step in the package to get some debugging output.
It seemed to be getting no output at all:

```
+++++ env --chdir=/ --argv0=mpv --ignore-environment /nix/store/0d1f4drwi4ikcmgjwn9asral2a4cbf3m-mpv-0.40.0/bin/mpv --version
+++++ true
++++ versionOutput=
```

Changing the `preVersionCheck` to this:

```nix
preVersionCheck = ''
  set -x

  $out/bin/mpv --version
'';
```

revealed mpv to be crashing completely:

```
mpv> +++++ /nix/store/grzyi5fn7wv5d5v0hc8fbhh3r5zrmzjm-mpv-0.40.0/bin/mpv --version
mpv> /nix/store/dnjd7b7v5vyd8g152ziivp2jaz56bb5l-stdenv-darwin/setup: line 288: 96459 Abort trap: 6
```

I initially suspected this might be a `codesign`ing issue, since these often cause headaches on macos machines.
However, I eventually tried building with `--option sandbox relaxed` and then `--option sandbox false` and found that disabling the sandbox completely let the version check pass, confirming this to be fundamentally a sandbox issue.

I have some basic familiarity with the macos sandbox thanks to [this issue][2].
In the context of nix builds, the sandbox allows one to disallow access to anything outside the nix build environment (including network access, filesystem access, etc.).
This helps ensure that nix builds aren't "polluted" by a user's specific environment and helps ensure that builds are reproducible in other contexts.

Additionally, I remember having learned that macos *used to* have an option to `trace` the sandbox execution and help users figure out what was failing, but that this functionality [no longer exists][3].
I also remembered that `nix` spits out its sandbox configuration if one builds with debug mode; using the `nix` command that means `--debug`.
Using `nix-build` I had thought one could see the sandbox profile with `-vvvv` (4 `v`s) or maybe `NIX_DEBUG=4`, but I have to admit it's not working for me right now (please comment if you know how to get `nix-build` to spit out a sandbox profile).

Using the `--debug` flag to see this output (and `--rebuild` in my case, since I had previously built successfully):

```console
$ nix build --rebuild --debug .#mpv-unwrapped 2>&1 | tee mpv-debug.log
...
sandbox setup: Generated sandbox profile:
sandbox setup: (version 1)
sandbox setup: (deny default (with no-log))
sandbox setup:
sandbox setup:
sandbox setup: (define TMPDIR (param "_GLOBAL_TMP_DIR"))
sandbox setup:
sandbox setup: (deny default)
sandbox setup:
sandbox setup: ; Disallow creating setuid/setgid binaries, since that
sandbox setup: ; would allow breaking build user isolation.
sandbox setup: (deny file-write-setugid)
...
```

As we can see, each line seems to be prefixed with `sandbox setup: `, and `Generated sandbox profile:` lets us know where the interesting stuff starts.
A little `awk` should help us strip this out (I "cached" the output to `mpv-debug.log` so I could tinker without having to wait for a rebuild each time):

```console
$ awk < mpv-debug.log \
  -v header='Generated sandbox profile:' \
  -v leader='sandbox setup: ' \
  '
    flag && $0 ~ "^" leader { sub(leader, ""); print }
    $0 ~ header { flag=1 }
  ' |
  tee mpv.sb
$ head mpv.sb
(version 1)
(deny default (with no-log))
(define TMPDIR (param "_GLOBAL_TMP_DIR"))
(deny default)
; Disallow creating setuid/setgid binaries, since that
; would allow breaking build user isolation.
(deny file-write-setugid)
; Allow forking.
(allow process-fork)
; Allow reading system information like #CPUs, etc.
$ tail mpv.sb
        (literal "/nix/store")
  (literal "/nix/var")
    (literal "/nix/var/nix")
        (literal "/nix/var/nix/builds")
 (literal "/private")
    (literal "/private/var")
        (literal "/usr")
        (literal "/usr/lib")
    (literal "/usr/lib/system")
)
```

Now that we have a sandbox profile, we can run a command in the context of this profile using `sandbox-exec -f mpv.sb`:
Unfortunately we see that the command fails, with a fairly unhelpful message:

```console
$ sandbox-exec -f mpv.sb /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/bin/mpv --version
sandbox-exec: invalid data type of path filter; expected pattern, got boolean
```

I eventually I sorted out that there are some required parameters that must be passed in, including `_GLOBAL_TMP_DIR`, `_NIX_BUILD_TOP`, and `_ALLOW_LOCAL_NETWORKING`:

```
$ rg '\bparam\b' mpv.sb
3:(define TMPDIR (param "_GLOBAL_TMP_DIR"))
29:       (subpath (param "_NIX_BUILD_TOP")))
38:(if (param "_ALLOW_LOCAL_NETWORKING")
```

These can be specified via `-D param=val`, and I think `_ALLOW_LOCAL_NETWORKING` can be left empty (which should evaluate to `#f` / false).
Wrapping this up in a script for convenience:

```bash
#!/usr/bin/env bash
# sandbox.sh

set -Eeuf -o pipefail
set -x

main() {
  sandbox-exec \
    -D _GLOBAL_TMP_DIR="${TMPDIR}" \
    -D _NIX_BUILD_TOP="${TMPDIR}" \
    -f mpv.sb \
    /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv --version
}
main "$@"
```

Running this script gives us the same `Abort trap: 6` we saw earlier:

```console
$ ./sandbox.sh
+ main
++ mktemp -d
++ mktemp -d
+ sandbox-exec -D _GLOBAL_TMP_DIR=/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.8LoLZufaEe -D _NIX_BUILD_TOP=/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.YUT5GARrUD -f mpv.sb /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv --version
./sandbox.sh: line 6: 95518 Abort trap: 6              sandbox-exec -D _GLOBAL_TMP_DIR="$(mktemp -d)" -D _NIX_BUILD_TOP="$(mktemp -d)" -f mpv.sb /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv --version
```

Progress!

(NB: In some cases I imagine it may be helpful to run `nix build` with the `--keep-failed` flag, search the output for the build directory, then specify this as `_NIX_BUILD_TOP`.)

Now that we have an example sandbox profile and can reproduce the error, it's time to sort out what is missing in the sandbox to allow successful execution of `mpv --version`.
One can always use `Console.app` to get an idea, but I find that the command line version fits my workflow better, which are `log stream` (or `log show --last 1h` for reviewing historical logs).

Unfortunately, the log is *very* busy.
Naively piping its output to `rg` helped me find a promising line to help me set up a filter:

```console
$ log stream --info --debug | rg sandbox
...
2025-12-21 09:58:24.425558-0700 0x1093f84  Debug       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] begin container id: 17384080, type: thread container
...
```

The example in `log help predicates` was really helpful in setting up a filter to match this output:

```console
$ log help predicates
...
 log fields corresponding to a log line:
       2024-05-30 08:40:15.980893-0400 0x26166c   Default     0x0                  90092  0    log: (libxpc.dylib)   [com.apple.xpc:connection]
     [0x6000007081e0] activating connection: mach=true listener=false peer=false name=com.apple.logd.admin

       where

       '2024-05-30 08:40:15.980893-0400' == date
       '0x26166c' == threadIdentifier
       'Default' == logType
       '90092' == processIdentifier
       'log' == process
       'libxpc.dylib' == sender
       'com.apple.xpc' == subsystem
       'connection' == category
       'activating connection[...]' == composedMessage
```

Using that as an example, I found this to work fairly well:

```console
$ log stream --info --debug --predicate '(process == "sandboxd") && (subsystem == "com.apple.sandbox.reporting") && (category == "violation")'
```

Running this in one window and then executing my `sandbox.sh` script in another, I get a lot of output from the violations:


```
Failed to symbolicate: NULL symbolicator
2025-12-21 10:01:59.712321-0700 0x1095684  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96060) deny(1) mach-lookup com.apple.CoreServices.coreservicesd
Process:         mpv [96060]
Path:            /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv
Load Address:    0
Identifier:      io.mpv
Version:         ??? (0.40.0)
Code Type:       unknown (Native)
Parent Process:  bash [96057]
Responsible:     /Applications/Nix Apps/Alacritty.app/Contents/MacOS/alacritty
User ID:         501

Date/Time:       2025-12-21 10:01:59.712 MST
OS Version:      macOS 26.2 (25C56)
Release Type:    User
Report Version:  8

MetaData: {"operation":"mach-lookup","responsible-process-sdk":918528,"sandbox_checker":"launchd","signing-id":"mpv","mach_namespace":1,"build":"macOS 26.2 (25C56)","target":"com.apple.CoreServices.coreservicesd","profile-in-collection":false,"hardware":"J614c","uid":501,"platform-binary":false,"translated":false,"primary-filter":"global-name","policy-description":"Sandbox","parent-process-name":"bash","platform_binary":"no","primary-filter-value":"com.apple.CoreServices.coreservicesd","responsible-process-path":"\/Applications\/Nix Apps\/Alacritty.app\/Contents\/MacOS\/alacritty","flags":5,"action":"deny","checker":"launchd","process_path":["nix","store","iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0","Applications","mpv.app","Contents","MacOS","mpv"],"binary-in-trust-cache":false,"apple-internal":false,"process-path":"\/nix\/store\/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0\/Applications\/mpv.app\/Contents\/MacOS\/mpv","normalized_target":["com.apple.CoreServices.coreservicesd"],"profile-flags":0,"global-name":"com.apple.CoreServices.coreservicesd","responsible-process-signing-id":"alacritty","platform-policy":false,"pid":96060,"checker-pid":1,"summary":"deny(1) mach-lookup com.apple.CoreServices.coreservicesd","errno":1,"parent-process-pid":96057,"process":"mpv","release-type":"User"}

Failed to symbolicate: NULL symbolicator
2025-12-21 10:01:59.712538-0700 0x1095684  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96060) deny(1) mach-lookup com.apple.DiskArbitration.diskarbitrationd
Process:         mpv [96060]
Path:            /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv
Load Address:    0
Identifier:      io.mpv
Version:         ??? (0.40.0)
Code Type:       unknown (Native)
Parent Process:  bash [96057]
Responsible:     /Applications/Nix Apps/Alacritty.app/Contents/MacOS/alacritty
User ID:         501

Date/Time:       2025-12-21 10:01:59.712 MST
OS Version:      macOS 26.2 (25C56)
Release Type:    User
Report Version:  8

MetaData: {"operation":"mach-lookup","responsible-process-sdk":918528,"sandbox_checker":"launchd","signing-id":"mpv","mach_namespace":1,"build":"macOS 26.2 (25C56)","target":"com.apple.DiskArbitration.diskarbitrationd","profile-in-collection":false,"hardware":"J614c","uid":501,"platform-binary":false,"translated":false,"primary-filter":"global-name","policy-description":"Sandbox","parent-process-name":"bash","platform_binary":"no","primary-filter-value":"com.apple.DiskArbitration.diskarbitrationd","responsible-process-path":"\/Applications\/Nix Apps\/Alacritty.app\/Contents\/MacOS\/alacritty","flags":5,"action":"deny","checker":"launchd","process_path":["nix","store","iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0","Applications","mpv.app","Contents","MacOS","mpv"],"binary-in-trust-cache":false,"apple-internal":false,"process-path":"\/nix\/store\/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0\/Applications\/mpv.app\/Contents\/MacOS\/mpv","normalized_target":["com.apple.DiskArbitration.diskarbitrationd"],"profile-flags":0,"global-name":"com.apple.DiskArbitration.diskarbitrationd","responsible-process-signing-id":"alacritty","platform-policy":false,"pid":96060,"checker-pid":1,"summary":"deny(1) mach-lookup com.apple.DiskArbitration.diskarbitrationd","errno":1,"parent-process-pid":96057,"process":"mpv","release-type":"User"}

Failed to symbolicate: NULL symbolicator
```

NB: I found several times that `log stream` would have **no output** the second or third time I ran `sandbox.sh`; I suspect there is some filtering for "duplicate lines" happening.
Waiting a minute or two and running again (with no changes) worked for me, YMMV.

Now we can use something like `rg` (or `grep` would be fine) to further filter results; lines containing `deny(1)` look particularly promising:

```console
$ log stream --info --debug --predicate '(process == "sandboxd") && (subsystem == "com.apple.sandbox.reporting") && (category == "violation")' |
  rg 'sandboxd:.*violation.*deny\(1\)'

2025-12-21 10:13:59.160033-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.logd
2025-12-21 10:13:59.187779-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.system.notification_center
2025-12-21 10:13:59.188426-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.pasteboard.1
2025-12-21 10:13:59.188789-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.distributed_notifications@Uv3
2025-12-21 10:13:59.189289-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.tccd.system
2025-12-21 10:13:59.189640-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.windowserver.active
2025-12-21 10:13:59.189994-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.CoreServices.coreservicesd
2025-12-21 10:13:59.190377-0700 0x1099e49  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96654) deny(1) mach-lookup com.apple.DiskArbitration.diskarbitrationd
```

Now we can see pretty specifically *what* is being denied, which are a number of `mach-lookup`s (not an out-of-sandbox `file-read` like I had suspected).
Lacking a sharper tool, at this point I searched our sandbox profile for a `mach-lookup` line, of which there was only one match:

```console
$ rg mach-lookup mpv.sb
21:(allow mach-lookup (global-name "com.apple.system.opendirectoryd.libinfo"))
```

Because order generally matters in these firewall-ish matters, I thought it would be best to modify the script *just after* this line.
I matched this format and added the corresponding lines from our logged violations:

```scheme
(allow mach-lookup (global-name "com.apple.logd"))
(allow mach-lookup (global-name "com.apple.system.notification_center"))
(allow mach-lookup (global-name "com.apple.pasteboard.1"))
(allow mach-lookup (global-name "com.apple.distributed_notifications@Uv3"))
(allow mach-lookup (global-name "com.apple.tccd.system"))
(allow mach-lookup (global-name "com.apple.windowserver.active"))
(allow mach-lookup (global-name "com.apple.CoreServices.coreservicesd"))
(allow mach-lookup (global-name "com.apple.DiskArbitration.diskarbitrationd"))
```

Running `sandbox.sh` again at this point showed two new violations:

```
2025-12-21 10:19:07.327764-0700 0x1099c8f  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96921) deny(1) mach-lookup com.apple.coreservices.launchservicesd
2025-12-21 10:19:07.328418-0700 0x1099c8f  Error       0x0                  601    0    sandboxd: [com.apple.sandbox.reporting:violation] Sandbox: mpv(96921) deny(1) mach-lookup com.apple.CARenderServer
```

I added `allow`s for these as well:

```scheme
(allow mach-lookup (global-name "com.apple.coreservices.launchservicesd"))
(allow mach-lookup (global-name "com.apple.CARenderServer"))
```

Lo and behold, `sandbox.sh` now works!

```console
$ ./sandbox.sh
+ main
++ mktemp -d
++ mktemp -d
+ sandbox-exec -D _GLOBAL_TMP_DIR=/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.ky3oo6TxVE -D _NIX_BUILD_TOP=/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.9YOoyXB3cd -f mpv.sb /nix/store/iq7mr3dxkq09cg851dzhnlkvb34wcf4k-mpv-0.40.0/Applications/mpv.app/Contents/MacOS/mpv --version
mpv v0.40.0 Copyright © 2000-2025 mpv/MPlayer/mplayer2 projects
 built on Jan  1 1980 00:00:00
libplacebo version: v7.351.0
FFmpeg version: 8.0
FFmpeg library versions:
   libavcodec      62.11.100
   libavdevice     62.1.100
   libavfilter     11.4.100
   libavformat     62.3.100
   libavutil       60.8.100
   libswresample   6.1.100
   libswscale      9.1.100
```

I wasn't sure if *all* of these allows were *really* required, so next I manually deleted each of them from the sandbox profile, eventually finding that the only one required is:

```scheme
(allow mach-lookup (global-name "com.apple.coreservices.launchservicesd"))
```

After a little rummaging around, I found that one can modify the sandbox environment for a package like so:

```nix
sandboxProfile = lib.optionalString stdenv.hostPlatform.isDarwin ''
  (allow mach-lookup (global-name "com.apple.coreservices.launchservicesd"))
'';
```

This then allows a successful build if one specifies `--option sandbox relaxed`.
I wrapped this up in a [PR][4] which was merged.
Phew!

[0]: https://github.com/NixOS/nixpkgs/issues/471058
[1]: https://github.com/NixOS/nixpkgs/commit/fc94594b8988535c2a05cba03be54602adf0eb85
[2]: https://github.com/NixOS/nix/issues/4119
[3]: https://stackoverflow.com/questions/56703697/how-to-sandbox-third-party-applications-when-sandbox-exec-is-deprecated-now
[4]: https://github.com/NixOS/nixpkgs/pull/472452
