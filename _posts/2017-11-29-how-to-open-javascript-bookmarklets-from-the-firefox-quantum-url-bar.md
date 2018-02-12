---
title: How to Open Javascript Bookmarklets from the Firefox Quantum URL Bar
date: 2017-11-29T09:02:42-07:00
author: n8henrie
layout: post
permalink: /2017/11/how-to-open-javascript-bookmarklets-from-the-firefox-quantum-url-bar/
categories:
- tech
excerpt: "Short answer: about:config -> browser.urlbar.filter.javascript"
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- bugfix
- firefox
---
**Bottom Line:** Firefox filters out javascript bookmarklets unless you change
a setting in `about:config`.
<!--more-->

After many years of Chrome, a few months on Vivaldi, and a few months on
Safari, I've been really enjoying Firefox Quantum for the last couple weeks.
Not only do I really like Mozilla as a company and their focus on privacy and
open source software, but I think that Rust is a really interesting language
with a lot of promise, and it certainly seems to have helped make Firefox
Quantum [*really*
fast](https://blog.mozilla.org/firefox/quantum-performance-test/).

One minor annoyance that I've been struggling with is migrating over all my
Chrome Custom Search Engines, ends up it's not all that difficult -- you can
use the Bookmark manager to basically just make a regular bookmark with the
familiar `%s` pattern to replace your search query, then add a keyword. So for
example: 

![](/uploads/2017/11/firefox-bookmark-manager-screenshot.jpg)

This makes it so I can just type e.g. `sr learnpython` in the address bar and
jump directly to [r/learnpython](https://www.reddit.com/r/learnpython/).
Another really handy one that I use all the time is the Python3 documentation
-- every time there is a new release, I download the docs in html format, then
open the local index file and add the search engine. It ends up looking like:

```plaintext
file:///path/to/python-3.6.3-docs-html/search.html?q=%s&check_keywords=yes&area=default
```

I add the keyword `pydocs`, then anytime I need I can jump to the URL bar and
type e.g. `pydocs configparser` and lightning-fast jump to the relevant docs
(even offline).

Similarly, you can right click on most websites' search boxes and add a shortcut that
way.

However, this post is actually about [javascript
bookmarklets](https://n8henrie.com/2012/08/javascript-bookmarklet-in-chrome/),
which I've used heavily in the past and still use frequently. Firefox has a
really spectacular feature that allows you to quickly [filter your address bar
suggestions by prefixing the query with some predefined
symbols](https://support.mozilla.org/en-US/kb/awesome-bar-search-firefox-bookmarks-history-tabs)
-- taken directly from their support page, 

- Add ^ to search for matches in your browsing history.
- Add * to search for matches in your bookmarks.
- Add + to search for matches in pages you've tagged.
- Add % to search for matches in your currently open tabs.
- Add ~ to search for matches in pages you've typed.
- Add # to search for matches in page titles.
- Add @ to search for matches in web addresses (URLs).
- Add $ to search for matches in suggestions. 

They include a cool example:

> If you still have too many results, you can further restrict the search by
making your search string `mozilla * support #`. Now the autocomplete list
will *only* show bookmarked pages with `mozilla` and `support` in the page
title.

So I thought I'd be able to quickly jump to my ["Add to Pinboard"
bookmarklet](https://pinboard.in/howto/) with something like `* pinboard`, but
for some reason it wasn't showing up -- driving me crazy for weeks. It worked
fine if I clicked on the bookmark manually, ensured I was spelling everything
right, but still no luck. My other (non-javascript) bookmarks showed up just
fine, but none of my bookmarklets appeared.

Today I finally spent a little time trying to figure out the issue, and I [came
across a relevant bug](https://bugzilla.mozilla.org/show_bug.cgi?id=417798)
report that I think explains why these are filtered out by default, and it
mentioned a config setting: `browser.urlbar.filter.javascript`.

I opened `about:config`, clicked the "I accept the risks" warning, and searched
for `browser.urlbar.filter.javascript` -- et viola. Double clicked to toggle to
`false`, and instantly `* pinboard` worked as hoped.

Anyway, hope this helps someone else out there save a little time and
frustration.

A few related posts:

- [Search Google Contacts from Chrome's
  Omnibox](https://n8henrie.com/2015/01/search-google-contacts-from-chromes-omnibox/)
- [Search Amazon Orders from the Chrome
  Omnibar](https://n8henrie.com/2013/12/search-amazon-orders-from-the-chrome-omnibar/)
- [How to Make Javascript Bookmarklet Shortcuts in Google
  Chrome](https://n8henrie.com/2012/08/javascript-bookmarklet-in-chrome/)
