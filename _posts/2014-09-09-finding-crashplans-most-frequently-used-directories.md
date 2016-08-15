---
id: 2625
title: 'Finding CrashPlan&#8217;s Most Frequently Used Directories'
date: 2014-09-09T10:58:55+00:00
author: n8henrie
excerpt: I wrote a script to go through my CrashPlan log and find out which directories were being backed up most frequently.
layout: post
guid: http://n8henrie.com/?p=2625
permalink: /2014/09/finding-crashplans-most-frequently-used-directories/
dsq_thread_id:
  - 2997360055
disqus_identifier: 2625 http://n8henrie.com/?p=2625
---
**Bottom Line:** I wrote a script to go through my CrashPlan log and find out which directories were being backed up most frequently.<!--more-->

I have a local CrashPlan backup that goes to my Raspberry Pi. It could be a little faster, but it generally works pretty well. 

A week or so ago, I finally completed a full sync after not having done so in a couple weeks. The next day, I noticed that I already had a few GB of changes queued up to sync, after relatively light use and no new large files I could think of. I was curious as to what was going on, so I went searching through my CrashPlan logs.

Unfortunately, just looking at the raw logs didn&#8217;t give me the best idea &#8212; there are just too many files to wrap my head around. So instead, I wrote up a quick script that sorts through the most recent log of backed up files and outputs a text file with the name of each directory and number of times it was referenced in the backup log, sorted by count. I found that there were several directories that had _tons_ of frequently modified files that I didn&#8217;t really need to be backing up at all. I added these directories to CrashPlan&#8217;s `Settings` -> `Backup` -> `Filename exclusions:` and have been pleased with the results.