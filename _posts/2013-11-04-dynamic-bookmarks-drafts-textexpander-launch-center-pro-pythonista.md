---
id: 2411
title: Dynamic Bookmarks on iOS with Drafts, TextExpander, Launch Center Pro, and Pythonista
date: 2013-11-04T10:48:39+00:00
author: n8henrie
excerpt: A variety of iOS apps let you build bookmarks that can navigate directly to a page with a dynamic URL as long as the pattern is predictable.
layout: post
guid: http://n8henrie.com/?p=2411
permalink: /2013/11/dynamic-bookmarks-drafts-textexpander-launch-center-pro-pythonista/
dsq_thread_id:
  - 1936122097
disqus_identifier: 2411 http://n8henrie.com/?p=2411
tags:
- automation
- bookmarklet
- Drafts
- iPad
- iPhone
- LCP
- Pythonista
categories:
- tech
---
**Bottom Line:** A variety of iOS apps let you build bookmarks that can navigate directly to a page with a dynamic URL as long as the pattern is predictable.<!--more-->

# Introduction

Lately, I’ve been getting a lot of use of some dynamic bookmarks that I built. When I use the term _dynamic bookmark_, I’m referring to a URL that is _predictable_, but **not static**. For example, let’s pretend that my schedule for November 5th, 2013 is hosted at my website at `http://n8henrie.com/schedule/2013/11/05`. 

Knowing that pattern, I could _predict_ the URL for my schedule for a given day, but I couldn’t make a traditional, static bookmark for anything other than a specific day, which would not be helpful. In comparison, if I could make a bookmark that would dynamically pull today’s date into the proper fields, I could have a one-click solution to pull up my schedule.

One other type of dynamic bookmark that I use frequently is for something like a <a target="_blank" href="http://www.google.com/insidesearch/tipstricks/all.html">site-specific search</a>. If you’ve ever looked at the URL after you’ve searched a site, you might notice that your search term is often visible there. In the same way as going directly to the schedule for a given date, you can skip directly to a search results page by plugging search terms into a URL. Try it yourself: I just searched the Internet Movie Database (IMDb) for “Matrix.” The resulting URL is `http://www.imdb.com/find?q=matrix&s=all`. Copy that URL, change the word `matrix` to another word, and paste it into your browser. (This is also how Chrome’s nifty search box works, and how you can search sites directly with <a target="_blank" href="http://qsapp.com/" title="Quicksilver — Mac OS X at your Fingertips">Quicksilver</a>).

Luckily, there are several options for making these dynamic bookmarks. I’ll go through a few options below, with two examples for each:

  * a bookmark to pull up the n8henrie.com post archive for the current month
  * a bookmark to search n8henrie.com for a given term

# Dynamic Bookmark Setups

## Launch Center Pro and TextExpander Touch

### Date Fill-in

<a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&at=10l5H6">Launch Center Pro</a> (now with a new <a href="https://itunes.apple.com/us/app/launch-center-pro-for-ipad/id799664902?mt=8&at=10l5H6" target="_blank">iPad version</a>) is _perfect_ for this type of thing, and I’ve been finding more and more uses for it as time goes on. In order to be able to dynamically fill in dates, you’ll also need <a target="_blank" href="https://itunes.apple.com/us/app/textexpander/id326180690?mt=8&at=10l5H6">TextExpander Touch</a>, with the proper settings in TextExpander to share snippets. 

Make three separate TE snippets:

  * abbreviation: `.YYYY` (or `:four-digit-year` or what have you) with content: `%Y`
  * abbreviation: `.MM`, content: `%m`
  * abbreviation: `.DD`, content: `%d` (we won’t need this last one, but just to have it)

Now, back in Launch Center Pro, you can make a bookmarklet that employs these TextExpander snippets, such as: `http://n8henrie.com/<.YYYY>/<.DD>`. When you click this bookmark in LCP, TextExpander will fill in the dates, and Safari will open to the current month archive for n8henrie.com.

