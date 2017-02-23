---
id: 2702
title: How to Batch Like All Facebook Posts on a Page with jQuery
date: 2015-03-02T09:51:02+00:00
author: n8henrie
excerpt: |
  Here's how to "Like" all posts on a Facebook page with jQuery.
layout: post
guid: http://n8henrie.com/?p=2702
permalink: /2015/03/how-to-batch-like-all-facebook-posts-on-a-page-with-jquery-2/
dsq_thread_id:
  - 3561243276
disqus_identifier: 2702 http://n8henrie.com/?p=2702
tags:
- automation
- Chrome
- javascript
categories:
- tech
---
**Bottom Line:** Here’s how to “Like” all posts on a Facebook page with jQuery.<!--more-->

Every once in a while we have a special day where hundreds of people may post on your page. I think it’s sweet and nice to read how many people have taken a few seconds out of their day to wish you good luck or congratulations. It can also take a lot of clicking to “Like” every one of those posts. And heaven forbid you miss one, and “Like” everyone else’s.

I figured it wouldn’t be much work to have <a href="http://jquery.com/" target="_blank">jQuery</a> go through and make sure everyone gets a “Like.” I was right.

First, you’ll want to get to a page that has only the posts you’re looking to “Like.” I found this pretty easy, Facebook had set aside a “Story” for my Birthday, and linked it at the top of my aggregated well wishes. The url was something like `https://www.facebook.com/n8henrie/timeline/story?` and a bunch of gibberish afterwards.

Next, I had to load jQuery. You can verify that Facebook doesn’t have jQuery loaded for you by typing `window.jQuery` in the Console. You”ll see it returned `undefined`. When a site doesn’t have it loaded, I usually jump into Chrome’s Developer console and load it with this snippet:

```javascript
var jq = document.createElement('script');
jq.src = "//code.jquery.com/jquery-latest.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
jQuery.noConflict();
```

However, Facebook was blocking it that way, since the host of the script (`jquery.com`) wasn’t on its list of approved script sources.

Instead, I found that I could just open a browser window to <a href="//code.jquery.com/jquery-latest.min.js" target="_blank">the url of the jQuery source</a> (as linked in the code above), copy it into my clipboard, and then paste the code into the Chrome console. Facebook loaded jQuery just fine that way, as verified by again typing `window.jQuery` and seeing that it was no longer undefined.

Once that was done, I right clicked on the “Like” button and found some of the attributes I could use in a jQuery selector to make sure I only got ones that were not yet “Liked” (so that I don’t accidentally “unlike” by running it a second time).

In the end, Here’s what ended up working:

```javascript
$('a.UFILikeLink[title="Like this"]').each(
    function(i, e){
    this.click()
    }
)
```

**Update 20150810:** I only had to change `"Like this"` to `"Like this comment"` to get this to work for a bunch of comments on a picture I posted.

Noted that I _did_ have to scroll down a bit and run the script a second and third time, since it didn’t run on the posts below that hadn’t yet loaded. You may be able to avoid this by just scrolling all the way to the bottom of the page before running it the first time.
