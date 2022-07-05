---
title: Debugging launchd to fix nix permissions on MacOS
date: 2022-06-30T13:28:51-06:00
author: n8henrie
layout: post
permalink: /2022/06/debugging-launchd-to-fix-nix-permissions-on-macos/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- nix
- MacOS
- launchd
---
**Bottom Line:** Fix MacOS / launchd permissions issues to auto-run nix scripts
<!--more-->

I've been delving a little more into [`nix`][nix] lately, though to be honest
I'm not entirely sure why. It promises confident reproducibility, but to be
honest it's a total dumpster fire so far. That aside, I'll carry on...

I have [a number of launchd scripts][0] that I use to automate various tasks on
my MacOS machines. Unfortunately launchd can be a bit of a pain, as it
generally runs in an environment where your `PATH` may be unset, stdout and
stderr are unavailable (unless manually configured), and changes to the scripts
require a bit of ceremony to load and unload before they are picked up.
Overall, I consider it a good deal more effort than accomplishing similar tasks
with systemd (or `cron` obviously).

That said, with a little effort, one can have MacOS scripts that run on login,
automatically in the background, whenever a file or directory changes, on a
schedule, etc. As a practical example, over the past several years I've used
this to schedule downloads or other high bandwidth activity to start overnight,
since we've been living on very slow rural internet until just recently.

The script that prompted this post uses [selenium][2] to perform some scheduled
tasks that depend on a web browser. It uses chromedriver and tends to
break any time chromedriver upgdates (due to me running homebrew updates),
since the new chromedriver binary requires manual intervention to allow its
first run (as a MacOS security precaution). I was hoping to make it a little
more reliable by running it under `nix`.

I started off having a [surprisingly difficult time][1] figuring out how to run
the most basic bash or python scripts as a nix flake, but eventually got that
semi-sorted out.

Unfortunately, just when I thought my troubles were over, I found that my nix
flake ran perfectly when I manually ran `nix run`, but failed when invoked by
`launchd`.

## Debugging launchd

Debugging the issue was made easier with a few discoveries:

```console
$ sudo launchctl debug gui/"${UID}"/com.n8henrie.foo --stdout --stderr
```

The `launchctl debug` command will attach to a terminal, wait for the `foo`
script to be run, and can override the options for `stdout` and `stderr` to
output them to the screen. A few notes:

- `com.n8henrie.foo` above would be whatever label you've given in your plist
  (which I would usually put in
  `~/Library/LaunchAgents/com.n8henrie.foo.plist`).
- it does require elevated (`sudo`) permissions
- the `gui/"${UID}"/` prefix is part of the new-style launchd syntax; it may be
  different if you're writing a system-wide script (`system/` instead of
  `gui/`), and I haven't figured out how to get `user/` prefixed scripts to
  work yet. ¯\\\_(ツ)_/¯
- it only captures the output for the *next* run of the script

One approach to starting the script would be to open a second terminal window
or tmux pane and run:

```console
$ launchctl bootstrap gui/"${UID}" ~/Library/LaunchAgents/com.n8henrie.foo.plist
$ launchctl kickstart gui/"${UID}"/com.n8henrie.foo
```

You may not need the `bootstrap` part if the plist is already loaded. With that
done, you should then see the stdout and stderr in the `launchctl debug`
window.

If you don't want to bother with multiple windows, you can use a background
process to start the script (with a small sleep to give you time to type your
`sudo` password, if needed):

```console
$ { sleep 5; launchctl kickstart gui/"${UID}"/com.n8henrie.foo; } &
$ sudo launchctl debug gui/"${UID}"/com.n8henrie.foo --stdout --stderr
```

This makes things a *lot* easier than my alternative approach of unloading the
script, changing the `<key>StandardErrorPath</key>` and
`<key>StandardOutPath</key>` to point to a temporary file, re-loading the
script, checking the files, unloading the script, removing those changes, and
finally re-loading the script.

Perusing the `launchctl` manpage, I came across another really handy command:
`launchctl submit`. After a little tinkering, it looks like a way that one can
run a one-off command through launchd *without* needing to write a whole plist.

For example (I recommend you run this in a temporary directory):

```console
launchctl submit -l foo -o "${PWD}"/out.txt -e "${PWD}"/err.txt -- bash -c 'echo foo'
```

