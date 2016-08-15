---
id: 619
title: How much should I ask for my iPhone 4?
date: 2012-08-23T12:57:41+00:00
author: n8henrie
excerpt: Here I talk about the going prices for used iPhones on Gazelle and eBay.
layout: post
guid: http://www.n8henrie.com/?p=619
permalink: /2012/08/how-much-should-i-ask-for-my-iphone-4/
al2fb_facebook_nolike:
  - 1
al2fb_facebook_nointegrate:
  - 1
al2fb_facebook_image_id:
  - 620
al2fb_facebook_link_id:
  - 506452318_10151119829832319
al2fb_facebook_link_time:
  - 2012-08-23T18:57:43+00:00
al2fb_facebook_link_picture:
  - meta=http://www.n8henrie.com/uploads/2012/08/Sold-300x235.png
dsq_thread_id:
  - 816057120
disqus_identifier: 619 http://n8henrie.com/?p=619
---
**Bottom line:** If you&#8217;re going to upgrade to a new iPhone, you may be able to get more money by selling it yourself than by going with companies that guarantee you a price.
  
<!--more-->

#### Introduction {#introduction}

A day or two ago a couple of my close friends and I were talking about our plans to upgrade to the new iPhone (hopefully soon). One friend mentioned that he was planning on selling his iPhone 4S 16GB to <a target="_blank" href="http://www.gazelle.com/" title="Gazelle">Gazelle</a> for a price that sounded a little low to me. He mentioned that he&#8217;d done his homework on <a target="_blank" href="http://losangeles.craigslist.org">Craigslist</a>, and he expected this to be the going price for his phone.

One major advantage to selling to a company like Gazelle is that they guarantee your sale price and ship you a box with a timeframe of around a month. This means you can lock in a price _before_ the new iPhone is released, at which point sales prices for older iPhones will likely fall precipitously.

Still, the price he mentioned sounded a little low compared to what I was hoping to get for my iPhone 4. I do most of my selling-of-old-stuff on <a target="_blank" href="http://www.ebay.com" title="eBay">eBay</a>, so I told him I&#8217;d do a little investigating and let him know what I found. **So here it is.**

#### Methods {#methods}

First, I went to <a target="_blank" href="http://www.gazelle.com/" title="Gazelle">Gazelle</a> and looked up their offer for a 32 GB AT&T iPhone 4 in &#8220;good&#8221; condition, good through Oct. 1 (a little over a month from now). They&#8217;ll give me **$173**.

Next, I went to <a target="_blank" href="http://www.ebay.com" title="eBay">eBay</a> and set up a search with the following filters (checkboxes, not free text): 

  * iPhone 4
  * 32 GB
  * AT&T **or Unlocked**
  * Completed listings only
  * I can&#8217;t remember whether or not I restricted to &#8220;Used&#8221;

Then, I highlighted **the first page** of results, pasted into <a target="_blank" href="http://www.barebones.com/products/TextWrangler/" title="TextWrangler">TextWrangler</a> and used a handful of quick-and-dirty runs with <a target="_blank" href="http://en.wikipedia.org/wiki/Grep" title="grep">grep</a> search and replace. My goal was to get something that would give me a single column in a spreadsheet for whether or not an item was sold and a second column for the asking (or sold) price.

#### Results {#results}

The average &#8220;Sold&#8221; price for first page was about $313 [N=149, range $172.49-$499.99], average unsold $325 [N=51, range $0.99-$699.99].  Excluding a few outliers in the unsold yields $338 [N=47, range $100-$450].

  * <a target="_blank" href="http://cl.ly/0b3X0u1k2U15">.pdf of the data</a>
  * <a target="_blank" href="http://cl.ly/3C213I361U3P">zipped .csv of the data</a> (should be easy to import to your spreadsheet app of choice)

Here are a couple histograms. Enjoy.

[<img src="{{ site.url }}/uploads/2012/08/Sold-1024x805.jpg" alt="" title="Sold" width="1024" height="805" class="alignnone size-large wp-image-627" srcset="{{ site.url }}/uploads/2012/08/Sold-1024x805.jpg 1024w, http://n8henrie.com/uploads/2012/08/Sold-300x235.jpg 300w" sizes="(max-width: 1024px) 100vw, 1024px" />]({{ site.url }}/uploads/2012/08/Sold.jpg)
  
[<img src="{{ site.url }}/uploads/2012/08/NotSold-1024x678.jpg" alt="" title="Not Sold" width="1024" height="678" class="alignnone size-large wp-image-628" srcset="{{ site.url }}/uploads/2012/08/NotSold-1024x678.jpg 1024w, http://n8henrie.com/uploads/2012/08/NotSold-300x198.jpg 300w" sizes="(max-width: 1024px) 100vw, 1024px" />]({{ site.url }}/uploads/2012/08/NotSold.jpg)

#### Discussion {#discussion}

The first item to pop up in the results: a _broken_ iPhone 4 that went for $280. This really took me off guard, since I hadn&#8217;t even thought about making a spreadsheet or blog post at this point. Over $100 above the Gazelle price &#8211; for a broken phone? I&#8217;m still not sure what this is all about. Here is the listing:

> **Apple iPhone 4 32GB AT&#038;T BROKEN (AT&#038;T) 5.1.1 &#8211; Black!!!**
  
> Winning bid: US **$280.22** [ 11 bids ]
  
> You are bidding on a Black Apple iPhone 4 32GB AT&#038;T. This item has been thoroughly evaluated by our professionals here at AllTech, and **has been determined to be broken**, and is being sold as-is. This item was owned and used previously by an individual. **Product shows signs of heavy wear** and frequent use. Cosmetic flaws may include scratches, scuffs, and/or dents, and the display may have clearly visible scratching or scuffing. 

Interestingly, the next item below was an identical model but listed as &#8220;unlocked&#8221; and in &#8220;excellent&#8221; condition &#8211; started at $100 ended with zero bids.  I think it may have been the difference in seller reviews that made the difference, since the one above was sold by a seller with thousands of ratings and the one seller of the phone below had a single rating. The next one below these two was listed as &#8220;good,&#8221; with cosmetic damage, not unlocked, and sold for $325. The highest &#8220;used&#8221; prices on the page seemed to be for &#8220;factory unlocked&#8221; phones that often sold for $389.

After being taken off guard by these initial sales, I decided to try to spreadsheet the data so I could look at averages. As you can see, the sold prices on eBay are significantly higher than what you&#8217;d get form Gazelle (over 150%). However, this comes at the cost of convenience; having to sell yourself is a pain. Additionally, the Gazelle option would allow you to lock in a price and keep your phone until the new one (hopefully) comes out. With eBay, on the other hand, you&#8217;ll either have to sell your iPhone early and make do in the meantime or except a lower price as the new iPhone release approaches.

#### Limitations {#limitations}

  * I only used only the first page of results.
  * I deleted a few lines (< 5) that wouldn&#8217;t cooperate with the automated grep formatting. These lines seemed fairly random, though it&#8217;s possible that I introduced systematic bias if the malformed lines were caused by a particular auction style.
  * The output is still _really_ ugly. If anyone knows of a cleaner way to look at eBay data, let me know in the comments section below.
  * I only pulled data for my specific model, YMMV.

Well, it&#8217;s time to get some work done. If anyone has any suggestions for how you handle upgrading your iPhone, let me know in the comments section below. This will be my first iPhone upgrade, so I&#8217;d appreciate your input!