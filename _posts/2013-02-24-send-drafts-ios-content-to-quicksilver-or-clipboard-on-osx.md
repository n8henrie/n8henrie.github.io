---
id: 2021
title: Send Drafts (iOS) Content to Quicksilver or Clipboard on OSX
date: 2013-02-24T11:07:36+00:00
author: n8henrie
excerpt: There are numerous apps whose primary purpose is to share text (or links, images, etc.) between your iOS device and your computer. This is something I thought of today when I was messing around with Drafts and realized it would be easy to script.
layout: post
guid: http://n8henrie.com/?p=2021
permalink: /2013/02/send-drafts-ios-content-to-quicksilver-or-clipboard-on-osx/
dsq_thread_id:
  - 1102206669
disqus_identifier: 2021 http://n8henrie.com/?p=2021
---
**Bottom Line:** This is another way to send text from <a href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&#038;at=10l5H6" title="Drafts Website" target="_blank">Drafts</a> on iOS to either Quicksilver or your Mac&#8217;s clipboard.

<!--more-->

There are numerous apps whose primary purpose is to share text (or links, images, etc.) between your iOS device and your computer. This is something I thought of today when I was messing around with <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&#038;at=10l5H6">Drafts</a> and realized it would be easy to script. It works pretty well, but doesn&#8217;t work for images or files, just text based stuff and links. The way I have it set up also depends on <a target="_blank" href="http://www.noodlesoft.com/hazel.php">Hazel</a>, another one of my favorite Mac apps, but I&#8217;m sure it could also be set up as a folder action / AppleScript.

#### Drafts Setup

The first step is to make a new &#8220;Dropbox Action&#8221; in Drafts. The action should create a new text file in a specific folder in Dropbox. Name the file something unique like &#8220;sendDraftsToClipboard&#8221;, leave the extension as txt, and make sure to select the &#8220;predefined&#8221; option for the name. Leave the contents as **[[draft]]**, which should be the default value.

#### Hazel Setup

Next, set up your Hazel rule to monitor that folder for &#8220;full name&#8221; :: &#8220;is&#8221; :: &#8220;sendDraftsToClipboard.txt&#8221; (or whatever you&#8217;ve chosen). Set the resulting action to &#8220;run shell script,&#8221; do a little time traveling, and choose the external shell script you&#8217;ve saved from below.

#### Shell Script Setup

Here is the script. There are a few places where you can comment or uncomment to customized it a bit. It&#8217;s currently set to delete the text file automatically to ensure that there aren&#8217;t problems with file renaming or anything.



Because sending to the clipboard is otherwise silent, it&#8217;s nice to have some kind of success / failure notification. If you have Growl and <a target="_blank" href="http://growl.info/extras.php#growlnotify">growlnotify</a> installed, adding the following to the end of line 6 (cat and pbcopy stuff) will give you a growl notification for either success or failure.

If you haven&#8217;t noticed, [I&#8217;m a big fan](http://n8henrie.com/tag/quicksilver/) of <a target="_blank" href="http://qsapp.com/">Quicksilver</a>, so I wrote this to be easily modified to send to Quicksilver instead of the clipboard. A second benefit here is that Quicksilver pops up whenever it has successfully received the text, so I know it got through and don&#8217;t need the growlnotify stuff.

In order to get this working with Quicksilver, you&#8217;ll need to have the Command Line Tool plugin installed. It&#8217;s best to find it in the Quicksilver preference pane and install from there, but you can also get it from the <a target="_blank" href="http://qsapp.com/plugins.php">official Quicksilver plugin repository</a>. Unlike other QS plugins, there&#8217;s an extra step: go to the &#8220;preferences&#8221; tab and click &#8220;install&#8221; &#8212; you&#8217;ll need to authenticate as an admin. (Thanks to <a target="_blank" href="https://groups.google.com/forum/?fromgroups=#!topic/blacktree-quicksilver/PJRC0o9ktMM">this thread</a> for that tip.)

[<img src="{{ site.url }}/uploads/2013/02/20130223-ScreenShot-89-300x197.jpg" alt="Extra Step to Install Command Line Tool" width="300" height="197" class="aligncenter size-medium wp-image-2020" srcset="{{ site.url }}/uploads/2013/02/20130223-ScreenShot-89-300x197.jpg 300w, http://n8henrie.com/uploads/2013/02/20130223-ScreenShot-89.jpg 547w" sizes="(max-width: 300px) 100vw, 300px" />]({{ site.url }}/uploads/2013/02/20130223-ScreenShot-89.jpg) 

I recommend _not_ to set Drafts to delete the draft when it&#8217;s sent, since any problems could then lead to you losing whatever data you were trying to send, which can be a pain. Sometimes Dropbox is a little slow, for example. As I&#8217;ve mentioned before, you can always just [send yourself a text with Messages](http://n8henrie.com/2013/02/quickly-import-pythonista-scripts-via-textexpander-or-bookmarklet/).