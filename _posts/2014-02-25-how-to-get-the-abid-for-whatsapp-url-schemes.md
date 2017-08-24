---
id: 2481
title: How to get the ABID for WhatsApp URL Schemes
date: 2014-02-25T14:36:48+00:00
author: n8henrie
excerpt: "Here's how to get all your WhatsApp ABIDs for use in Launch Center Pro URL schemes."
layout: post
guid: http://n8henrie.com/?p=2481
permalink: /2014/02/how-to-get-the-abid-for-whatsapp-url-schemes/
dsq_thread_id:
  - 2321138016
disqus_identifier: 2481 http://n8henrie.com/?p=2481
tags:
- iPad
- iPhone
- LCP
- Terminal
categories:
- tech
---
**Bottom Line:** Here's how to get all your WhatsApp ABIDs for use in Launch Center Pro URL schemes.<!--more-->

I'm actually not a big <a target="_blank" href="https://itunes.apple.com/us/app/whatsapp-messenger/id310633997?mt=8&at=10l5H6" title="WhatsApp Messenger">WhatsApp</a> user, but I recently discovered I could use it to send "silent" text messages to my girlfriend when she might (or might not) be sleeping. (Basically, a text that gives a "can't miss it visually" pop-up banner, but doesn't make any sound or vibration. That way, if she's asleep it won't wake her but she'll see it as soon as she gets up and looks at her phone. If she's already awake, she should see it relatively quickly as well.) While `Do Not Disturb` fulfills this function nicely, we both have very irregular schedules don't always remember to manually trigger it.

Because I don't use WhatsApp that frequently, and I'll really only be using it for one recipient for now, I was hoping for a way to integrate with <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&at=10l5H6" title="Launch Center Pro for iPhone">Launch Center Pro</a> (also now with <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro-for-ipad/id799664902?mt=8&uo=4&at=10l5H6" title="Launch Center Pro for iPad">iPad version</a>) so I could leave WhatsApp in my archive folder and still have a quick way to fire off a silent text. Sure enough, WhatsApp has a reasonable URL scheme, but unfortunately it requires an `ABID` parameter to specify a recipient — and there doesn't seem to be any way to get this `ABID` from the app itself.

<a target="_blank" href="https://twitter.com/viticci">Federico Viticci</a> has already done a great job <a target="_blank" href="http://www.macstories.net/tutorials/use-whatsapps-url-scheme-with-drafts-launch-center-pro-or-a-bookmarklet/">covering this problem</a>, including one solution to get the `ABID`s for certain contacts. Unfortunately, I think the iCloud method he describes only works for people you've already contacted / with whom you have a chat thread started. Not useful for me, since I don't really have any going in the first place.

Here's my proposed solution, which only requires free software and doesn't require a jailbreak (OSX).

  1. Download <a target="_blank" href="http://www.i-funbox.com/ifunboxmac/" title="iFunBox for Mac | File Manager, Browser, Explorer, Transferer ...">iFunBox</a>, which allows you to browse a decent amount of your iPhone's storage and app data _without a jailbreak_.
  2. Navigate to `User Applications -> WhatsApp -> Documents -> Contacts.sqlite`
  3. Copy this file to your computer
  4. Open Terminal.app and `cd` to the directory containing `Contacts.sqlite` (e.g. `cd ~/Desktop`)
  5. Run the following code, line by line:

```shell_session
sqlite3 Contacts.sqlite
.headers on
.mode csv
.output whatsapp_addressbook.csv
select ZFULLNAME, ZABUSERID from ZWACONTACT order by ZFULLNAME;
```

**Make sure you get the** `;` **on that last line.**

This uses your Mac's built in `sqlite3` to export a .csv file of all your WhatsApp contacts and their respective `ABID`s, sorted by (first) name.

The output file `whatsapp_addressbook.csv` should be in the same directory, and should look something like:

```plaintext
ZFULLNAME,ZABUSERID
John Doe,592
Jane Doe,29
```

You can now make a Launch Center Pro action like `whatsapp://send?text=[prompt:Text]&abid=45` that will prompt you for text and put it into a WhatsApp message to a given contact (you'll still have to hit the `Send` button afterward).

Further, you can set the action up to let you choose the recipient from a list of common WhatsApp contacts: `whatsapp://send?abid=[list:Recipient|John=592|Jane=29]&text=[prompt:Text]`.

Finally, I recommend taking the `whatsapp_addressbook.csv` and putting it in your Dropbox or somewhere that you can access it from your iOS device, in case you're writing URL schemes on-the-go. Remember, the whole reason the iFunBox and sqlite3 stuff is necessary is that I don't think you can find the `ABID` from your iOS device itself. (If someone can figure out a way with <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&uo=4&at=10l5H6" title="Pythonista">Pythonista</a>... that would be awesome.)
