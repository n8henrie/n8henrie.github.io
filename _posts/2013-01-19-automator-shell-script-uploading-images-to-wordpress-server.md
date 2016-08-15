---
id: 1915
title: Automator and Shell Script for Uploading Images to WordPress Server
date: 2013-01-19T18:09:46+00:00
author: n8henrie
excerpt: Easily make your own CloudApp style image uploading service using Automator and this shell script.
layout: post
guid: http://n8henrie.com/?p=1915
permalink: /2013/01/automator-shell-script-uploading-images-to-wordpress-server/
al2fb_facebook_exclude:
  - 
al2fb_facebook_exclude_video:
  - 
al2fb_facebook_link_id:
  - 506452318_10151348451907319
al2fb_facebook_link_time:
  - 2013-01-20T01:13:31+00:00
al2fb_facebook_link_picture:
  - featured=http://n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 1033649647
disqus_identifier: 1915 http://n8henrie.com/?p=1915
---
**Bottom Line:** Easily make your own <a target="_blank" href="http://getcloudapp.com" title="CloudApp Official Site">CloudApp</a> style image (or other file) uploading service using Automator and the below shell script.
  
<!--more-->

There are a bunch of great services around that let you simply drag and drop a file to upload it to a cloud server and copy the resulting URL to your clipboard. <a target="_blank" href="http://getcloudapp.com" title="CloudApp Official Site">CloudApp</a> is probably my favorite, especially since it supports multiple files at once, or text, no expiration dates, and has a great OSX app with lots of great features (like auto-uploading screenshots).

However, for my blog, the disadvantage to using CloudApp is that the images are hosted remotely, by them. If they ever go away, I could lose access to those images I’ve stored there (unlikely that this would ever happen). Besides, I really just prefer hosting my own images locally so they all get backed up appropriately and whatnot.

Until recently, I’ve been going through a somewhat tedious process of uploading my images to my server, either by

  * Going through the WordPress media library through my browser, requiring many clicks and a login.
  * Accessing my uploads folder via sftp through Cyberduck, then using its “get http link” feature in the right click menu.

If you can’t tell, neither of these options appeals to me particularly. Additionally, I’ve had issues with special characters in image filenames that get all mixed up with “percent encoding.” As far as I can tell, the problem is that the percent encode involves a percent… so somehow things end up getting double and triple percent encoded, and the links break, e.g.

> this that -> this%20that -> this%2520that -> this%2525520that

Anyway, so I decided to roll my own uploading service, and it seems to be working great. Here’s how it happened.

#### Setting up SSH Access {#settingupsshaccess}

First, I had to contact <a target="_blank" href="http://www.namecheap.com/support/livesupport.aspx">NameCheap Live Support</a> to get SSH access enabled on my account, which involved changing my nameservers. They were friendly and helpful, and this took all of 5 minutes

Next, I set up pubkey authorization using a utility NameCheap provides in cPanel. Very nice. Once that was working, I moved on to…

#### Making an Automator Service {#makinganautomatorservice}

I decided to write this as an Automator service for a few reasons. Principally, 

  1. This will add a contextual menu for the script (right click -> services -> n8upload, or whatever you decide to name it).
  2. My favorite app, <a target="_blank" href="http://qsapp.com/">Quicksilver</a>, indexes OSX services, so I can upload a file just as easily from QS.

Instead of writing this all out, I’ll just use a screenshot, which was uploaded by my handy workflow. _Like Inception._<figure> 

![]({{ site.url }}/uploads/2013/01/20130119_20130118-ScreenShot-73.jpg)</figure> 

Note the “receives files from” part and the “pass input” part.

#### The Shell Stuff {#theshellstuff}

Delete everything out of the script space in Automator and replace it with the script below. Delete the extra shebang ( #!/bin/bash ) from the top, as Automator has already included one for you ( Shell: /bin/bash ).

I tried to use comments in the script to describe what each step does, and there are several portions designated by [\*stuff\*] that will need your own info (server names, paths, etc.).



Basically, this script:

  1. Doesn’t touch the original file.
  2. Formulates a new filename by deleting all spaces with tr and replacing all special characters with “_” using sed, thereby avoiding percent encoding issues.
  3. Prepends the new filename with the date (YYYYMMDD_).
  4. Uses scp to copy the file into a folder on your server (default is WordPress’s “uploads”), into a / YYYY / MM subdirectory.
  5. Copies the http:// path to the file to the clipboard.
  6. Issues a Growl notification using <a target="_blank" href="http://growl.info/extras.php">growlnotify</a> that it thinks it worked okay.

One issue is that the clipboard string ends up with an extra newline… i think that’s because of pbcopy. Not going to worry about it right now. **Update: 20130119** Well, for one, I scheduled this post to go live yesterday, but apparently the scheduler failed. Not sure what that’s about. For two, I updated the script so now it supports multiple files without any problems and uses a quick perl slurp to strip the final newline, so you should be able to run the service, paste into your document, and continue writing seamlessly.

I’m pleased with the final product, which lets me right click a file (or select it in <a target="_blank" href="http://qsapp.com/">QS</a>), Services -> n8upload, and in a few seconds my clipboard has a link to the uploaded file on my server, which I can throw right into a post in <a target="_blank" href="http://brettterpstra.com/projects/nvalt/">nvALT</a>, or whatever Markdown editor I’m using that day.