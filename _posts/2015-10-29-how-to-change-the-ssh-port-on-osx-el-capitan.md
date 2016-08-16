---
id: 2757
title: How to Change the SSH Port on OSX El Capitan
date: 2015-10-29T09:10:31+00:00
author: n8henrie
excerpt: "Here's how to change the SSH port with El Capitan's new System Integrity Protection (SIP)."
layout: post
guid: http://n8henrie.com/?p=2757
permalink: /2015/10/how-to-change-the-ssh-port-on-osx-el-capitan/
dsq_thread_id:
  - 4269717250
disqus_identifier: 2757 http://n8henrie.com/?p=2757
tags:
- bugfix
- Mac OSX
- security
- Terminal
categories:
- tech
---
**Bottom Line:** Here’s how to change the SSH port with El Capitan’s new System Integrity Protection (SIP)<!--more-->

In previous versions of OS X, if you wanted to run SSHD on a custom SSH port, you could just edit `/System/Library/LaunchDaemons/ssh.plist`. For better or worse, in OS X 10.11 El Capitan, a new security measure prevents editing this file, even with root privileges.

As discussed in <a href="http://stackoverflow.com/questions/30768087/restricted-folder-files-in-os-x-el-capitan" target="_blank">this Stack Overflow thread</a>, there are a few workarounds, such as disabling SIP with `csrutil disable`. However, I prefer the <a href="http://zanshin.net/2015/10/01/change-sshd-port-on-mac-os-x-el-capitan/" target="_blank">method suggested here</a> by Mark Nichols, which is to basically copy the `ssh.plist` file into `/Library/LaunchDaemons/` and make a _second_ SSH service that you _can_ edit.

I took a few slightly different steps, so I thought I’d post my experience and perhaps see if I could help out a few others struggling with this problem.

Specifically, I followed the same steps of copying the plist and editing the `Label` (I used `com.n8henrie.sshd`) and `SockServiceName` (to my custom SSH port number), and afterward I found that I could `sudo launchctl load /Library/LaunchDaemons/ssh.plist` and `sudo launchctl start com.n8henrie.sshd`, and everything worked well. I could verify the port was open with `nmap localhost -p $SSHPORT` (obviously replacing `$SSHPORT` with the port number). For those without `nmap` installed, you can also use `netstat -at | grep LISTEN` as recommended by Nichols.

However, I found that after I rebooted, I couldn’t connect by SSH. I also found that my Sharing pane in System Preference kept having the `Remote Login` button checked (the default way to turn on SSH), even though I wasn’t checking it. So here’s what I ended up doing that seems to have things running how I want.

  1. Copy the file: `sudo cp /System/Library/LaunchDaemons/ssh.plist /Library/LaunchDaemons/ssh.plist`
  2. Edit the file with root privileges, e.g. `sudo vim /Library/LaunchDaemons/ssh.plist` to match the contents below, replacing `12345` with your SSH port of choice, and customizing the `Label`:
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
            <string>/usr/sbin/sshd</string>
            <string>-i</string>
        </array>
        <key>Sockets</key>
        <dict>
            <key>Listeners</key>
            <dict>
                <key>SockServiceName</key>
                <string>12345</string>
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
    </dict>
    </plist>

  3. Enable the plist: `sudo launchctl load /Library/LaunchDaemons/ssh.plist` 
      * Note that while normally you would need to do something like `sudo launchctl start com.n8herie.sshd`, I set the `RunAtLoad` key, so you shouldn’t have to manually `start` it.
  4. Verify that the plist ran: `sudo launchctl list | grep sshd` 
      * If you see something like `-  255 com.n8henrie.sshd`, it worked. If you see `` instead of `255`, it is `load`ed but not `start`ed, so it won’t work. If you don’t see anything, it didn’t even load, so make sure you’re correctly `grep`ing part of the `Label` that you put in the plist.
  5. Reboot, and run `sudo launchctl start com.n8herie.sshd` again to make sure it’s properly running at boot.

One other tip: if you’re going to edit the plist, make sure it is **not** loaded prior to editing. Just to be safe, `sudo launchctl stop com.n8henrie.sshd` and `sudo launchctl unload /Library/LaunchDaemons/ssh.plist` every time prior to editing, then `load` it again after you’re done.

Hopefully this should get you up and running. Let me know if you have other suggestions or modifications to this strategy!