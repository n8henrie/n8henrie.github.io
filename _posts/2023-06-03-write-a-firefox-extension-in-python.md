---
title: Write a Firefox Extension in Python
date: 2023-06-03T08:43:58-06:00
author: n8henrie
layout: post
permalink: /2023/06/write-a-firefox-extension-in-python/
categories:
- tech
excerpt: "One can write a Firefox extension in (mostly) Python via Pyodide."
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html | sk --layout=reverse -m | pbcopy
tags:
- firefox
- javascript
- python
---
**Bottom Line:** One can write a Firefox extension in (mostly) Python via Pyodide.
<!--more-->

**Disclaimer:** I'm not a huge fan of JavaScript, and I don't use it much, so I
am likely not following best practices. I've also never written a Firefox
extension, so the below is pretty bare-bones, but hopefully enough to get you
off the ground.

With the recent amazing advancements in Python and wasm, brought to us in
large part by way of [Pyodide] ([repo][2]) and [PyScript] ([repo][3]), I
thought it would be interesting to try to build a Firefox extension in Python.

I found a very helpful [Medium article][0] and corresponding [GitHub repo][1]
for building a Chrome extension in Python, which provided some examples and a
framework. I wanted to do things a little differently (for no good reason) --
specifically, I didn't want to rely on an `html`-based pop-up page, which that
project uses to load all the JavaScript files.

I struggled to get PyScript to work in the way I wanted, but I was eventually
able to get Pyodide to help me create an extension that contains its own Python
wasm runtime (and therefore doesn't need to load it from their web-hosted
version and should be a little snappier to load in some cases).

To try out the toy extension:
1. clone the example repo, which is at <https://github.com/n8henrie/python_firefox_ext.git>
1. inspect (for safety) `setup.sh` (MacOS / probably Linux) or `setup.ps1`
   (Windows) and afterwards run them; this will download the necessary files
   from Pyodide so you can embed them in your extension.
    - You can also consider changing the script to download the debug version
      during development
3. open Firefox to `about:debugging`
4. click the link for `This Firefox`
5. click `Load Temporary Add-on...`
6. Select the `manifest.json` from the cloned repo

In short, I found that you can import `pyodide.js` in your `manifest.json`
using a local path. That defines a function `loadPyodide`, which can accept an
object with an `indexURL` argument. `manifest.json` then load a local
JavaScript file, `hello.js`, which calls `loadPyodide` with `indexURL` set to
a local path to the rest of the necessary files.

From here, loading and running some Python is a little janky, but seems to work
-- I just read the contents of `hello.py` and pass it (as a string) to
`pyodide.runPython`. One reason I wanted to structure things this way is it
allows me to use my usual Python workflow to write / edit / lint / format the
Python code.

In `hello.py`, I demonstrate very basic functionality for both a
`content_script` extension, which can modify the content one sees, as well as a
background extension, which has access to inspect, open, and close tabs (among
many other things). To demonstrate the `content_script` functionality, the
extension sets a red border around the currently open webpage. In
`manifest.json`, I restrict the extension to only run this content script on
`n8henrie.com`, so if you open a page to my site you should see a red border.

For the background script functionality, I print out a list of currently open
tabs into the devtools console; to view this, click the `Inspect` button in
Firefox's `about:debugging` tab, then go to the `Console` tab. I also print out
the current webpage's URL, and open a new page to this blog post (which should
get a red border).

This was a fun project, if a little frustrating to sort out (given my
unfamiliarity with JavaScript). If you have any recommendations or other
example projects, I'd love to hear about it in the comments below!

[0]: https://medium.com/pythoniq/write-chrome-extensions-in-python-6c6b0e2e1573
[1]: https://github.com/PFython/pyscript-local-runtime
[Pyodide]: https://pyodide.org/en/stable/
[2]: https://github.com/pyodide/pyodide/
[3]: https://github.com/pyscript/pyscript
[PyScript]: https://pyscript.net/
[4]: https://github.com/n8henrie/python_firefox_ext.git
