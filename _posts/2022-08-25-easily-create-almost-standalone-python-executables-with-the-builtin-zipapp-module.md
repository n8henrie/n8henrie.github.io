---
title: Easily create (almost) standalone Python executables with the built-in zipapp module
date: 2022-08-25T12:07:39-06:00
author: n8henrie
layout: post
permalink: /2022/08/easily-create-almost-standalone-python-executables-with-the-builtin-zipapp-module/
categories:
- tech
excerpt: "In many cases Python's built-in zipapp module can create executables
that rely only on a Python interpreter."
tags:
- Mac OSX
- MacOS
- python
---
**Bottom Line:** In many cases Python's built-in zipapp module can create executables that rely
only on a Python interpreter.
<!--more-->

I had heard a few months ago that youtube-dl provided a single binary
executable basically by adding a shebang to a zip archive. I looked it up and
sure enough, their process looks pretty straightforward and is [right in their
Makefile][0]. Today I got around to playing with this technique and came across
the built-in [zipapp module][1], which has been around for several Python
versions, and I'm shocked that I haven't used it before.

The module's documentation is good, and there's even a great [realpython.com
article on it][2]. I'll walk you through a very simple example app that even
uses a third-party dependency (the [`httpx`][3] library) and a basic CLI.

1. Create a folder to hold your code: `mkdir -p myappdir`
2. Put the following content into `myappdir/app.py`:
    ```
    from argparse import ArgumentParser

    import httpx


    def main():
        parser = ArgumentParser("Gets a few lines from n8henrie.com")
        parser.add_argument("--count", type=int, default=5)
        args = parser.parse_args()

        resp = httpx.get("https://n8henrie.com")
        print(resp.text.splitlines()[: args.count])

    if __name__ == "__main__":
        main()
    ```
3. Install our dependency (`httpx`) into `myappdir`: `python3 -m pip install -t myappdir httpx`
4. Sanity check: make sure it runs `$ python3 myappdir/app.py`
    - You should see some output starting with `['<!DOCTYPE html>', '<html>'`
5. Create your executable: `$ python3 -m zipapp -p "/usr/bin/env python3" -m app:main -c -o myapp myappdir`
    - `-m zippapp`: use the zippapp module
    - `-p "/usr/bin/env python3"`: use this as the shebang / interpreter (no
      `#!` required)
    - `-m app:main` use the `main` function of the `app.py` module as the
      entrypoint
    - `-c`: enable compression (for me 2.1M vs 4.1M in this case)
    - `-o myapp`: name the resulting executable `myapp`
    - `myappdir`: the directory containing your code and dependencies
6. Test that it works: `./myapp --help`
7. Move `myapp` to a different directory and test that it still works: `./myapp`

I found this to be surprisingly easy and worked better than I had expected,
even with third party dependencies. There are a few limitations:

- Projects with compiled / C dependencies don't seem to work (I tried with
  numpy, for example)
- You still need a Python interpreter available
- Future python verions might be incompatible with your existing code or
  dependencies, so if you upgrade your interpreter your executable might break
- Don't name your container directory the same thing that you'll want your
  executable to be named, since obviously you can't have a file and folder with
  the same name in the same place (this is why I renamed the directory to
  `myappdir/` instead of `myapp/`)

Regardless, for the right project, this is an easy way to make a
redistributable and fairly self-contained Python-based tool that doesn't
require your users to `pip install` anything or mess around with `venv`s,
homebrew, nix, etc. I highly encourage you to read the module documentation and
realpython article linked above for more in-depth information.

[0]: https://github.com/ytdl-org/youtube-dl/blob/d619dd712f63aab1964f8fdde9ceea514a5e581d/Makefile#L60
[1]: https://docs.python.org/3/library/zipapp.html
[2]: https://realpython.com/python-zipapp
[3]: https://github.com/encode/httpx
