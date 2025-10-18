---
title: "Nix: Why Does My System Depend on $PKG?"
date: 2025-10-12T08:04:59-07:00
author: n8henrie
layout: post
permalink: /2025/10/nix-why-does-my-system-depend-on-pkg/
categories:
- tech
excerpt: "`nix why-depends --derivation /run/current-system` and `nix derivation show --recursive /run/current-system` are handy."
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html | sk --layout=reverse -m | pbcopy
tags:
- MacOS
- nix
---
**Bottom Line:** `nix why-depends --derivation /run/current-system` and `nix derivation show --recursive /run/current-system` are handy.
<!--more-->

NixOS and nix-darwin users -- especially those following unstable -- will be familiar with the situation of `nixos-rebuild` or `darwin-rebuild` failure due to breakage in a dependency.
(Said user will hopefully also be *grateful* that this failure prevents them from switching into a system with a broken dependency!)
Once this situation is encountered, there are a few reasonable approaches, including but not limited to:

- Do nothing.
  Patiently wait with your existing system, grateful that it has been prevented from switching into a broken state.
  Hope that the issue is eventually fixed, or fix it yourself.
  - In this case, I strongly recommend searching the [nixpkgs issues][0] and either subscribing to the existing issue, or opening a new one if you're sure it hasn't been reported
- If the package isn't particularly critical, remove the broken package from your system closure so your system upgrade can complete.
- Use an overlay to pin the broken package to a working version so your system upgrade can complete while keeping a working (but possibly outdated) version of the package.

To some degree, all of these options rely on knowing what package is broken, which can be surprisingly hard to determine.
Sometimes it is obvious based on the error message.
Other times, the broken package may be a transitive dependency of your system's direct dependency; while this *is* spelled out in the same error message, it can be tough to pick out sometimes.

As an example, my aarch64-darwin system is currently unable to build.
Here is what I see:

```
$ darwin-rebuild build --flake .
building the system configuration...
error: builder for '/nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv' failed with exit code 1;
       last 25 log lines:
       > current directory: /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/gems/nokogiri-1.16.0/ext/nokogiri
       > make DESTDIR\= sitearchdir\=./.gem.20251015-88848-9l6020 sitelibdir\=./.gem.20251015-88848-9l6020
       > compiling gumbo.c
       > In file included from gumbo.c:30:
       > In file included from ./nokogiri.h:77:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby.h:38:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/ruby.h:28:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/arithmetic.h:24:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/arithmetic/char.h:29:
       > /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/core/rstring.h:398:24: warning: default initialization of an object of type 'struct RString' with const member leaves the object uninitialized [-Wdefault-const-init-field-unsafe]
       >   398 |         struct RString retval;
       >       |                        ^
       > /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/core/rbasic.h:88:17: note: member 'klass' declared 'const' here
       >    88 |     const VALUE klass;
       >       |                 ^
       > gumbo.c:32:10: fatal error: 'nokogiri_gumbo.h' file not found
       >    32 | #include "nokogiri_gumbo.h"
       >       |          ^~~~~~~~~~~~~~~~~~
       > 1 warning and 1 error generated.
       > make: *** [Makefile:248: gumbo.o] Error 1
       >
       > make failed, exit code 2
       >
       > Gem files will remain installed in /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/gems/nokogiri-1.16.0 for inspection.
       > Results logged to /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/extensions/arm64-darwin-24/3.3.0/nokogiri-1.16.0/gem_make.out
       For full logs, run:
         nix log /nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv
error: 1 dependencies of derivation '/nix/store/a4539sgfjbl0xqz3jx4slch2ba9d6rwg-ronn-gems.drv' failed to build
error: 1 dependencies of derivation '/nix/store/97882fyjn32cc6biar60x75fpp371566-ronn-0.10.1.drv' failed to build
error: 1 dependencies of derivation '/nix/store/gsnwdgafz7czy1ca96b2sgr095k47iq2-actionlint-1.7.7.drv' failed to build
error: 1 dependencies of derivation '/nix/store/7nvsky84fws4lc1nhkr38c2b9yyr7s9d-home-manager-applications.drv' failed to build
error: 1 dependencies of derivation '/nix/store/vlzwa0j6ljj38457whfi9ll4ay8m4krf-home-manager-fonts.drv' failed to build
error: 1 dependencies of derivation '/nix/store/m60anx6pcl18gb6wdaqpd7nxms4yizjg-home-manager-path.drv' failed to build
error (ignored): error: cannot unlink "/private/tmp/nix-build-whisper-0.6.0.drv-4/source/target/aarch64-apple-darwin/release/deps": Directory not empty
error: 1 dependencies of derivation '/nix/store/60z2q88r583368c5lgbwgn2lp9y31pwf-system-applications.drv' failed to build
error: 1 dependencies of derivation '/nix/store/3l5p89klbglv23xk3mlnjj6lrmh3kakx-system-path.drv' failed to build
error: 1 dependencies of derivation '/nix/store/ps2pykvd8866hysx82dwgqb9pkjdh33z-darwin-system-25.11.9a9ab01.drv' failed to build
```

