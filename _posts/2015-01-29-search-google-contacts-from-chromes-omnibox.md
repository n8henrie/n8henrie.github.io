---
id: 2683
title: 'Search Google Contacts from Chrome’s Omnibox'
date: 2015-01-29T09:56:27+00:00
author: n8henrie
excerpt: "Here's a quick and easy way to search your Google Contacts from the Chrome Omnibox (address bar)."
layout: post
guid: http://n8henrie.com/?p=2683
permalink: /2015/01/search-google-contacts-from-chromes-omnibox/
dsq_thread_id:
  - 3467067419
disqus_identifier: 2683 http://n8henrie.com/?p=2683
tags:
- Chrome
- productivity
categories:
- tech
---
**Bottom Line:** Here’s a quick and easy way to search your Google Contacts from the Chrome Omnibox (address bar).<!--more-->

I hate losing people’s contact information, but I also hate having a cluttered and bloated contact list. My solution for years now is to keep my “active” contacts on my iPhone, and a separate archive of all contacts in Google Contacts. I **don’t** sync my Google Contacts to my devices, it basically just acts as a backup.

I have a script on my Mac that runs once a month that exports all my contacts from Address Book / Contacts into a `.vcf` card and opens up Google Contacts, so the next time I open my computer, I import the `.vcf` card, delete the “import group” that’s automatically created, and `Merge Duplicates`.

Every once in a while, I get a text or miss a call from an unknown number on my iPhone. My system makes it really easy to just search for that number (or part of it — I usually just do the last 4 digits) in my Google Contacts, and in just a few seconds I can verify whether or not it’s someone whose number I’ve ever known. At least in the last decade or so.

To make this even easier, I turned it into a Chrome Custom Search for the Omnibox. Here’s how to do it on a Mac (likely similar on a PC).

  1. Right click on the address bar -> `Edit Search Engines...`
  2. Enter the following:

Name | Keyword | URL
--- | --- | ---
Google Contacts | Contacts | `https://www.google.com/contacts/u/0/#contacts/search/%s`

Test it out by typing in the Omnibox: `contacts  ⇥  <the number>`
