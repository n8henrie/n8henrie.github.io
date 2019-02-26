---
title: How to Give Full Disk Access to a Binary in MacOS Mojave
date: 2018-11-16T11:19:06-07:00
author: n8henrie
layout: post
permalink: /2018/11/how-to-give-full-disk-access-to-a-binary-in-macos-mojave/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- applescript
- automation
- bugfix
- Mac OSX
- Terminal
---
**Bottom Line:** Here are a few strategies for giving full disk access to a
script on MacOS Mojave
<!--more-->

### Update 20190226

As noted in the restic issue linked below, this process is no longer working
for new binaries. For some reason, the binaries that I created at the time of
publishing this post **continue to work** without permissions errors, even now,
but I can't get this process to work with any new ones. Very odd. If you have
any insights or suggestions, I'd love to hear them in the comments below.

## The Problem

MacOS Mojave has new privacy protection features in place that prevent
applications from reading a number of files unless explicitly given access by
the user. This seems like a good feature and probably should be left enabled by
default, but it presents a challenge for backup software; I noticed
[restic](https://github.com/restic/restic) having some permissions errors a few
weeks ago and have been sorting through how to give it access to these
protected files.

These permissions are found in `System Preferences` -> `Security & Privacy` ->
`Full Disk Access`.

I've made some progress as outlined in [this GitHub
issue](https://github.com/restic/restic/issues/2051), and thought I'd write
about it more at length here.

Of note, I've also found the following command to reset the relevant
permissions helpful in digging through this: `tccutil reset
SystemPolicyAllFiles` Sources: [1], [2]

**Update 20181121:** I think I've found a much better route for anybody that
can write a simple script in a compiled language like Go -- see the update
section [below](#Update 20181121).

## How to Access these Files

If you do the following, you can get access to the protected files:

1. Package a standard MacOS application that runs a script (including a restic
   backup script)
1. Move the application to `/Applications` (may not always be necessary)
1. Add that application to FDA
1. Run the application by opening the `.app` (either by double clicking via
   GUI, or `open /path/to/Restic.app` but **not** by directly using the
   executable stored in e.g. `Restic.app/Contents/Resources/`)

There are a few ways to accomplish #1 --
[Platypus](https://www.sveinbjorn.org/platypus) (`brew install platypus`)
provides an easy CLI that does the job in a single command:

```console
$ cat <<'EOF' > runrestic.sh
#!/usr/local/bin/bash

RESTIC=/usr/local/bin/restic
export RESTIC_PASSWORD=asdf
export RESTIC_REPOSITORY=/tmp/restic

mkdir -p $RESTIC_REPOSITORY
$RESTIC init
$RESTIC backup ~/Library/Mail &> /tmp/restic/log.txt
EOF
$ platypus runrestic.sh
Creating application bundle folder hierarchy
Copying executable to bundle
Copying nib file to bundle
Optimizing nib file
Copying script to bundle
Writing AppSettings.plist
Writing application icon
Writing Info.plist
Moving app to destination '/var/folders/xv/gqk_1btj70v8gfz8xb0ydw940000gn/T/tmp.xJ0rXd0iYc/Runrestic.app'
Registering app with Launch Services
Done
$ mv Runrestic.app /Applications/
$ open /Applications/Runrestic.app
$ du -sh /tmp/restic && sleep 5 && du -sh /tmp/restic
24K     /tmp/restic
24K     /tmp/restic
$ rm -r /tmp/restic
$ ## Add to FDA ##
$ open /Applications/Runrestic.app
$ du -sh /tmp/restic && sleep 5 && du -sh /tmp/restic
140M    /tmp/restic
227M    /tmp/restic
$ pkill restic
```

Unfortunately, running the embedded script directly for some reason won't work
(does not seem to inherit the FDA access):

```console
$ rm -r /tmp/restic
$ /Applications/Runrestic.app/Contents/Resources/script
created restic repository 4585354284 at /tmp/restic

Please note that knowledge of your password is required to access
the repository. Losing your password means that your data is
irrecoverably lost.
$ du -sh /tmp/restic && sleep 5 && du -sh /tmp/restic
24K     /tmp/restic
24K     /tmp/restic
$ cat /tmp/restic/log.txt
created new cache in /Users/me/Library/Caches/restic
can not obtain extended attribute com.apple.quarantine for /Users/me/Library/Mail:
error: Open: open /Users/me/Library/Mail: operation not permitted

Files:           0 new,     0 changed,     0 unmodified
Dirs:            3 new,     0 changed,     0 unmodified
Added to the repo: 1.122 KiB

processed 0 files, 0 B in 0:00
snapshot 2c62de89 saved
```

Other options (that don't require 3rd party software) include using the
built-in `Automator.app` or `Script Editor.app` to do essentially the same
thing, as long as you click the option to save as an Application (not a
script). As AppleScript:

```applescript
on run
	do shell script "/usr/local/bin/bash /path/to/runrestic.sh"
end run
```

Same deal, move to `/Applications/` and add to FDA, run by either double
clicking or by `open /Applications/Test.app`.

Note that there are some *really* screwy bugs with the system, which is what I
blame for how long it's taking me to make any progress. For example, with the
following AppleScript saved as an Application:

```applescript
on run
	set whoami to (do shell script "whoami")
	set ls to (do shell script "/bin/ls /Users/me/Library/Mail")
	display dialog whoami & return & ls
end run
```

If I save this to `/Applications/Test.app` and add to FDA, it works. If I then
duplicate a copy to `~/Desktop/Test.app`, it works the first time, then stops
working (permissions error), regardless of which Test.app I open. Then I have
to reset the permissions, then re-add to make the `/Applications` one start
working again -- it often fails the first time I try to run it, then works
after that. [EDIT: I wonder if this may actually be due to a "last modified"
timestamp changing, instead of having to be in the `/Applications` folder -- I
currently have an application on my Desktop that seems to be working fine.]

Also, running from the built-in "Run" button in Script Editor ( ▶ ) *never*
works (permissions errors), has to be run by double clicking the icon or `open
/path/to/Test.app` from the command line.

Finally, if the application changes *at all*, you have to remove and then
restore FDA access to get it working again. This includes just the timestamp
changing due to saving the application, **even if none of the code has
changed.** I think this may be one of the confounding factors in my testing; if
I leave `Script Editor.app` running while I experiment, it may be auto-saving
in the background which may be giving me intermittent errors that are tough to
debug.

## Ongoing Issues in Automating the Process

The big problem I'm stuck with at this point is giving read permissions for
system files that I would like to be backed up (i.e. files that I need to be
`root` to read, for example `/etc/master.passwd`).

Using the AppleScript example from above (basically `ls ~/Library/Mail`, which
is a protected directory), I can put a script into e.g.
`/Library/LaunchDaemons/com.n8henrie.test.plist` that contains the following
(among other boilerplate code), and make that file owned by `root`. If I then
`sudo launchctl load` and then `sudo launchctl start` it, I get the dialog box
showing that the FDA permissions worked properly, but at the top of the dialog,
I see that `whoami` is still getting run as my user (not `root`).

```xml
...
<array>
    <string>/usr/bin/open</string>
    <string>/Applications/Test.app</string>
</array>
...
```

This means that running my restic backup script in this way seems like it will
work from the FDA perspective, but won't be able to access any files that are
e.g. `0600 root:wheel`.

Some workarounds include changing the applescript to include `do shell script
... with administrator privileges`, which will cause it to prompt me for my
password and then run as root... but that won't work from an automation
standpoint.

The only other workaround I've discovered is to `sudo visudo` and add give
myself the ability to run as sudo with `NOPASSWD:`, then change the AppleScript
to e.g. `sudo -n /bin/ls /etc/master.passwd`.

Oddly, if I make a root-owned launchd plist in `/Library/LaunchDaemons/` that
directly runs the command `whoami` and outputs the result to a text file on the
desktop, it outputs `root` (even without the `UserName` key).

Frustratingly, if I change that plist to run `open /path/to/Test.app`, where
`Test.app` is an AppleScript that outputs `whoami` to a text file, I get my
regular username irrespective of whether the `UserName` key is set to `root` or
not.

This means that I can't set my launchd script to run my `Restic.app` and have
sufficient privileges to read root-only files, even if the launchd script is in
`/Library/LaunchAgents`, root owned, and set to run as `UserName`: `root`.

The only workaround I've figured out so far is to:

1. `sudo visudo` and give my unprivileged user the ability to run my restic
   backup script as `sudo` with `NOPASSWD:` (I also specify the hash of the
   script to hopefully improve security)
1. `chown root` the script
1. `chmod 0740 the script` (4 so it can still be added to VCS)
1. Change `Restic.app` to run `sudo -n /path/to/my-script.sh`
1. Add `Restic.app` to FDA
1. Change my launchd script to `open /path/to/Restic.app`

This seems really sloppy, and I'd love to hear suggestions from other readers.

## <a name="Update 20181121"></a>Update 20181121

After some preliminary testing, it seems like a much cleaner solution to all of
the above (including running with root privileges) is to just make a binary (in
a compiled language) that runs your script, then add that binary to Full Disk
Access.

Note that this doesn't work for something like a shell script; you can't add
the script to Full Disk Access (even if you `chmod +x`). You can only add the
e.g. `bash` binary that *runs* the script, but that means that *any* process
spawned by `bash` can access all your files. That seems like a *huge* security
vulnerability.

Anyway, here is some example code in Go that runs a bash script named
`restic-backup.sh` in the directory containing the resulting go binary.

```go
// Runrestic provides a binary to run my restic backup script in MacOS Mojave
// with Full Disk Access
package main

import (
    "log"
    "os"
    "os/exec"
    "path/filepath"
)

func main() {
    ex, err := os.Executable()
    if err != nil {
        log.Fatal(err)
    }
    dir := filepath.Dir(ex)
    script := filepath.Join(dir, "restic-backup.sh")
    cmd := exec.Command("/usr/local/bin/bash", script)
    if err := cmd.Run(); err != nil {
        log.Fatal(err)
    }
}
```

You can add this binary to Full Disk Access and the spawned processes
(including the shell script it calls) should inherit Full Disk Access. Don't
forget that if you make *any* changes to the Go binary, you need to remove it
from FDA and then add it back.

Also note that this seems to work great for scripts requiring root access;
instead of all the hacky mess above, just have your root-owned
`/Library/LaunchDaemons` plist call this binary. In this case, I'd highly
recommend that you secure both the binary and the shell script it calls, since
otherwise an attacker could easily overwrite either one with something
malicious and it would get called with root privileges. An example of a few
simple steps may be to `sudo chown root` both of these files, `sudo chmod 0700`
the Go binary, and `sudo chmod 0640` the shell script (keeping yourself in the
group so you can still add it to VCS if desired).

I've had a few promising leads on this problem that haven't panned out, so I'll
update in a few days if this stops working, but it seems to be doing the trick
for now.

## Further Reading

- <https://github.com/restic/restic/issues/2051>
- <https://forums.developer.apple.com/thread/107546>
- <https://c-command.com/eaglefiler/help/security-privacy-acce>
- <https://bombich.com/kb/ccc5/granting-full-disk-access-ccc-and-its-helper-tool>
- <https://www.backblaze.com/blog/mojave-permissions/>

[1]: https://bitsplitting.org/2018/07/11/reauthorizing-automation-in-mojave/
[2]: https://www.felix-schwarz.org/blog/2018/08/new-apple-event-apis-in-macos-mojave