Based on this, I can tell that `nokogiri` seems to have failed:

```
For full logs, run:
nix log /nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv
```

Based on the heirarchy of th error message, it looks like `ronn-gems`, `ronn`, `actionlint`, and some `home-manager` paths are also failing (likely as a result).
However, I'm not entirely sure exactly *how* I am depending on `nokogiri`.

Up until recently, my approach in these situations was to just `grep` (or `rg` rather) to see if any of these are explicitly included in my configuration:

```console
$ rg -t nix nokogiri ~/git/nixos
$
```

However, I have recently dug more into `nix why-depends`, and I'm pleased to report that it seems helpful here -- but not necessarily by itself.

```console
$ nix why-depends --help
nix why-depends [option...] package dependency

Examples

  · Show one path through the dependency graph leading from Hello to Glibc:

      │ # nix why-depends nixpkgs#hello nixpkgs#glibc
```

My first thought was that I should use my system (`.#darwinConfigurations.natepro.config.system.build.toplevel`) as the "dependency" and `nokogiri` as the "package", but it seems necessary for the "package" to be successfully built for `why-depends` to work; attempting to use it in this way just gives us back the same backtrace:


```
$ nix why-depends ~/git/nixos#darwinConfigurations.natepro.config.system.build.toplevel nokogiri
error: builder for '/nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv' failed with exit code 1;
       last 25 log lines:
       > current directory: /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/gems/nokogiri-1.16.0/ext/nokogiri
       > make DESTDIR\= sitearchdir\=./.gem.20251017-95545-55qfgi sitelibdir\=./.gem.20251017-95545-55qfgi
       > compiling gumbo.c
       > In file included from gumbo.c:30:
       > In file included from ./nokogiri.h:77:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby.h:38:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/ruby.h:28:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/arithmetic.h:24:
       > In file included from /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/arithmetic/char.h:29:
       > /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/core/rstring.h:398:24: warning: default initialization of an object of type 'struct RString' with const member leaves the object uninitialized [-Wdefault-const-init-field-unsafe]
       >   398 |         struct RString retval;
       >       |                        ^
       > /nix/store/5kmiw2wqmhk6y0ij77z6xpw3jddbqmii-ruby-3.3.9/include/ruby-3.3.0/ruby/internal/core/rbasic.h:88:17: note: member 'klass' declared 'const' here
       >    88 |     const VALUE klass;
       >       |                 ^
       > gumbo.c:32:10: fatal error: 'nokogiri_gumbo.h' file not found
       >    32 | #include "nokogiri_gumbo.h"
       >       |          ^~~~~~~~~~~~~~~~~~
       > 1 warning and 1 error generated.
       > make: *** [Makefile:248: gumbo.o] Error 1
       >
       > make failed, exit code 2
       >
       > Gem files will remain installed in /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/gems/nokogiri-1.16.0 for inspection.
       > Results logged to /nix/store/plibr3n8ym9d4n3v9yzlr72wsslfqfrs-ruby3.3-nokogiri-1.16.0/lib/ruby/gems/3.3.0/extensions/arm64-darwin-24/3.3.0/nokogiri-1.16.0/gem_make.out
       For full logs, run:
         nix log /nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv
error: 1 dependencies of derivation '/nix/store/a4539sgfjbl0xqz3jx4slch2ba9d6rwg-ronn-gems.drv' failed to build
error: 1 dependencies of derivation '/nix/store/97882fyjn32cc6biar60x75fpp371566-ronn-0.10.1.drv' failed to build
error: 1 dependencies of derivation '/nix/store/gsnwdgafz7czy1ca96b2sgr095k47iq2-actionlint-1.7.7.drv' failed to build
error (ignored): error: cannot unlink "/private/tmp/nix-build-time-1.9.drv-3/time-1.9": Directory not empty
error: 1 dependencies of derivation '/nix/store/baczh3ilpnzwii15r3hd1vzhnmgscdcy-home-manager-applications.drv' failed to build
error (ignored): error: cannot unlink "/private/tmp/nix-build-ffmpeg-7.1.1.drv-10": Directory not empty
error: 1 dependencies of derivation '/nix/store/1n84x1s39rmp27c2m4wg7i5rih9xq1xs-home-manager-fonts.drv' failed to build
error: 1 dependencies of derivation '/nix/store/isnjghv45qr10hdwakv86m0993phhb55-home-manager-path.drv' failed to build
error: 1 dependencies of derivation '/nix/store/n2am0d06r4bbn637v64f566zkvyki1k9-system-applications.drv' failed to build
error: 1 dependencies of derivation '/nix/store/pkkf0bsgnxfg0x1vwcgpqr676cph79gc-system-path.drv' failed to build
error: 1 dependencies of derivation '/nix/store/9wv921vl3aacjxkzm6s9ip247nhwlww1-darwin-system-25.11.9a9ab01.drv' failed to build
```

