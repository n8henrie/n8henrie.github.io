---
id: 2522
title: Decrypt Chrome Cookies with Python
date: 2014-05-18T15:19:25+00:00
author: n8henrie
excerpt: "Use PyCrypto to decrypt Chrome's cookies for easier requests"
layout: post
guid: http://n8henrie.com/?p=2522
permalink: /2014/05/decrypt-chrome-cookies-with-python/
dsq_thread_id:
  - 2695326330
disqus_identifier: 2522 http://n8henrie.com/?p=2522
---
**Bottom Line:** Use PyCrypto to decrypt Chrome’s cookies for easier Python scraping.<!--more-->

I posted [pyCookieCheat](http://n8henrie.com/2013/11/use-chromes-cookies-for-easier-downloading-with-python-requests/) a while back, which is a quick script using some sqlite3 to steal cookies from Chrome for use in a Python script. The reason this is a big deal, is because it works fairly well to turn a complicated login script and `POST`ing all kinds of url encoded stuff into something much more simple:

```python
url = 'http://n8henrie.com'
cookies = chrome_cookies(url)
html = requests.get(url, cookies=cookies)
```

I’m not saying it works all the time, but it has certainly made a few scraping jobs easier for me (when the page to be scraped is behind a login that writes cookies, obviously).

Recently, both Chrome and Chromium started encrypting their cookies, which broke my script. I’ve seen a few posts on how to decrypt it on Windows, but I couldn’t find any good instructions for Mac or Linux.

It took a little browsing through the Chromium source code, but I was eventually able to come up with a script to decrypt them using PyCrypto, so that I could continue using pyCookieCheat.py. The key parts ended up being:

  * salt is `b'saltysalt'`
  * key length is `16`
  * `iv` is 16 bytes of space `b' ' * 16`
  * on Mac OSX:
      * password is in keychain under `Chrome Safe Storage`
          * I use the excellent <a href="https://pypi.python.org/pypi/keyring" target="_blank">keyring</a> package to get the password
          * You could also use bash: `security find-generic-password -w -s "Chrome Safe Storage"`
      * number of iterations is `1003`
  * on Linux:
      * password is `peanuts`
      * number of iterations is `1`

A few other tricky parts:

  * `v10` gets prepended to the encrypted key
      * the padding at the end of the encrypted value varies based on the number of bytes it needs to pad, but you can strip it off <a target="_blank" href="http://stackoverflow.com/a/14205319">as demonstrated at StackOverflow</a>. </ul>
        I’m sure my code could be improved in about a bazillion ways, but it seems to be working again for me. Hope this can help some of you out there!
