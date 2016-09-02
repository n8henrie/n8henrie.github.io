---
id: 2081
title: Bitly AppleScript URL Shortener
date: 2013-03-28T10:09:38+00:00
author: n8henrie
excerpt: Just an AppleScript to grab a URL from Chrome or Safari and shorten it with Bitly.
layout: post
guid: http://n8henrie.com/?p=2081
permalink: /2013/03/bitly-applescript-url-shortener/
dsq_thread_id:
  - 1170899394
disqus_identifier: 2081 http://n8henrie.com/?p=2081
tags:
- applescript
- Chrome
- Quicksilver
categories:
- tech
---
**Bottom Line:** This AppleScript grabs a URL from Chrome or Safari and shortens it with Bit.ly. <!--more-->

Sometimes I think Chrome is running slow because of all the extensions I have installed. Yesterday, I found <a target="_blank" href="http://qsapp.com/wiki/Shorten_URL_(AppleScript)">this AppleScript</a> which shortens a URL from <a target="_blank" href="http://qsapp.com/" title="Quicksilver Website">Quicksilver</a>, so I decided to tweak it a bit to grab the URL from the currently active browser (instead of taking it just from Quicksilver). Now I have it set as a hotkey trigger in Quicksilver (with the scope set to only web browsers), so I can just hit that hotkey and it presents a bitly-shortened URL back to Quicksilver. If you’d rather it return the URL to the clipboard (or both), there is a spot you can uncomment to enable that function as well.

Now that it’s running smoothly, I can go ahead and uninstall the link shortener extensions I had installed in Chrome and Safari, which may help them run slightly smoother. To get it set up, you’ll need to input your bitly username and API key toward the beginning of the script. Assuming you have an account, you can get these from <a target="_blank" href="https://bitly.com/a/your_api_key/">https://bitly.com/a/your_api_key/</a>.

On another note, I’m giving a shot to hosting my code snippets at GitHub Gists (instead of Pastebin, which I’ve been using to this point). One disadvantage is that there doesn’t seem to be an easy way to limit the height of a long script. If anybody has a suggestion that doesn’t require a WordPress plugin (since my nvALT / Markdown preview won’t work with that), let me know. Please and thank you.

<script src="https://gist.github.com/n8henrie/5264006.js"></script>