It seems that a reasonable workaround might be to use the *current* system, to see how *it* depends on nokogiri.
Thankfully the symlink at `/run/current-system` provides a handy shortcut!

```
$ readlink /run/current-system
/nix/store/735wnqlyhfx5h4l5p22cpg06463b84gq-darwin-system-25.11.9a9ab01
```

We then run into our next issue:

```
$ nix why-depends /run/current-system nokogiri
error: cannot find flake 'flake:nokogiri' in the flake registries
```

The "dependency" is not a string of a package name, looks like it needs to be a flake.
We saw `ruby3.3-nokogiri` above, so the package is likely `rubyPackages.nokogiri` or `rubyPackages_3_3.nokogiri`, but neither of these seem to work either, nor does using the path of the failing derivation:

```
$ nix why-depends /run/current-system nixpkgs#rubyPackages.nokogiri
these 9 paths will be fetched (0.72 MiB download, 4.95 MiB unpacked):
  /nix/store/2h6w1ka2q5ksnwfgw064240r3vmir32p-find-xml-catalogs-hook
  /nix/store/x06zagc5aasqd4nvjfzg6zv917v7zkvn-find-xml-catalogs-hook
  /nix/store/jf18994msibcw4z59mh2lgw2hmfavlg4-libxml2-2.14.5-dev
  /nix/store/3lq98gys6gf97z6cjpklnf9mc4s4wmyb-libxslt-1.1.43
  /nix/store/p35v975i3kx3clh4afgi7lcjnb0b5wpy-libxslt-1.1.43-bin
  /nix/store/xld92i9ps44vrdj7dcdzk4bhzaihcb6i-libxslt-1.1.43-dev
  /nix/store/6ixfg46lnzmssfj71h5rf11aspvirmc0-ruby3.3-mini_portile2-2.8.8
  /nix/store/znhn5z9z0c1i780jw54ag9rnpm92z1ln-ruby3.3-nokogiri-1.18.7
  /nix/store/bgr5q188w30w1sbc58wglnf1f8hrrmls-ruby3.3-racc-1.8.1
'/nix/store/735wnqlyhfx5h4l5p22cpg06463b84gq-darwin-system-25.11.9a9ab01' does not depend on 'flake:nixpkgs#rubyPackages.nokogiri'
$ nix why-depends /run/current-system nixpkgs#rubyPackages_3_3.nokogiri
these 9 paths will be fetched (0.72 MiB download, 4.95 MiB unpacked):
  /nix/store/2h6w1ka2q5ksnwfgw064240r3vmir32p-find-xml-catalogs-hook
  /nix/store/x06zagc5aasqd4nvjfzg6zv917v7zkvn-find-xml-catalogs-hook
  /nix/store/jf18994msibcw4z59mh2lgw2hmfavlg4-libxml2-2.14.5-dev
  /nix/store/3lq98gys6gf97z6cjpklnf9mc4s4wmyb-libxslt-1.1.43
  /nix/store/p35v975i3kx3clh4afgi7lcjnb0b5wpy-libxslt-1.1.43-bin
  /nix/store/xld92i9ps44vrdj7dcdzk4bhzaihcb6i-libxslt-1.1.43-dev
  /nix/store/6ixfg46lnzmssfj71h5rf11aspvirmc0-ruby3.3-mini_portile2-2.8.8
  /nix/store/znhn5z9z0c1i780jw54ag9rnpm92z1ln-ruby3.3-nokogiri-1.18.7
  /nix/store/bgr5q188w30w1sbc58wglnf1f8hrrmls-ruby3.3-racc-1.8.1
'/nix/store/735wnqlyhfx5h4l5p22cpg06463b84gq-darwin-system-25.11.9a9ab01' does not depend on 'flake:nixpkgs#rubyPackages_3_3.nokogiri'
$ nix why-depends /run/current-system /nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv
'/nix/store/735wnqlyhfx5h4l5p22cpg06463b84gq-darwin-system-25.11.9a9ab01' does not depend on '/nix/store/kyiywvx9mnq90f466nwwj876zbzqmc1m-ruby3.3-nokogiri-1.16.0.drv'
```

