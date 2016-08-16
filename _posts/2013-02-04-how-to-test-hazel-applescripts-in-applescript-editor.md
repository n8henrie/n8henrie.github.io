---
id: 1994
title: How to Test Hazel AppleScripts in AppleScript Editor
date: 2013-02-04T22:36:54+00:00
author: n8henrie
excerpt: I frequently post about Hazel and the hundreds of menial, repetitive tasks I can get it to take care of for me (see my posts tagged “automation”). Although it has a great GUI interface for getting some serious work done, I often end up embedding a little AppleScript or shell script.
layout: post
guid: http://n8henrie.com/?p=1994
permalink: /2013/02/how-to-test-hazel-applescripts-in-applescript-editor/
dsq_thread_id:
  - 1065964845
disqus_identifier: 1994 http://n8henrie.com/?p=1994
tags:
- applescript
- automation
- Mac OSX
categories:
- tech
---
**Bottom Line:** You can use AppleScript Editor to test your AppleScripts destined for <a target="_blank" href="http://www.noodlesoft.com/hazel.php">Hazel</a> with this little trick.
  
<!--more-->

I frequently post about <a target="_blank" href="http://www.noodlesoft.com/hazel.php">Hazel</a> and the hundreds of menial, repetitive tasks I can get it to take care of for me (see my posts tagged “[automation](http://n8henrie.com/tag/automation/)”). Although it has a great GUI interface for getting some serious work done, I often end up embedding a little [AppleScript](http://n8henrie.com/tag/applescript) or [shell script](http://n8henrie.com/tag/terminal/).

Because Hazel’s job is to act when it notices a new file in a folder it’s set to monitor, it can be a little frustrating testing and debugging these AppleScripts as I write them. It’s smart enough to not run multiple times on the same file (unless the file changes), but this ends up being a problem when it comes to testing. You drop the file in the folder, the script doesn’t run correctly, then you have to drag it out of the folder and back in again for the next round of testing. Lame, especially or a keyboard navigation junkie like me.

However, I’ve found a little trick that _really_ speeds things up. You might have noticed that Hazel likes to refer to the file being processed as “theFile.” Well, you can just add an alias “theFile” to the top of the script and it will run in AppleScript Editor just like in Hazel, which means you can just **command + R** to run it, tweak more, and repeat, no mousing around or GUI moving files necessary.

As I’ve tried to indicate, you can just use the “property theFile” part for testing a script that will be embedded in Hazel (delete or comment the rest), or include the whole hazelprocessfile jazz for testing external scripts that Hazel will reference. Just uncomment the relevant parts and test away. The fully commented script, as you see it now, is how it should look _after_ testing, when it’s ready for prime-time. (I recommend you keep the parts commented out instead of erasing them in case you need to test more in the future.)

Enjoy!