This will run `bash -c 'echo foo'`, with the stdout and stderr output to
`./out.txt` and `./err.txt`, respectively. Further, once it's been submitted,
you can see that `foo` now appears as a valid launchd label:

```console
$ launchctl list | grep foo
-       0       foo
```

As far as I can tell you need to set absolute paths for e.g. `out.txt`, I
assume this is because the default working directory is not writable (?).

To make it stop running (it seems to run periodically in the background), you
should `launchctl remove foo`.

## Back to nix

Part of my python script finds the most recently downloaded file whose filename
follows a specific pattern:

```python
def most_recent_download(glob: str):
    downloads = Path("~/Downloads").expanduser()
    return sorted(
        downloads.glob(glob),
        key=lambda x: x.stat().st_mtime,
    )[-1]

return most_recent_download("filename_*.pdf"),
```

It works fine when run interactively, but when called from launchd, I used the
above debugging strategies to discover that my glob was resutling in an empty
list (and therefore an `IndexError`). The discrepancy between interactive and
`launchd` usage made me suspicious that this was a permissions error related to
the new-ish MacOS security settings for folders like `~/Downloads` and
`~/Desktop`. Unfortunately, running the script didn't seem to be prompting me
for the usual permissions box. I tried adding `/sbin/launchd` and
`/bin/launchctl` to `Full Disk Access` in the `Security & Privacy` preference
pane, but it didn't help.

Eventually, I discovered that I could could convince MacOS to give me a
permissions prompt by having nix interact with one of the directories in
question, via launchd.

For example, using the new-style `nix` commands, one can run the equivalent of
`bash -c 'echo foo'` like so:

```console
$ nix shell nixpkgs#bash --command echo foo
foo
```

Using `nix-shell`, I think that would look like this:


```
$ nix-shell -p bash --command 'echo foo'
foo
```

(Note the differences in quoting -- ugh.)

For accessing protected directories, nix was working interactively:

```console
$ nix shell nixpkgs#bash --command ls ~/Downloads
IMG_0953.jpg
IMG_0954.jpg
```

However, adapting this to our current problem doesn't seem to work, the files
are empty:

```console
$ launchctl submit -l foo -o "${PWD}"/out.txt -e "${PWD}"/err.txt -- \
    nix shell nixpkgs#bash --command ls ~/Downloads
$ cat *.txt
$
```

The problem is that the path to `nix` isn't set in this environment. Fixing
that minor detail...

```
$ launchctl remove foo
$ rm -- ./{out,err}.txt
$ launchctl submit -l foo -o "${PWD}"/out.txt -e "${PWD}"/err.txt -- \
    ~/.nix-profile/bin/nix shell nixpkgs#bash --command ls ~/Downloads
```

... and we are greeted by a familiar prompt:

![](/uploads/2022/06/nix-download-permission-prompt.png)

After confirming access, everything works as expected.

## BONUS, 20220705

I just wrote a little Makefile (to this toy
project: <https://github.com/n8henrie/runner-rs>) that tries to give a binary launchctl
permissions to access Desktop, Documents, and Downloads, thought it might be a
helpful template for others:


```make
PROJECT=runner

.PHONY: install
install: src/*.rs
	-. config.env
	cargo install --path .
	TMPDIR=$$(mktemp -d) bash -c '\
			trap "launchctl remove $(PROJECT)_tmp" EXIT; \
			launchctl submit -l $(PROJECT)_tmp -o "$${TMPDIR}"/out.txt -e "$${TMPDIR}"/err.txt \
				-- ~/.cargo/bin/$(PROJECT) _ \
				ls ~/Desktop ~/Downloads ~/Documents; \
			until test -s "$${TMPDIR}"/out.txt; do sleep 0.1; done; \
			'
```

Running `make` in this project should build and install the binary, then submit
a launchd job that gives the binary access to the projected directories, wait
for this access to succeed (you should see 3 prompts), and then cleans up when
it exits.

[nix]: https://nixos.org/
[0]: https://n8henrie.com/tags/#launchd-ref
[1]: https://discourse.nixos.org/t/basic-flake-run-existing-python-bash-script
[2]: https://www.selenium.dev/