Rethinking, this makes *some* sense, as the *current* system obviously doesn't depend on the *failing* package; its build succeeded!
So if we're trying to trace the path from the *failing* dependency to the *failing* build, we would need to ask about how the *current*, successfully built system dependended on the *successful* build of its `nokogiri` (assuming that this relationship hasn't changed -- which is a load-bearing assumption).

So how do we figure out what `nokogiri` path the current system depended on?
Unfortunately just searching `/nix/store` for '.*nokogiri.*' will give us dozens (or more) of results from prior system generations and other packages, so that's out.
Luckily we can look a little deeper into our current system dependencies with `nix derivation show /run/current-system`.

Unfortunately, we are again stymied:
```
$ nix derivation show /run/current-system | rg nokogiri
$
```

No results.
I think this occurs because the current system doesn't have a *direct* dependency on nokogiri; as noted above, we haven't *explicitly* listed it anywhere.
So perhaps it is a build dependency (i.e. a dependency of a dependency).
Thankfully there is a `--recursive` flag!
This will take longer to run, but should hopefully get us to our next step:
```
$ nix derivation show --recursive /run/current-system | rg -c nokogiri
23
```

Based on its `help` page, we see that this tool outputs JSON that maps `store_path:output` where `output` is in the format described [in the nix manual][1].
```
$ nix derivation show --help | rg JSON
This command prints on standard output a JSON representation of the store
nix derivation show outputs a JSON map of store paths to derivations in the
```

Looking through this format, we could almost certainly "reimplement" `nix why-depends` by searching the `inputDrvs`, but this is slightly more effort than just finding the store paths:

```
$ nix derivation show --recursive /run/current-system | jq -r 'keys | map(select(match("nokogiri")))[]'
/nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
/nix/store/xa2icl9j5jxwx0v2fdxv3qazyv1h43m4-nokogiri-1.16.0.gem.drv
```

then putting these into `nix why-depends`:

```
$ nix why-depends /run/current-system /nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
'/nix/store/h4s1jcgfygr4mraz3lvy41iwrgzjsimr-darwin-system-25.11.9a9ab01' does not depend on '/nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv'
```

Huh, another speedbump.
We've already verified that the current system *does* at least transitively depend on this derivation.
Reading through `nix why-depends --help`, we see that it accepts a `--derivation` flag, and this seems to finally get us our answer:

```
$ nix why-depends --derivation /run/current-system /nix/store/xa2icl9j5jxwx0v2fdxv3qazyv1h43m4-nokogiri-1.16.0.gem.drv
/nix/store/2qhzzfbv4zdks9rh1j1nq405m4lifbr3-darwin-system-25.11.9a9ab01.drv
└───/nix/store/1067s8x77wnbp4x59aa9vgrdpjazjrpk-system-applications.drv
    └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
        └───/nix/store/iwnbim2kfpsx0njiczrjdbwkzppqgzpf-ronn-0.10.1.drv
            └───/nix/store/bjkr33d0dsr4am83n6ypjfazkm58my8s-ronn-gems.drv
                └───/nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
                    └───/nix/store/xa2icl9j5jxwx0v2fdxv3qazyv1h43m4-nokogiri-1.16.0.gem.drv
```

Anticlimactically, careful inspect reveals this to be essentially a cleaned-up version of the output we got from `darwin-rebuild` in the first place.
(NB: some of the store paths will have changed during the writing of this article, as I rebuilt my system before finalizing the post.)

