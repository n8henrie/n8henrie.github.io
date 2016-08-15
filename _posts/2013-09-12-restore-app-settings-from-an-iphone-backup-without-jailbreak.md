---
id: 2387
title: Restore App Settings from an iPhone Backup Without Jailbreak
date: 2013-09-12T17:23:54+00:00
author: n8henrie
excerpt: "This Ruby script turns your iPhone backup folder into regular files so you can restore individual apps' preferences."
layout: post
guid: http://n8henrie.com/?p=2387
permalink: /2013/09/restore-app-settings-from-an-iphone-backup-without-jailbreak/
dsq_thread_id:
  - 1753819498
disqus_identifier: 2387 http://n8henrie.com/?p=2387
---
**Bottom Line:** This Ruby script turns your iPhone backup folder into regular files so you can restore individual apps’ preferences.<!--more-->

> The most important part of this post is <a target="_blank" href="http://stackoverflow.com/a/9253197/1588795">this Ruby script</a>, posted by <a target="_blank" href="http://stackoverflow.com/users/723716/balzard">Balzard</a> at <a target="_blank" href="http://stackoverflow.com/" title="Stack Overflow">StackOverflow</a>, which you can use in combination with <a target="_blank" href="http://www.i-funbox.com/" title="iFunBox for Windows | File Manager, Browser, Explorer, Transferer ...">iFunBox</a> to restore app data from an **unencrypted** iTunes backup to an iOS device _without a jailbreak._

Every once in a while I decide to “start fresh” with my phone. The problem is restoring the preferences of some apps without restoring _everything_, would would defeat the purpose of starting fresh. For example, I recently decided to install iOS7 from scratch instead of upgrading from iOS6. While I wanted to start with a clean slate and avoid all the settings and useless apps I had accumulated over the last year, there are particular apps whose settings had required a lot of time and effort to get right, and manually re-setting them up sounded like a total bummer.

It seemed like I was stuck choosing between “restore unwanted junk” and “lose wanted junk.” Luckily I found a happy medium. I’m on a Macbook Pro running OSX 10.8.4, iTunes 11.0.5, <a target="_blank" href="https://www.ruby-lang.org">Ruby</a> 2.0.0, <a target="_blank" href="http://www.i-funbox.com/" title="iFunBox for Windows | File Manager, Browser, Explorer, Transferer ...">iFunBox</a> 1.2, and was upgrading from iOS 6.1.3 (or was it 6.1.4?) to iOS 7. I can’t say whether this process will work with other software, and please keep in mind that **you could probably screw things up and lose data,** so make sure you have a tested backup, and a backup of that backup.

## The brief overview: 

  * Before upgrade: 
      * Optional: On your iPhone, screenshot each page of your home screen and each folder’s contents
      * Back up iPhone **unencrypted** to your computer with iTunes
      * **Copy** the backup folder from `~/Application Support/MobileSync/Backup/` to somewhere else (leaving the original preserved “just in case”)
      * Download the Ruby script below to the copy of the backup folder and run it
      * Make sure you now have a bunch of new directories in the backup folder, most of which should have `Library/Preferences` and `Documents` subdirectories
      * Optional: In iTunes Preferences, find your backup in Devices, right click and “Archive” to make sure it’s not overwritten
  * On the iPhone, go to Settings -> Reset and delete all content and settings
  * Optional: Put into recovery mode (unplug, turn off, hold home button and plug into USB) or <a target="_blank" href="http://lmgtfy.com/?q=DFU+mode">DFU mode</a>
  * Upgrade to new operating system without restoring from your backup, set up as new
  * Use iTunes to check the apps that you want reinstalled
  * Close iTunes and use iFunBox to restore the `.plist` files from the `Library/Preferences` directories 

## A little more detail:

Before I un-jailbreak, set up as new, or otherwise do something that will lose the structure of my apps and folders, I like to screenshot everything. Then, in iTunes, you can go to the Apps tab and choose which apps to sync over (checkboxes), and use the panes at the right to organize apps into folders. Use the search box to filter through your apps quickly based on the screenshots, and you can drag and drop directly from the filter into the screens at right.

The backup must be unencrypted for this to work. Check the settings under the “Summary” tab in iTunes, and use the “Back up now” button to make a local backup. The backup will be a folder with a long crazy name in `~/Application Support/MobileSync/Backup/`. Sort by last modification date to figure out which is the right folder. It should be full of files with long crazy names (most of them, anyway).

As stated above, download the Ruby script and place it in the copy you made of the backup folder. In Terminal, you should probably have some version of Ruby already installed; you can check by typing in `which ruby`. It should return the path to Ruby on the next line. If nothing happens, you’ll need to install Ruby, which is beyond the scope of this post. Next, `cd` to the directory in question and make the script executable with `chmod +x parse_iphone_backup.rb`. As is, the script should both output `filenames.txt` with a bunch of info as well as create a normal file directory structure with the backed up data. If you want, you can change these options at the bottom of the script with only very basic familiarity with Ruby. To make this happen, run it without arguments: `./parse_iphone_backup.rb`.

In iFunBox, find the apps under User Applications. Clicking on each app will reveal its subfolders, often including `Documents` and `Library` just like the Backup folder we created. I used <a target="_blank" href="http://qsapp.com">Quicksilver</a> (still my favorite OSX app) to quickly search through the backup folder for the app, then arrow into Library -> Preferences, then drag and drop the `.plist` file(s) into the corresponding Library -> Preferences in iFunBox. To my surprise and delight, it worked like a charm. I also restored the `Documents` folder, some `Application Support` folders (which often didn’t yet exist on the new iOS device), but I didn’t restore any of the Cookies or Caches. Not sure why, just didn’t.

Again, I can’t promise this will work, and I can’t promise that you won’t break something trying, but it sure was a relief for me to restore things like my <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&at=10l5H6" title="Launch Center Pro">Launch Center Pro</a> URL Schemes, my <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&uo=4&at=10l5H6" title="Pythonista">Pythonista</a> scripts, and my <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus-2-for-iphone/id690305341?mt=8&at=10l5H6">OmniFocus</a> settings while still getting the benefits of a totally factory-fresh operating system upgrade.