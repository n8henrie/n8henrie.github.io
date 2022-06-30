---
id: 9
title: How to Schedule an iOS App to Run Automatically on a Jailbroken iPhone or iPad
date: 2012-07-22T03:08:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=9
permalink: /2012/07/scheduling-ios-apps/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/07/scheduling-iOS-apps.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 811650975
disqus_identifier: 9 http://n8henrie.com/?p=9
tags:
- automation
- iPad
- iPhone
- launchd
- mobile
- productivity
categories:
- tech
---
**Bottom line:** You can schedule apps to run on a schedule on your jailbroken iOS device by adding a shell script called by a .plist that is run by launchCTL.

<!--more-->


**Update Aug 20, 2013:** I haven't had a jailbroken device (well not one that I use regularly anyway) for over a year now. I still think my post below is a good starting point for anyone looking to automate app launching on iOS, but _please understand it will be somewhat outdated._ On the other hand, several commenters below have continued to test and tweak; I highly recommend you look at their strategies as well for more updated information.

I _finally_ figured out how to automate launching an app on a schedule on my iOS devices. This is something I've been trying to figure out for quite a while. While some of the jailbroken apps like <a target="_blank" href="http://apt.thebigboss.org/onepackage.php?bundleid=com.niufenfen.ischeduler&db=" title="iScheduler in BigBoss Repo">iScheduler</a> and <a target="_blank" href="http://moreinfo.thebigboss.org/moreinfo/depiction.php?file=sbprofilesDp" title="SBProfiles in the BigBoss Repo">SBProfiles</a> have this function, I don't want to pay for iScheduler (also tried it previously had some issues with conflicts and crashes), and I don't want SBSettings anymore (happier with <a target="_blank" href="http://modmyi.com/info/ncsettings.php" title="NCSettings in ModMyI Repo">NCSettings</a> , and my phone seems a touch quicker). I mention that because SBSettings is a prerequisite for SBProfiles. You might be wondering why I care so much about being able to launch apps on a schedule. Don't worry, I'll tell you.

### The Problem: No Background Updates

There are plenty of reasons why an individual might want to schedule a script to run or apps to launch. For example, on my Mac I used Automator (a _great_ tool built-in to the OS, very user friendly) to make an "alarm" that is launched by iCal an hour or so prior to my usual wakeup time. This "alarm" is a script that

  1. mutes my computer (so none of the subsequent actions make a noise and wake me up)
  2. launches my "morning routine" apps

This way, on my morning rush to the hospital, I can quickly scan my tasklist and my calendar without having to wait for those apps to load up. This really doesn't save a whole lot of time, but when you're in a hurry it can seem like things are taking _ages_ to load. I use a similar strategy to automate monthly backups of my contacts and calendar to cloud storage, which I'll cover in a future post.

On my iPhone, there's an even more pressing issue: many of the apps I rely on don't sync in the background. If I don't remember to launch the app, they don't reflect any changes that I've made on other devices. For example, I have the full <a target="_blank" href="http://www.omnigroup.com/products/omnifocus/" title="OmniFocus">OmniFocus</a> getup – <a href="https://itunes.apple.com/us/app/omnifocus/id402835630?mt=12&at=10l5H6" title="OmniFocus at Mac App Store" target="_blank">Mac</a>, <a href="https://itunes.apple.com/us/app/omnifocus-for-ipad/id383804552?mt=8&at=10l5H6" title="OmniFocus for iPad at iOS App Store" target="_blank">iPad</a>, and <a href="https://itunes.apple.com/us/app/omnifocus-2-for-iphone/id690305341?mt=8&at=10l5H6" title="OmniFocus for iPhone at iOS App Store" target="_blank">iPhone</a>. I love and rely on this app. One nice feature is that the app "badge" that can update to show the sum of your due, overdue, and flagged tasks. I'll frequently spend a few minutes before I go to bed "flagging" the tasks that are high priority for the next day.

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/PhotoJul2170241PM-11.jpg" style="margin-left:1em; margin-right:1em"><img border="0" height="112" width="400" src="{{ site.url }}/uploads/2012/07/PhotoJul2170241PM-1.jpg" /></a>
</div>

However, if I don't remember to launch OmniFocus... the badge never updates, and I don't have this handy in-my-face reminder every time I look at my iPhone throughout the day. As a second example from the image above, I use <a target="_blank" href="http://www.dueapp.com/" title="DueReminder App for iPhone, iPad, and Mac">Due</a> to give me reminders of time-sensitive tasks throughout the day (its "auto-snooze" feature is _pure gold_, and I plan post to cover Due at some point in the future, but its video ad is really what sold me... I'm a sucker for cute video ads). Once again, if I add an important reminder on Due for iPad (it's a universal app so it works on both iOS devices), that reminder is not synced to the iPhone until I launch Due on the iPhone. BTW, this is _not_ the developers' fault.. it's an Apple limitation. Regardless, I have definitely missed a reminder or two not because I forgot to set the reminder, but because I forgot to sync the reminder to the device I had with me. Because these apps can be set to sync on launch, being able to automatically launch (and thereby sync) these apps overnight ensures that I am consistently up-to-date each morning.