### Search

For the search bookmark, LCP doesn’t even need TE. Because my site search is set up through Google, the easiest way would be this LCP URL: `http://www.google.com/search?q=[prompt]+site:n8henrie.com`. When clicked, LCP will prompt you to type in your search term, then redirect to a Google site-specific search for that term. Alternatively, a site search like the IMDb example early would be `http://www.imdb.com/find?q=[prompt]&s=all`.

## Drafts

### Date Fill-in

<a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&at=10l5H6" title="Drafts - Agile Tortoise">Drafts</a> is another one of my favorite apps, and one [I’ve posted about](http://n8henrie.com/tag/drafts/) previously. Its method for these bookmarks is a little less obvious, but works just as well. You also don’t need to purchase TextExpander Touch to get the date fill-ins (though you can use TE if you have it).

To make the bookmark, open the in-app settings, go to `URL Actions`, `+` to add new, and for the URL: `http://n8henrie.com/[[date|%Y]]/[[date|%m]]`. Easy as that. To trigger it, just hit the button for the action (whatever you’ve named it) from a blank draft.

Alternatively, if you want to use the TE snippets we made earlier, try a URL like: `http://n8henrie.com/<<.YYYY>>/<<.DD>>` (nearly the same as in LCP). Also, double check your Drafts settings for text expansion: None, Fenced, or All.

### Search

Again, this will be similar to the LCP setup, except we’ll use the open Draft as the search term, and the URL will be `http://www.google.com/search?q=[[draft]]+site:n8henrie.com`

## Pythonista

### Date Fill-in

I’ve also posted about <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&uo=4&at=10l5H6" title="Pythonista">Pythonista</a> a [few times](http://n8henrie.com/tag/pythonista). It definitely requires more work than the other options, but it can also handle far more complex tasks and may be your only option in some cases. An additional advantage is that you can tweak your scripts to be usable on both your Mac as well as your iOS devices. For example, let’s say that you wanted a bookmark that would pull up your schedule for _tomorrow_. Unfortunately, I don’t think that any of the above solutions would allow you to figure this out. Not only do they not support addition, but how would they handle end-of-the-month situations? It’s unlikely that you wanted to see your schedule for the 32nd of November. **Update 20131104 17:42:59:** I was wrong, TextExpander does indeed have <a href="http://smilesoftware.com/blog/entry/textexpander-date-and-time-math" target="_blank">“date math” capabilities</a>, which could bring this feature to the other apps featured in the post. Thanks to <a href="https://twitter.com/ecormany" target="_blank">@ecormany</a> for the heads up.

I’ll change my n8henrie.com archive example and make a bookmarklet for the archive from 6 weeks prior to the current date to illustrate.



FYI, the only tweak I needed to make this script work on my Macbook was the safari_prefix part (Pythonista requires `safari-http`). On my Raspberry Pi and Ubuntu box, `sys.platform == 'linux2'`, not sure about windows.

### Search

The search URL is similar, except that Python on OS X doesn’t have such a simple drop-in replacement for `console` on Pythonista, so to make it work on both you’d probably want to use something like <a target="_blank" href="http://easygui.sourceforge.net">EasyGUI</a> in a try / except.



# Conclusion

Keep in mind that you can also build inter-app URLs that would let you launch one of these bookmarks from a different app. For example, you could build a complex “dynamic bookmark” in Pythonista and put a `pythonista://my_awesome_script?action=run` URL in Launch Center Pro to invoke the Pythonista bookmark. You could even pass over a variable or two with the prompt or TextExpander snippets by tacking on `&args=foo%20bar` to the end. More details on this topic <a target="_blank" href="http://omz-software.com/pythonista/docs/ios/urlscheme.html">here</a>.

Well, hope some of you find these dynamic bookmarks helpful. If you’re able to use these examples to build anything especially useful, please post it in the comments below!