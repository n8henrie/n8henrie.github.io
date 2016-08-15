---
id: 2816
title: Template for more efficient AppleScript Folder Actions
date: 2016-06-13T09:43:00+00:00
author: n8henrie
excerpt: "Here's a template I wrote to help me write and test Applescript Folder Actions more efficiently."
layout: post
guid: http://n8henrie.com/?p=2816
permalink: /2016/06/template-for-more-efficient-applescript-folder-actions/
dsq_thread_id:
  - 4910243718
disqus_identifier: 2816 http://n8henrie.com/?p=2816
---
**Bottom Line:** Here’s a template I wrote to help me write and test Applescript Folder Actions more efficiently.<!--more-->

<a href="https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_folder_actions.html" target="_blank">Folder Actions</a> are a super handy way that Apple has provided to automatically run an action when a new item is added to a folder. It provides easy ways for you to run the action on the file that was added, or even on every file in the folder.

It does _not_ allow you to watch for modifications to files in the folder — for that you have to dive into <a href="https://developer.apple.com/library/prerelease/mac/documentation/Darwin/Reference/ManPages/man5/launchd.plist.5.html" target="_blank">launchd</a> and things like `WatchPaths`, or have a look at <a href="https://www.noodlesoft.com/hazel.php" target="_blank">Hazel</a>.

With these limitations in mind, Folder Actions are still pretty handy — for example, you could have a Dropbox folder where you upload specific images from your mobile devices, and the folder action on your Mac could automatically do something to process those images.

The hardest thing about Folder Actions is that AppleScript can be frustrating to write (for me, at least), and writing what would seem like a “quick script” can end up being a bigger endeavor than I’d thought.

For that reason, when I think I have a type of script that I’ll use frequently, I often put together little template that I can use to derive the others from and speed up the process quite a bit, for example my [template for Quicksilver Actions](http://n8henrie.com/2013/03/template-for-writing-quicksilver-actions-in-applescript/).

For Folder Actions, I’ve been pretty pleased with the template I put together below, so I thought I’d share it. I think it’s pretty self explanatory, but basically it has a `main` function that runs the code, and has two other functions that either feed test files into the main loop or the folder action files, depending on if it is run manually or if it is called as a folder action. In other words, once you fill in the `property` fields up top with a test folder and a test file in that folder, running the script manually in Script Editor should give you identical results as if it had been called as a proper Folder Action by adding the test file to the folder. It seems to be working well to let me get my scripts up and running, and once I’m satisfied I attach them with `/System/Library/CoreServices/Folder Actions Setup.app` and call it a day.