### Prerequisites for Automatically Scheduling iOS App Launches

  * Jailbroken iOS Device
      * SSH access with something like <a target="_blank" href="http://thebigboss.org/guides-iphone-ipod-ipad/install-and-use-ssh" title="Open SSH Tutorial">Open SSH</a>
      * MobileTerminal
      * Install the "Open" package (set Cydia settings to "Hacker" and search for it)
      * iFile not required but recommended
  * Basic knowledge of SSH
  * An SSH / SFTP app like <a target="_blank" href="http://cyberduck.ch/" title="Cyberduck">Cyberduck</a>
  * Basic familiarity with Terminal commands
  * Know the "bundle identifier" names for apps you'd like to run

### Instructions

**Overview**: You'll be making a shell script (.sh) with code for "what to do" and a preference list (.plist) with "when to do it." These will be placed into your iPhone via SSH. I'm sure you could also do it all on the device with iFile / Mobileterminal, but this is how I did it. You'll be taking advantage of something called LaunchCTL, which runs things on a schedule, and the "Open" package mentioned above, which tells MobileTerminal what it means to "Open" something.

**1.** Figuring out the bundle identifiers can be a bit of a pain. These are special names for the apps that you'll need to use in your script; they often look something like com.companyName.appName. To figure these out, one strategy is to use iFile to naviate to /User/Applications and enter the application folder in question. Browse around until you find something (the info.plist might be a good start). The strategy I used was to SSH into the iOS device from Terminal and use this command:

**Update 20170824**: I have no idea what command this was, it apparently got
lost in my migration to a static site. Sorry.

which sometimes returns a _ton_ of stuff that I then browsed for something that looked like com.copanyName.appName. Then, to test it out, I'd run
in the same Terminal window. _Make sure you've already installed the "Open" package by setting your Cydia setting to "hacker" and searching, or this won't work._ If you've figured out the correct bundle identifier, the app should launch on your iOS device. If so, take note. If not, keep looking.

**2.** Use a text editor (<a target="_blank" href="http://www.barebones.com/products/TextWrangler/" title="TextWrangler">TextWrangler</a> is my favorite), to create the following files. Credit goes to <a target="_blank" href="http://hintsforums.macworld.com/archive/index.php/t-48458.html" title="this thread">this thread</a> for the original material here.

I named the below script "morningUpdates.sh" – note the bundle identifiers I used, and modified as suits you. Also note that I sync each app twice – this is because I'm also running a similar app on my iPad simultaneously, so the first run syncs the app to the cloud, the second syncs from the cloud, so both devices should have _all_ changes synced to and from them. Use SSH to place in your iOS device in /usr/bin/

```bash
#!/bin/bash
open com.omnigroup.OmniFocus
sleep 30
open com.phocusllp.due
sleep 30
open com.omnigroup.OmniFocus
sleep 30
open com.phocusllp.due
sleep 30
open com.sparrowmailapp.iphoneapp
```
<br/>
I named the below .plist "com.n8henrie.morningUpdates.plist" – note the "hour" and "minute" keys in 24h format, modified as suits you, and use SSH to place in your iOS device in /System/Library/LaunchDaemons/

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>Label</key>
<string>com.n8henrie.morningUpdates</string>
<key>ProgramArguments</key>
<array>
<string>/usr/bin/morningUpdates.sh</string>
<string>parameter1</string>
<string>parameter2</string>
</array>
<key>Nice</key>
<integer>20</integer>
<key>StartCalendarInterval</key>
<dict>
<key>Hour</key>
<integer>03</integer>
<key>Minute</key>
<integer>30</integer>
</dict>
</dict>
</plist>
```

**3.** Once you've placed these files in the locations specified above, use Cyberduck to verify their permissions. I changed them to match the permissions of the other files in those folders, 755. They probably won't run unless you do this step.

**4.** Test your setup. Note that LaunchCTL won't automatically notice changes you've made to the LaunchDaemons folder. You can use the following commands (again via SSH) to check its status and get it to update, or you can just reboot. What I did for testing was set the .plist to run 1 or 2 minutes in the future, use the first "list" command to verify that the .plist was being recognized, then watch to make sure everything ran as expected.

Terminal commands:

- List .plists that are being recognized: `launchctl list`
- Load my new .plist (change to suit your .plist name):

```bash
launchctl load /System/Library/LaunchDaemons/com.n8henrie.morningUpdates.plist
```

- Unload / load to refresh my new .plist to reflect changes (change to suit your .plist name):

```bash
launchctl unload /System/Library/LaunchDaemons/com.n8henrie.morningUpdates.plist && launchctl load /System/Library/LaunchDaemons/com.n8henrie.morningUpdates.plist
```

I think this about it. The only other issue I ran into (still unresolved) is that I can't find how to issue a Terminal command to simulate a home button press / return to home button. As you can see in the above code, I just left my iPhone open to Sparrow so I could review my email when I wake up. If you'd like to return your device to the home screen, a few options include "killall appName" to kill the app you're in, or "killall SpringBoard" to respring.

I'm about to run out of battery, so it's time to end this post. Please leave comments, questions, and suggestions for improvement in the comments section below, and thanks for reading!
