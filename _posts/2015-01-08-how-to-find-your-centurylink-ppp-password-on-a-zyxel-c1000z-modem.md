---
id: 2679
title: How to Find Your CenturyLink PPP Password on a Zyxel C1000Z Modem
date: 2015-01-08T14:39:57+00:00
author: n8henrie
excerpt: "Here's how to find your PPP password for a Zyxel C1000Z modem so you can put it into bridge mode and use your router instead."
layout: post
guid: http://n8henrie.com/?p=2679
permalink: /2015/01/how-to-find-your-centurylink-ppp-password-on-a-zyxel-c1000z-modem/
dsq_thread_id:
  - 3402948536
disqus_identifier: 2679 http://n8henrie.com/?p=2679
---
**Bottom Line:** Here’s how to get your PPP password for a Zyxel C1000Z modem so you can put it into bridge mode and use your router instead.<!--more-->

I recently changed from internet service providers from Comcast to CenturyLink. Overall, I’m pleased with the change (mostly because I’m paying about 1/3 the price for a negligible difference in speed — and I was finally able to turn in all that Comcast TV equipment that’s been sitting in my closet for the last 3 years). But I’m not writing to talk about CenturyLink, I’m writing to show others how I was finally able to get my PPP password from my CenturyLink modem for use with my new(ish) router: an Apple Airport Extreme.

Because the modem generally does the PPP authentication, that’s where we have to look for the credentials. My first attempt was going through the modem configuration pages, where I saw the spaces to input PPP info, with the password obscured by asterisks. I thought I’d be clever and modify the CSS to reveal the password — but it wasn’t there.

Next, I ended up barking up the wrong tree by exporting the config file from the modem and parsing through that. I did find a section that looked promising:

```xml
<DefaultPPPConfig>
<BackupUsername>lastname_firstname@qwest.net</BackupUsername>
<BackupPassword>longpasswordstringwithbunchofstuff=</BackupPassword>
</DefaultPPPConfig>
```

Noting the `=` at the end of the password section, I figured it was probably base64 encoded. Unfortunately, decoding it only left me with `Salted__bunchofoddcharacters`… which didn’t work at all, since I didn’t know their salt or what algorithm they were using.

Finally, I ran across a few links that were instrumental to me figuring everything out:

  * <a href="https://www.muchtall.com/2013/05/23/recovering-the-ppp-username-and-password-from-a-centurylink-actiontec-c1000a" target="_blank">https://www.muchtall.com/2013/05/23/recovering-the-ppp-username-and-password-from-a-centurylink-actiontec-c1000a</a>
  * <a href="http://codyswartz.us/wp/finds/how-to-find-pppoe-password-for-actiontec-pk5000" target="_blank">http://codyswartz.us/wp/finds/how-to-find-pppoe-password-for-actiontec-pk5000</a>

Basically, I followed their instructions to turn on telnet access (making sure to turn it off again afterwards), and ran the below commands (either / or — they should give you the same password).

```shell
telnet 192.168.0.1
ps
# Look for the far left number (process id) of the line that has `ppp` somewhere in it
# Put it instead of `process_id` in the next command
cat proc/process_id/cmdline
```

or, alternatively:

```shell
telnet 192.168.0.1
sh
/usr/bin/pidstat -l -C pppd
```

However, it _still_ wasn’t working with that password. I eventually figured out that it required one more simple step: just base64 decoding. Being a Python guy, I initially did this:

```python
python3 -c 'import base64; import sys; print(base64.b64decode(sys.argv[1]).decode('utf8'))' 'encoded_password'
```

but I later realized I could have saved myself some typing and just done this:

```bash
echo "encoded_password" | base64 --decode
```

Once I had my decoded password, I plugged it into my Airport Extreme with the username from the XML config file `lastname_firstname@qwest.net` and it worked like a charm.
