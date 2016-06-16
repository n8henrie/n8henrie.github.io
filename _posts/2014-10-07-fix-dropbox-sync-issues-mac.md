---
id: 2652
title: How to Fix Persistent Dropbox Sync Issues on a Mac
date: 2014-10-07T10:15:15+00:00
author: n8henrie
excerpt: "Try deleting the filecache.dbx file if you have a sync problem that isn't fixed by following the official Dropbox instructions."
layout: post
guid: http://n8henrie.com/?p=2652
permalink: /2014/10/fix-dropbox-sync-issues-mac/
dsq_thread_id:
  - 3092605726
---
**Bottom Line:** Try deleting the filecache.dbx file if you have a sync problem that isn&#8217;t fixed by following the official Dropbox instructions.<!--more-->

I had a persistent sync issues with Dropbox for several weeks &#8212; it was running continuously and revving up the CPU on my Mac (as shown in Activity Monitor). It would show the &#8220;syncing&#8221; icon in the task bar, and if I clicked to see what was syncing, it would just cycle between tens of thousands of files to sync, then thousands, then hundreds, then just a few&#8230; and then jump back up to several thousand.

I think it probable has something to do with me keeping a few git repositories and virtualenvs in Dropbox (mostly for the automated backup, which has come in handy).

The first few things I tried were following the <a target="_blank" href="https://www.dropbox.com/en/help/72">official Dropbox instructions</a> for this problem. Unfortunately, it required me to re-set all my  &#8220;Selective Sync&#8221; settings. Even worse, it didn&#8217;t fix the issue.

Next, I tried checking for problematic files using a Dropbox-hosted tool I didn&#8217;t even know about: <a target="_blank" href="https://www.dropbox.com/bad_files_check">https://www.dropbox.com/bad_files_check</a>. I found a handful of files with invalid file names, which I either renamed or deleted. (By the way, I have to mention this great <a target="_blank" href="http://plasmasturm.org/code/rename">rename</a> utility available in <a target="_blank" href="http://brew.sh/" title="Homebrew — The missing package manager for OS X">Homebrew</a>, `brew install rename`). Unfortunately, that didn&#8217;t work, either.

Next, I found out that Dropbox (v2.10.30) has a hidden &#8220;fix permissions&#8221; tool. It&#8217;s hidden behind the `Unlink This Dropbox` button in the `Account` tab in Dropbox&#8217;s preferences &#8212; you have to hold down the `option` button to reveal it. For some strange reason, _it doesn&#8217;t show up on my Mac unless I first click another button on that tab_. However, if I click the Selective Sync&#8217;s `Change Settings...` button, I can then hit `esc` to get back out of that screen, and suddenly the `Fix Permissions` button shows up when I hit `option.` Weird.

Once again, that didn&#8217;t fix my issue. Neither did numerous restarts, or repairing permissions on my Mac. I _did_ find that deleting the `~/.dropbox` folder fixed the issue for a while, but it made me reset selective sync settings and such&#8230; and when the problem came back, I didn&#8217;t want to go through that again, so I set out to find what it was in that folder that fixed the issue.

The solution I&#8217;ve finally come up with is that deleting `~/.dropbox/instance1/filecache.dbx` seems to be the fix. Because I have a suspicion this is related to git / virtualenv and Dropbox, I assume there&#8217;s some component of permissions problems, so I&#8217;ve been repairing permissions as well (but as I said, this alone doesn&#8217;t fix the problem).

Because people may have different paths for their Dropbox, I can&#8217;t say this will work for everyone, but it might be worth a shot if you&#8217;re going nuts over this problem like I was. If you know your Dropbox installation is not immediately under your home folder, you&#8217;ll need to change the commands slightly, but this should work for a default installation.

  1. If you haven&#8217;t already, you should probable try the &#8220;official&#8221; fixes first (see above).
  2. Repair Dropbox permissions as described above (`Preferences` -> `Account` -> click something, then hit `escape`, then `option` to reveal the button).
  3. **Quit Dropbox.**
  4. Open up `/Applications/Utilities/Terminal.app`. Caution &#8212; if you don&#8217;t know what you&#8217;re doing, typing the wrong command in Terminal could be a disaster.
  5. Copy and paste in this command: 
<pre><code class="bash">[ -f ~/.dropbox/instance1/filecache.dbx ] && echo "File exists"'!' || echo "Sorry, I don't see the right file."&lt;/pre>
&lt;li>If it says that the file exists, type the command below. Otherwise, you'll have to search around and find &lt;code>filecache.dbx</code>.</li>


<pre><code class="bash">[ -f ~/.dropbox/instance1/filecache.dbx ] && rm ~/.dropbox/instance1/filecache.dbx</pre>
<li>Restart Dropbox.</li>
</ol>
<p>Hopefully you'll find that Dropbox has to do a little sync to catch up, but afterwards works as expected.</p>