---
id: 2553
title: How to Edit Launch Center Pro URL Schemes on Your Macbook
date: 2014-06-30T16:15:03+00:00
author: n8henrie
excerpt: "Editing Launch Center Pro URL schemes on your iDevice can be a bit of a pain, so here's a way to do it on your MacBook (in json)."
layout: post
guid: http://n8henrie.com/?p=2553
permalink: /2014/06/lcp_url_schemes_on_macbook/
dsq_thread_id:
  - 2808067008
disqus_identifier: 2553 http://n8henrie.com/?p=2553
---
**Bottom Line:** Editing Launch Center Pro URL schemes on your iDevice can be a bit of a pain, so here’s a way to do it on your MacBook (in json).<!--more-->

I’ve made [a fair number of posts](http://n8henrie.com/tag/lcp/) on <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&at=10l5H6" title="Launch Center Pro">Launch Center Pro</a> — I love it. It’s a great app that I use both in my personal life as well as at work. I can’t begin to tell you about how many uses it has, except to say that if you’re into automation and consider yourself an iOS power user, _you owe it to yourself to give LCP a shot_.

In their recent <a target="_blank" href="http://help.contrast.co/hc/en-us/articles/202600703-2-3-1-Release-Notes-Parsing-Changes-">2.3.1 update</a>, they made composing complex URL schemes much simpler and much more readable. Unfortunately, the change also broke a few of my URL schemes, so I spent some time writing a few scripts to help me fix them. These take advantage of LCP’s in-app Dropbox backup, which creates a binary plist in the form of a `.lcpbackup` file. **The cooler script is at the bottom, so scroll down if you’re impatient.**

**Before you use any of these, use LCP’s in-app backup to make a few extra copies of your current setup, so you can restore to them if needed.** As long as you have a backup you _probably_ will be able to get back to where you started even if something screws up, but [I can’t guarantee it](http://n8henrie.com/disclaimer). 

## [lcp_unquote.py](https://gist.github.com/n8henrie/487474642237e06d2656) {#-lcp_unquote-py-https-gist-github-com-n8henrie-487474642237e06d2656-}

The first script I wrote, <a target="_blank" href="https://gist.github.com/n8henrie/487474642237e06d2656" title="lcp_unquote.py - Gists - GitHub">lcp_unquote.py</a>, just undoes URL encoding. The LCP 2.3.1 update makes much of the manual double or triple URL encoding I used to do unnecessary, and since it’s virtually unreadable in that form, this just tries to change everything back. Note that it takes an `.lcpbackup` file as an argument, e.g. 

<pre>cd /path/to/lcp_backup_folder
python3 /path/to/lcp_unquote.py file.lcpbackup
</pre>

The URL schemes in the resulting file _will probably **still** not work_, but its URL schemes will be much more readable, so you can import it back into Launch Center Pro and manually edit your now readable URL schemes.

## [lcp_export.py](https://gist.github.com/n8henrie/5f256b69a07a43f978b4) {#-lcp_export-py-https-gist-github-com-n8henrie-5f256b69a07a43f978b4-}

I’m pretty excited about the second script, although it’s still fairly hackish and amateur. With the `-read` flag, <a target="_blank" href="https://gist.github.com/n8henrie/5f256b69a07a43f978b4">lcp_export.py</a> takes an `.lcpbackup` file as an argument, strips out the URL schemes, then exports then to a `.json` file. This `.json` file can be opened in your favorite text editor and changed however you like with the convenience of a full-size keyboard and a full-size screen. You can change the URL names and URL scheme contents, but **don’t change the URL IDs**. 

The `-read` flag also exports a copy of the `.lcpbackup` converted to XML format, which can also be opened in a text editor. **The rest of the script depends in part on the XML formatted `.lcpbackup` file, so don’t change it — not even the name. Make a copy if you want to mess around.**

Then with the `-write` flag, it takes your modified `.json` file as an argument, uses the XML formatted `.lcpbackup` file as a template, and inserts these values into a new binary-formatted `.lcpbackup` file, ready to be opened in your iOS device.

Again, probably easiest to use as such:

<pre>cd /path/to/lcp_backup_folder
python3 /path/to/lcp_export.py -read file.lcpbackup
vim output_file.json 
python3 /path/to/lcp_export.py -write modified_file.json
</pre>

For the command line novices out there, you’ll obviously need to change placeholders like `/path/to/lcp_backup_folder`, `/path/to/lcp_export.py`, `file.lcpbackup`, `output_file.json`, and input the correct values for your individual setup. And if you don’t know how to get python3 (check if installed with `which python3`), I recommend you check out <a target="_blank" href="http://brew.sh/" title="Homebrew — The missing package manager for OS X">HomeBrew</a>.

Okay, I’m pooped. Please submit issues in the comments section below. Feel free to modify and customize (though I do appreciate linkbacks / attribution). Hope this helps some of you out there!