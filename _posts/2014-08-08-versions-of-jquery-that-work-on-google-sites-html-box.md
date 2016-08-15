---
id: 2607
title: Versions of jQuery that Work on Google Sites HTML Box
date: 2014-08-08T14:17:49+00:00
author: n8henrie
excerpt: These are the version of jQuery you can use in a Google Sites HTML box as of 20140808 (list at the bottom).
layout: post
guid: http://n8henrie.com/?p=2607
permalink: /2014/08/versions-of-jquery-that-work-on-google-sites-html-box/
dsq_thread_id:
  - 2911716655
disqus_identifier: 2607 http://n8henrie.com/?p=2607
---
**Bottom Line:** These are the version of jQuery you can use in a Google Sites HTML box as of 20140808 (list at the bottom).<!--more-->

As I&#8217;ve [recently mentioned](http://n8henrie.com/tag/javascript/), I&#8217;m starting to learn some JavaScript. One of my current projects is hosted on <a target="_blank" href="https://sites.google.com/" title="Google Sites">Google Sites</a>, since it&#8217;s free and offers a relatively user friendly GUI for collaboration with people less inclined to work directly with HTML / CSS / etc. It is going okay, but Google Sites certainly has caused me some frustration with its limitations.

For example, I&#8217;m learning to use jQuery. In Google Sites, Google lets you put (some) JavaScript into an `HTML Box` that you can easily place on a page (`Insert` -> `HTML Box`). They helpfully <a target="_blank" href="https://support.google.com/sites/answer/2500646">explicitly allow jQuery</a>:

> You can link script tags to jQuery (For example, https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js). Versions 1.6 and newer are supported.

&#8220;Great!&#8221; I thought. I used <a target="_blank" href="http://jsfiddle.net/" title="JSFiddle: Create a new fiddle">jsfiddle</a> to write up a little jQuery `.hover()` function for my first ever mouseover effect. Not knowing any jQuery, I figured I&#8217;d start with a pretty recent version. You can see <a target="_blank" href="http://jsfiddle.net/n8henrie/dfo9fqz0/">my jsfiddle here</a>, but it&#8217;s something to the effect of:

<pre><div id='jquery_mouseover'>
  <p>
    Watch me change!
  </p>
  
</div>

</pre>

It worked pretty well, so I threw it in the HTML Box in Google Sites&#8230; and got an error: `failed to load external url jquery.min.js`, highlighting my `src=` link to Google&#8217;s own hosted jQuery 2.1.0. I saved the HTML Box anyway, and (of course) my little script didn&#8217;t work.

I went back to <a target="_blank" href="https://developers.google.com/speed/libraries/devguide?csw=1#jquery">Google&#8217;s own link about jQuery</a>, and noted that they explicitly list versions:

> 2.1.1, 2.1.0, 2.0.3, 2.0.2, 2.0.1, 2.0.0, 1.11.1, 1.11.0, 1.10.2, 1.10.1, 1.10.0, 1.9.1, 1.9.0, 1.8.3, 1.8.2, 1.8.1, 1.8.0, 1.7.2, 1.7.1, 1.7.0, 1.6.4, 1.6.3, 1.6.2, 1.6.1, 1.6.0, 1.5.2, 1.5.1, 1.5.0, 1.4.4, 1.4.3, 1.4.2, 1.4.1, 1.4.0, 1.3.2, 1.3.1, 1.3.0, 1.2.6, 1.2.3

Weird. So 2.1.0 didn&#8217;t work, even though it&#8217;s on the list. So I went back and tried 2.1.1 by changing the relevant line to `<script src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>`. No luck, still with the same error in the HTML Box. Same with 2.0.3.

However, with 2.0.2&#8230; eureka! The yellow error message went away. Surely I was on the right track. **Nope.**

For some reason, it _looks_ like it&#8217;s going to work, but the script itself just doesn&#8217;t work. Some errors appear in the console about `Uncaught script error: Cannot define numeric properties`. _What a pain._

Next, I figured I should check the links Google was providing to ensure they were all working. I wrote a quick Bash script so I could copy and paste in the version numbers, and it would echo the http response code.

<pre>for num in 2.1.1, 2.1.0, 2.0.3, 2.0.2, 2.0.1, 2.0.0, 1.11.1, 1.11.0, 1.10.2, 1.10.1, 1.10.0, 1.9.1, 1.9.0, 1.8.3, 1.8.2, 1.8.1, 1.8.0, 1.7.2, 1.7.1, 1.7.0, 1.6.4, 1.6.3, 1.6.2, 1.6.1, 1.6.0, 1.5.2, 1.5.1, 1.5.0, 1.4.4, 1.4.3, 1.4.2, 1.4.1, 1.4.0, 1.3.2, 1.3.1, 1.3.0, 1.2.6, 1.2.3; do echo $num | tr -d ',' | (read clean; echo "$clean: "$(curl -s -o /dev/null -w "%{http_code}" http://ajax.googleapis.com/ajax/libs/jquery/$clean/jquery.min.js)); done
</pre>

It gave me `200` for all of them, so the links seem to be working.

Next I decided to just see if I could try to import each different version of jQuery and print out the version number. It took a bit of regex fun in <a target="_blank" href="https://itunes.apple.com/us/app/textwrangler/id404010395?mt=12&uo=4&at=10l5H6" title="TextWrangler">TextWrangler</a>, but it worked. The code ended up being a bit long, so I&#8217;m not going to embed it, but you can <a target="_blank" href="https://gist.github.com/n8henrie/d77f547d795ef096e259">see it here</a>. You should be able to C&P it into a Google Sites HTML Box, and it will print out the versions of jQuery that are working. You&#8217;ll likely get some duplicates&#8230; to be honest, I&#8217;m not sure why that is.

Anyway, here is the output I got, 

## Versions of jQuery that are working in Google Sites HTML Box as of Fri Aug 08 2014 12:55:21 GMT-0600 (MDT)

  * 1.10.1
  * 1.9.0
  * 1.8.3
  * 1.8.2
  * 1.8.1
  * 1.8.0
  * 1.7.2
  * 1.7.1
  * 1.7
  * 1.6.4
  * 1.6.3
  * 1.6.2
  * 1.6.1
  * 1.6

Sure enough, I changed my original jQuery `src=` to `1.10.1` and it worked just fine. Anyway, since I didn&#8217;t have much luck finding this info on StackOverflow or a few quick Google searches, I figured I&#8217;d post it and perhaps save someone out there the trouble.