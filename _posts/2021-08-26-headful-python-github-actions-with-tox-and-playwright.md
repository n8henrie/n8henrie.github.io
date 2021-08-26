---
title: Headful Python GitHub Actions with Tox and Playwright
date: 2021-08-26T08:09:25-06:00
author: n8henrie
layout: post
permalink: /2021/08/headful-python-github-actions-with-tox-and-playwright
categories:
- tech
excerpt: "For headful runs on GitHub Actions, make sure to pass your
`XAUTHORITY` and `DISPLAY` to tox"
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- automation
- python
---
**Bottom Line:** For headful runs on GitHub Actions, make sure to pass your
`XAUTHORITY` and `DISPLAY` to tox.
<!--more-->

I've been wanting to improve the testing for [pycookiecheat][0] for *ages*.
It's a small library that pulls cookies from the Chrome / Chromium `Cookies`
file, primarily for reuse in scripts. For a long time, I just included an
example `Cookies` database in the tests and ran from that. For a while, I just
instructed the user running the tests to manually visit a webpage and set a
cookie. Not great solutions.

I knew that I *eventually* wanted to move to something like
[Selenium](https://github.com/SeleniumHQ/selenium), possibly via Docker, and
set an *actual* cookie by *actually* running Chrome, but it was pretty painful
to sort out.

Recently, I've started using Microsoft's newish project [Playwright][1] for
browser automation, and I've been pleased so far. I find it generally easier to
use than Selenium, in part because I frequently end up with Selenium-browser
version conflicts or incompatibilities or "cannot find GeckoDriver" type
errors; Playwright works around this by downloading Microsoft's own (slightly
patched, IIRC) version of the browser in question. While this extra download
adds a little bloat and time to the initial setup, it helps guarantee
script-browser compatibility, and so far does a much better job making sure my
jobs run as expected. (I'll additionally note that they provide a Docker
container that I plan to start using, as that should virtually guarantee that a
working job continues to work, at least as long as the web content it runs on
remains unchanged.)

With a modest amount of effort, I was eventually able to move
[pycookiecheat][0]'s tests over to Playwright; the difficulties I ran into were
mostly around creating a Chrome profile that would store its password
[similarly to how it would be stored for a real user][2], so that I could
ensure I was loading it correctly for use in decrypting the cookies. Of note, I
was not able to figure out a way to do this on both MacOS and Linux with a
headless run; I *had* to run Chrome headed / headful to get things to work
correctly.

Once I had everything working locally, I tried to convert my CI from Travis to
GitHub Actions, since I've heard so many good things, and I assumed that as
both GitHub and Playwright are Microsoft products, they should work together
well. *Enter **months** of trial and error.*

I run my Python tests via
[tox](https://tox.readthedocs.io/en/latest/index.html), which lets me test on
multiple Python versions seamlessly (via [pyenv][4] in my case) and hopefully
ensure compatibility. It also lets me add targets to lint my project and
generate documentation, all in a single command. I know that to simulate a
headful run on a headless system (such as CI), that I'd need to use something
like [`Xvfb`][5] (X virtual framebuffer) to "fool" the system into allowing the
browser's GUI to open (or at least seem like it did so). Playwright has this
[clearly documented](https://playwright.dev/python/docs/ci/#running-headed), so
to follow their documentation for my test setup, I used something like:

```bash
xvfb-run -- python -m tox -e py
```

You can see the full file -- in its *failing* state --
[here](https://github.com/n8henrie/pycookiecheat/blob/74b6427b5f931ad9dd23544bf10d300667202941/.github/workflows/python-package.yml).

Unfortunately, when GitHub Actions tried to run my tests, I repeatedly got
`Unable to open X display` and similar errors:

![](/uploads/2021/08/github-actions-tox-errors.png)

I eventually opened [an issue at the Playwright repo][3], where I'd seen
several other issues regarding `xvfb` and headful runs, and waited patiently.

A few months later, I got [a
response](https://github.com/microsoft/playwright-github-action/issues/48#issuecomment-902531914)
recommending that I try things I was already doing, which I didn't find
particularly helpful, and my issue was summarily closed. I was admittedly a
little snarky in my responses. Thankfully, the maintainer's response *did*
point me towards `tox` as being a potential source of trouble, and I eventually
had a [single run
succeed](https://github.com/n8henrie/pycookiecheat/actions/runs/1164573497), in
which I used `pytest` directly instead of going through `tox`. Progress!

However, I *really* would prefer to just run my tests via `tox`. This way, the
tests running in CI are as close as possible to the tests that I run on my
local machine, and I don't have double the maintenance burden (i.e. if I make
changes to the pytest command I run in tox, I don't want to also make that
change in the GitHub Actions yaml files). To help sort out what was going wrong
via tox on GitHub Actions, I used a few tools to simulate GitHub Actions
locally:

- [act][6], installed in a [nix](https://nixos.org/) shell, which functions
  more or less like a local clone of GitHub Actions that I can run as much as I
  want without having to waste CI minutes
- the [Docker image](https://github.com/catthehacker/docker_images) I
  configured to be used by `act`, which I could run directly and attach an
  interactive shell to be able to tweak settings in real time 
    - NB: I used the `catthehacker/ubuntu:runner-20.04` image

Knowing that I could successfully `xvfb-run -- python -m pytest` but not
`xvfb-run -- python -m tox -e py`, I figured there was probably some difference
in the environment that was causing trouble. If I were smart, I would have
changed my `commands` section of `tox.ini` to just `commands = /usr/bin/env`
and then compared the output of these four commands:

```console
$ env
$ xvfb-run -- env
$ python -m tox -e py
$ xvfb-run -- python -m tox -e py
```

I probably would have noticed a lot more quickly that two necessary environment
variables were being cleaned from the environment in which `tox` runs the
tests: `XAUTHORITY` and `DISPLAY`.

The `tox` documentation on this is very clear: <https://tox.readthedocs.io/en/latest/config.html#conf-passenv>

>  If a specified environment variable doesn’t exist in the tox invocation
environment it is ignored.

There are two ways to tell `tox` that you'd like it to leave these specific
environment variables alone (and pass them on to the tests):

- Use the `TOX_TESTENV_PASSENV` environment variable:
    - e.g. `export TOX_TESTENV_PASSENV="XAUTHORITY DISPLAY"`
- Set `passenv` in `tox.ini`
    - e.g. `passenv = "XAUTHORITY DISPLAY"`

On MacOS, I didn't seem to need any modification of tox's default handling of
these variables, so I decided to leave my `tox.ini` alone, and [use the `env:`
key in my GitHub Actions
configuration](https://github.com/n8henrie/pycookiecheat/blob/3458862a4c99c83ae9017fe52ae6ec49216c745d/.github/workflows/python-package.yml#L16),
which seems to be doing the trick.

Phew.

[0]: https://github.com/n8henrie/pycookiecheat
[1]: https://github.com/microsoft/playwright-python
[2]: https://github.com/n8henrie/pycookiecheat/blob/3458862a4c99c83ae9017fe52ae6ec49216c745d/tests/test_pycookiecheat.py#L40
[3]: https://github.com/microsoft/playwright-github-action/issues/48
[4]: https://github.com/pyenv/pyenv/
[5]: https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml
[6]: https://github.com/nektos/act
