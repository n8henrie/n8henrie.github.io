---
id: 1822
title: Backing Up Kindle Quotes with Hazel
date: 2012-12-06T10:31:20+00:00
author: n8henrie
excerpt: "As far as I can tell, Amazon doesn't back up quotes or notes from your personal documents, or really any document not purchased through them."
layout: post
guid: http://www.n8henrie.com/?p=1822
permalink: /2012/12/backing-up-kindle-quotes-with-hazel/
al2fb_facebook_link_id:
  - 506452318_10151274640887319
al2fb_facebook_link_time:
  - 2012-12-06T17:31:26+00:00
al2fb_facebook_link_picture:
  - featured=http://www.n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 961458300
disqus_identifier: 1822 http://n8henrie.com/?p=1822
tags:
- automation
- eBooks
- Kindle
- Mac OSX
categories:
- tech
---
**Bottom line:** [Noodlesoft's Hazel](http://www.noodlesoft.com/hazel.php) can easily back up your Kindle's quotes, highlights, etc. by attaching a script that runs when the Kindle is mounted.
  
<!--more-->

Many of you are likely aware that Amazon can back up the highlights and notes you make from your Kindle (accessible at [kindle.amazon.com](http://kindle.amazon.com)). However, as far as I can tell, it doesn't back up anything from your personal documents, or really anything not purchased through Amazon. So when I make a highlight in a quote I've found through an Instapaper bookmark or an ePub formatted book that I've converted to Kindle format, it doesn't appear to get backed up there.

However, it only took me about 5 minutes to write up a [Hazel](http://www.noodlesoft.com/hazel.php) rule that will automatically back up all my notes and highlights (including personal documents) whenever I connect my Kindle to my Macbook via USB. Here's how I made my rule, there are certainly numerous variations that would work just as well.

  * Attach the rule to /Volumes/Kindle (or whatever your Kindle is named when attached via USB).
  * Rule 1: 
      * Matches: Kind is Folder
      * Action: Run rules on contents
  * Rule 2: 
      * Matches: 
          * Full name is My Clippings.txt
          * Date last modified is after date last matched
      * Action: 
          * Copy to (folder in Dropbox)
          * Rename: yyyymmdd_kindleQuotes.txt

Basically, this rule should run whenever it sees the Kindle is attached, and copy the .txt file where the quotes / bookmarks / highlights are stored to a Dropbox folder I designated (or wherever you like). It then renames the copied file in a format that will be unique so that future backups won't overwrite the current ones. This way, if the file ever becomes corrupt, I should still have all my previous copies.