Thankfully, with some help from the cleaner output, we can see fairly easily that the system depends on system-applications, which depends on actionlint.
Sure enough, searching our flake, we find it is directly referenced:

```console
$ rg -t nix -C3 actionlint
modules/default-packages.nix
25-      ]
26-      ++ [
27-        (pass.withExtensions (exts: [ exts.pass-otp ]))
28:        actionlint
29-        alacritty
30-        alejandra
31-        bacon
```

Unsurprisingly commenting out this line allows our system to build.

As a side-note, there is also an `--all` flag that shows other paths to the same dependency; its output looks more similar to the original output from `darwin-rebuild`:

```console
$ nix why-depends --derivation --all /run/current-system /nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
/nix/store/2qhzzfbv4zdks9rh1j1nq405m4lifbr3-darwin-system-25.11.9a9ab01.drv
├───/nix/store/1067s8x77wnbp4x59aa9vgrdpjazjrpk-system-applications.drv
│   └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
│       ├───/nix/store/iwnbim2kfpsx0njiczrjdbwkzppqgzpf-ronn-0.10.1.drv
│       │   └───/nix/store/bjkr33d0dsr4am83n6ypjfazkm58my8s-ronn-gems.drv
│       │       ├───/nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
│       │       └───/nix/store/77xqfn4qs4d4k9fabvjq72sj33asm26y-ruby3.3-ronn-ng-0.10.1.drv
│       │           └───/nix/store/fy1akqdymr80p6ypjwvdrpp6l9fm1j68-ruby3.3-nokogiri-1.16.0.drv
│       └───/nix/store/92525bicsii166yk56g3vm4grbwpjh5h-actionlint-1.7.7-go-modules.drv
│           └───/nix/store/iwnbim2kfpsx0njiczrjdbwkzppqgzpf-ronn-0.10.1.drv
├───/nix/store/dwh1c68h8xijmfbykyn9ggkpjshw17fl-system-path.drv
│   └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
├───/nix/store/qvw37qgfkpfldbv0vsihfijsrxb8xgda-etc.drv
│   ├───/nix/store/dwh1c68h8xijmfbykyn9ggkpjshw17fl-system-path.drv
│   └───/nix/store/440cn56dyhlc0ghf281gb4r6dbzcbfc8-user-environment.drv
│       └───/nix/store/v1b1lvcc9is3dpxjl2qr3dxks8f9kw24-home-manager-path.drv
│           └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
└───/nix/store/88fh7jn807sfhjjzk0f67s48f443yl25-activation-n8henrie.drv
    └───/nix/store/r0adycland7ffzpz80l35y7x2iw9ald3-home-manager-generation.drv
        ├───/nix/store/v1b1lvcc9is3dpxjl2qr3dxks8f9kw24-home-manager-path.drv
        ├───/nix/store/c749wf5q4d9c6cd78wypd9am1kl92kby-home-manager-files.drv
        │   ├───/nix/store/nkhwrgp52yhambmzafqsbrlwimcm6zsz-home-manager-applications.drv
        │   │   └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
        │   ├───/nix/store/d8p8kh2f9kz3ikirxggicf1iirdllp33-hm_fontconfigconf.d10hmfonts.conf.drv
        │   │   └───/nix/store/v1b1lvcc9is3dpxjl2qr3dxks8f9kw24-home-manager-path.drv
        │   └───/nix/store/xzp24ns6lk93vd3spdkfqb5dmgncvb45-hm_LibraryFonts.homemanagerfontsversion.drv
        │       └───/nix/store/x42ccmdhrw0smyln136vcwkw1kr8qx42-home-manager-fonts.drv
        │           └───/nix/store/s5yav52c6b6d8ffl1pcla41y9njqzklf-actionlint-1.7.7.drv
        └───/nix/store/na4sxb3szzxhw89pm9j8rywmfj4fhdc9-activation-script.drv
            ├───/nix/store/x42ccmdhrw0smyln136vcwkw1kr8qx42-home-manager-fonts.drv
            └───/nix/store/xzp24ns6lk93vd3spdkfqb5dmgncvb45-hm_LibraryFonts.homemanagerfontsversion.drv
```

[0]: https://github.com/NixOS/nixpkgs/issues/
[1]: https://nix.dev/manual/nix/2.28/protocols/json/derivation.html
