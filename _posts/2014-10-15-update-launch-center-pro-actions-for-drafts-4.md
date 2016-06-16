---
id: 2675
title: Batch Update Launch Center Pro Actions for Drafts 4
date: 2014-10-15T18:31:44+00:00
author: n8henrie
excerpt: "Here's how to use my lcp_export script to batch update your Launch Center Pro actions to work with the new Drafts 4."
layout: post
guid: http://n8henrie.com/?p=2675
permalink: /2014/10/update-launch-center-pro-actions-for-drafts-4/
dsq_thread_id:
  - 3121247923
---
**Bottom Line:** Here&#8217;s how to use my lcp_export script to batch update your Launch Center Pro actions to work with the new Drafts 4.<!--more-->

<a href="https://itunes.apple.com/us/app/drafts-4-quickly-capture-notes/id905337691?mt=8&uo=4&at=10l5H6" target="_blank" title="Drafts 4 - Quickly Capture Notes, Share Anywhere!">Drafts 4</a> is out, and it looks pretty sweet. It does <a href="https://agiletortoise.zendesk.com/hc/en-us/articles/202771400-Drafts-URL-Schemes" target="_blank">change the URL scheme</a> slightly but predictably, from `drafts:`to `drafts4:`, or from `drafts://x-callback-url/` to `x-drafts4://x-callback-url/`, respectively.

If you&#8217;re reading this, I&#8217;m guessing you have a fair number of <a href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&uo=4&at=10l5H6" target="_blank" title="Launch Center Pro">Launch Center Pro</a> actions that need to be updated to use Drafts 4. You&#8217;re in luck &#8212; my [lcp_export](http://n8henrie.com/2014/06/lcp_url_schemes_on_macbook/) script seems to take most of the work out and lets you make the changes on your Mac. You&#8217;ll probably want to review that post to remind yourself how it works. Here&#8217;s how I did mine. 

This assumes you have `lcp_export.py` installed from the post linked above. `file.lcpbackup` and `file.json` are placeholders, obviously, so you&#8217;ll need to modify the commands to match your filenames. Also note that this won&#8217;t update for any URL incompatibilities introduced by Drafts 4 &#8212; it just changes the x-callback-url prefix. 

  1. Make two backups from LCP `Settings` -> `Backups` -> `Back Up Now`. One is a spare just to play it safe.
  2. Get the backup onto your computer, presumably through Dropbox.
  3. `cd` to the directory of the backup file, and `python3 /path/to/lcp_export.py -read file.lcpbackup`. Make note of the `.json` file it outputs.
  4. Use <a href="http://beyondgrep.com/" target="_blank" title="Beyond grep: ack 2.14, a source code search tool for programmers"><code>ack</code></a> (or `grep`) to take a look at the actions in question: `grep "drafts:" file.json`.
  5. Use <a href="http://stackoverflow.com/questions/26210596/best-way-to-test-perl-pi-e-one-liner-before-execution" target="_blank" title="regex - Best way to test perl -pi -e one-liner before execution? - Stack Overflow">this perl regex</a> to preview the changes: `perl -ne 'if (s#\"drafts:(//|\")#\"x-drafts4:\1#g) { print "$ARGV\t"; print }' file.json` . Compare with the `grep` output to make sure you&#8217;re changing all the URLs but none of the names or actions.
  6. If everything looks good, save the regex but get rid of the `print` statement and use <a href="http://technosophos.com/2009/05/21/perl-pie-if-you-only-learn-how-do-one-thing-perl-it.html" target="_blank" title="TechnoSophos: Perl Pie: If you only learn how to do one thing with ..."><code>perl pie</code></a> instead to make the changes. `perl -pi -e 's#\"drafts:(//|\")#\"x-drafts4:\1#g' file.json`
  7. Verify the changes: `grep "x-drafts4:" file.json`
  8. Re-write the lcpbackup file: `python3 /path/to/lcp_export.py -write file.json`
  9. Load back into LCP. `Settings` -> `Backups`, pull to refresh, choose the `_binary` backup (should be the most recent one, top of the list).

All the commands together in a possibly more readable code section:

<pre><code class="shell">python3 /path/to/lcp_export.py -read file.lcpbackup
grep "drafts:" file.json
perl -ne 'if (s#\"drafts:(//|\")#\"x-drafts4:\1#g) { print "$ARGV\t"; print }' file.json
perl -pi -e 's#\"drafts:(//|\")#\"x-drafts4:\1#g' file.json
grep "x-drafts4:" file.json
python3 /path/to/lcp_export.py -write file.json</code></pre>

Seems to do the trick. Let me know in the comments section if you run into issues.