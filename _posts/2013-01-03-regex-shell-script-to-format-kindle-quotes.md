---
id: 1881
title: Regex Shell Script to Format Kindle Quotes
date: 2013-01-03T16:33:29+00:00
author: n8henrie
excerpt: This script should take your file of Kindle highlights and bookmarks, filter out the bookmarks (leaving only highlights), rearrange them, and output the quote text in blockquotes, followed by a dash, the source, the author, and date it was highlighted (all pulled from the Kindle file).
layout: post
guid: http://n8henrie.com/?p=1881
permalink: /2013/01/regex-shell-script-to-format-kindle-quotes/
al2fb_facebook_link_id:
  - 506452318_10151320156512319
al2fb_facebook_link_time:
  - 2013-01-03T23:33:35+00:00
al2fb_facebook_link_picture:
  - featured=http://n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 1006929165
disqus_identifier: 1881 http://n8henrie.com/?p=1881
tags:
- automation
- eBooks
- bash
- Kindle
- Mac OSX
- quotes
- writing
categories:
- tech
---
**Bottom Line:** I've previously shown how you can [extract your highlights and bookmarks from your Kindle](http://n8henrie.com/2012/12/backing-up-kindle-quotes-with-hazel/), and this is a script to automate formatting them.

<!--more-->

The more I read on my Kindle, the more I like it. One of the major advantages is that eBooks are searchable, so when I know there was a great part in this one book... I can find it quickly. Or if I lose my place, I can find it again easily. Another great thing is that I can easily share content that I think is particularly good.

This little project was a lot of fun – after I found how easy it is to get the .txt file containing my Kindle's quotes and bookmarks, I decided to experiment with automating a bit of formatting. It ended up taking some time, since I hardly know anything at all about the CLI, but it was fun to learn a bit about what people mean by "shell" and "bash," what a shebang is (<a target="_blank" href="http://youtu.be/G2y8Sx4B2Sk?t=2s">http://youtu.be/G2y8Sx4B2Sk</a>), and try my hand at sed, awk, grep, perl, tr. It might not be the most efficient way, but it seems to work.

If you're interested in learning the basics of <a target="_blank" href="http://en.wikipedia.org/wiki/Regex">regex</a>, but this looks like gobbledegook, I'd recommend downloading <a target="_blank" href="http://www.barebones.com/products/TextWrangler/">TextWrangler</a> and start experimenting with its excellent implementation of grep search and replace.

This script should take your file of Kindle highlights and bookmarks, filter out the bookmarks (leaving only highlights), rearrange them, and output the quote text in blockquotes, followed by a dash, the source, the author, and date it was highlighted (all pulled from the Kindle file).

Here's the script. Remember to replace "$1" if you're not using <a target="_blank" href="http://www.noodlesoft.com/hazel.php">Hazel</a> and insert your own [username] in the file path.

```
#!/bin/bash
#relevant post found here: http://n8henrie.com/2013/01/regex-shell-script-to-format-kindle-quotes
tr -s '\r\n' '\t' < "$1" |
    perl -pe 's|(==========)|\n|g' |
    grep -Po "\S.*?Highlight\ Loc\.\ .*?$" |
    perl -pe 's/(.*?)\t- Highlight Loc. .*? (Added on .*?), \d\d:\d\d (A|P)M\t(.*?)\t$/<blockquote>\4<\/blockquote><p>-\1, \2<\/p>\n/g' >"/Users/[username]/Desktop/KindleQuotesFormatted.txt"
```
