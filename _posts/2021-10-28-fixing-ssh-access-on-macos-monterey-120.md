---
title: Fixing SSH Access on MacOS Monterey (12.0)
date: 2021-10-28T10:29:51-06:00
author: n8henrie
layout: post
permalink: /2021/10/fixing-ssh-access-on-macos-monterey-120/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
-
---
**Bottom Line:** Here's how I fixed `Connection reset by peer` on MacOS
Monterey.
<!--more-->

After updating to MacOS Monterey (12.0) a couple of days ago, I found that my
SSH access was no longer working. 

My SSH access is set up on a custom port, which helps reduce the burden of
constant port scanning (though is definitely "security through obscurity");
MacOS didn't make this particularly easy to do, so I went through my setup in a
prior post: [How to Change the SSH Port on OSX El Capitan][0].

In trying to debug, I tried to connect locally, since I know that I have an ssh
key set up to allow me to ssh to myself:

```console
$ # replace 22 with your actual port number
$ ssh -4 -p 22 localhost
kex_exchange_identification: read: Connection reset by peer
Connection reset by 127.0.0.1 port 22
```

I googled a bit and didn't find much information about that error:
`kex_exchange_identification: read: Connection reset by peer`.

Reviewing my old post, I noticed that I had copied my SSH template from
`/System/Library/LaunchDaemons/ssh.plist`.

Comparing the system-supplied one and my customized one: (`diff
/System/Library/LaunchDaemons/ssh.plist /Library/LaunchDaemons/ssh.plist`)
showed a few differences, notably the addition of `MaterializeDatalessFiles`
(see `man 5 launchd.plist`) and changing the ssh command from `/usr/sbin/sshd
-i` to `sshd-keygen-wrapper`.

Adopting these changes got SSH working again. For users starting from scratch,
I would recommend following the step-by-step from [my prior post][0]; my
current `/Library/LaunchDaemons/ssh.plist` looks like this, replacing
`REDACTED` with my actual port number.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Disabled</key>
	<false/>
	<key>Label</key>
	<string>com.n8henrie.sshd</string>
	<key>Program</key>
	<string>/usr/libexec/sshd-keygen-wrapper</string>
	<key>ProgramArguments</key>
	<array>
		<string>sshd-keygen-wrapper</string>
	</array>
	<key>Sockets</key>
	<dict>
		<key>Listeners</key>
		<dict>
			<key>SockServiceName</key>
			<string>REDACTED</string>
			<key>Bonjour</key>
			<array>
				<string>ssh</string>
				<string>sftp-ssh</string>
			</array>
		</dict>
	</dict>
	<key>inetdCompatibility</key>
	<dict>
		<key>Wait</key>
		<false/>
		<key>Instances</key>
		<integer>42</integer>
	</dict>
	<key>StandardErrorPath</key>
	<string>/dev/null</string>
	<key>RunAtLoad</key>
	<true/>
	<key>SHAuthorizationRight</key>
	<string>system.preferences</string>
	<key>POSIXSpawnType</key>
	<string>Interactive</string>
	<key>MaterializeDatalessFiles</key>
	<true/>
</dict>
</plist>
```

Next, reload the file in `launchd`:

```console
$ sudo launchctl unload -w /Library/LaunchDaemons/ssh.plist
$ sudo launchctl load -w /Library/LaunchDaemons/ssh.plist
```

At this point, I could `ssh -p 22 localhost` and connect. Woohoo!

Unfortunately, I also noted that password authentication was working (which I
like to disable):

```console
ssh -p 22 -o pubkeyauthentication=no localhost
```

For this, I [came across a post][1] detailing a new method for disabling PAM
and password authentication on Monterey (ssh has gone to a `config.d`-style
setup). The bottom line of the post amounts to the command below.

```console
$ cat <<'EOF' | sudo tee /etc/ssh/sshd_config.d/000-n8henrie.conf
UsePAM no
PasswordAuthentication no
EOF
```

After running this, I could confirm that password authentication was no longer
possible:

```console
$ ssh -p 22 -o pubkeyauthentication=no localhost
n8henrie@localhost: Permission denied (publickey,keyboard-interactive).
```

[0]: /2015/10/how-to-change-the-ssh-port-on-osx-el-capitan/
[1]: https://rachelbythebay.com/w/2021/10/27/macssh/
