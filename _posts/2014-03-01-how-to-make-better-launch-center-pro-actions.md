---
id: 2489
title: How to Make Better Launch Center Pro Actions
date: 2014-03-01T13:33:36+00:00
author: n8henrie
excerpt: Create more intricate LCP actions by using lists that run totally different URL actions.
layout: post
guid: http://n8henrie.com/?p=2489
permalink: /2014/03/how-to-make-better-launch-center-pro-actions/
dsq_thread_id:
  - 2342146903
disqus_identifier: 2489 http://n8henrie.com/?p=2489
tags:
- Drafts
- iPad
- iPhone
- LCP
categories:
- tech
---
**Bottom Line:** Create more intricate LCP actions by using lists that run totally different URL actions.<!--more-->

As much as anything, the purpose of this post is to celebrate my discovery of <a target="_blank" href="http://philgr.com">philgr.com</a>, where <a target="_blank" href="https://twitter.com/pgruneich">Phillip Gruneich</a> has some incredible posts detailing impressively rich and complex <a target="_blank" href="http://x-callback-url.com/" title="x-callback-url">x-callback-url</a> based workflows for iOS. His workflows center on the usual suspects: <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&at=10l5H6" title="Launch Center Pro for iPhone">Launch Center Pro</a>, <a target="_blank" href="https://itunes.apple.com/us/app/drafts-quickly-capture-notes/id502385074?mt=8&at=10l5H6" title="Drafts for iPhone">Drafts</a>, and one I haven't bought (yet): <a target="_blank" href="https://itunes.apple.com/us/app/texttool/id751972884?mt=8&uo=4&at=10l5H6" title="TextTool">TextTool</a>.

The most important thing I learned from browsing his blog the other night was how to launch different LCP actions based on selection from a list. This had been driving me nuts, because I was sure there would be a way... for example, to prompt for a search query, then choose from a list which search engine to use (perhaps Google in Chrome vs Google in Safari vs Wolfram Alpha vs other).

The answer lies in getting LCP to call _itself_ by using a pattern like:

```plaintext
launch://?url=[[list:List Title|Option1=url1%3A%2F%2Furl1stuff%2Fhere|Option2=url2%3A%2F%2Furl2stuff%2Fhere]]
```

Let's break it down piece by piece.

  * `launch://?url=` Call LCP and tell it to run the following URL
  * `[[` Double brackets <del datetime="2014-08-05T05:34:51+00:00">mean "don't try to url-encode this stuff" — stopping LCP from doing what is normally helpful, but screw stuff up with these more complicated URL schemes</del> <a href="http://help.contrast.co/hc/en-us/articles/202600703-2-3-1-Release-Notes-Parsing-Changes-" target="_blank">are deprecated as of LCP 2.3.1</a>
  * `list:List Title` Make a `list` with title `List Title`
  * `|` Very important — separates components of the list, like title from options, and one option from another
  * `Option1=` The title of the first option, with the `=` denoting that everything afterward and up to the next `|` is the _value_ of that option
  * `url1%3A%2F%2Furl1stuff%2Fhere` This is just an _already URL encoded_ version of `url1://url1stuff/here`, or in other words where you'd put your
    `drafts://x-callback-url/create?text=some%20text&action=some%20action`

  * `Option2=url2%3A%2F%2Furl2stuff%2Fhere]]` Should hopefully make sense by now

Go browse around <a target="_blank" href="http://philgr.com">philgr.com</a> (and <a target="_blank" href="http://www.macstories.net">macstories</a> of course) for countless examples of how this pattern can be put to use. Of course something that might just help you along the way is a quick and easy way to URL encode and decode... so not to get <a target="_blank" href="https://xkcd.com/1313/">too meta</a> but here is my first useful URL scheme I've created with this pattern. It's all LCP, no other apps required. It

  1. prompts the user for input text
  2. prompts to choose either URL encode or decode
  3. copies the resulting text to the clipboard

<a target="_blank" href="http://launchcenterpro.com/3dm187">Download to your iOS device</a>

<script src="https://gist.github.com/n8henrie/9296459.js"></script>
