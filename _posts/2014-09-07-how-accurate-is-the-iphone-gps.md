---
id: 2617
title: How Accurate is the iPhone GPS?
date: 2014-09-07T12:58:29+00:00
author: n8henrie
excerpt: In this post, I wanted to publish my results on a little testing of the accuracy of the GPS on my iPhone 5, specifically in a location with no cellular service, no data, and no WiFi.
layout: post
guid: http://n8henrie.com/?p=2617
permalink: /2014/09/how-accurate-is-the-iphone-gps/
dsq_thread_id:
  - 2996797342
---
**Bottom Line:** Some basic testing of the accuracy of GPS on the iPhone, and a Pythonista script to text someone your GPS location.<!--more-->

## Introduction

This is a followup post to [How to Find Your GPS Coordinates on an iPhone](http://n8henrie.com/2014/08/how-to-find-your-gps-coordinates-on-an-iphone/). I suggest you read that for a little context.

In this post, I wanted to publish my results on a little testing of the accuracy of the GPS on my iPhone 5, specifically _in a location with no cellular service, no data, and no WiFi_. The short version is this: your GPS signal is separate from all of these, so you can still get an accurate location from your iPhone&#8217;s Compass app.

## Methods

In order to try to figure out how accurate the iPhone 5&#8217;s GPS can be in this situation, I did a little experiment. While driving through the middle of nowhere in Arizona, I noticed that I had no cellular or data signal. I pulled my truck over at a location that would be relatively easy to identify with satellite imagery (e.g. an intersection, which I could see on Apple Maps or Google Maps). Then I got my GPS location.

Additionally, I refreshed the location 10 times, to see if it varied at all second-by-second. I took a screenshot each time so I could look at everything later. **NB:** the GPS data reported in Compass.app does not seem to automatically refresh. The easiest / fastest way to force it to refresh is to swipe to the left (should show the level), then swipe back.

Then, I did this all again at a second site to make sure it was reproducible.

In doing some background investigation, I was trying to figure out the resolution of one &#8220;second&#8221; of latitude or longitude in terms of linear distance. Ends up it&#8217;s a more complicated question than that. Linear length of one degree (or minute or second) of latitude and longitude vary, for reasons I didn&#8217;t dive into (<del datetime="2014-09-07T22:01:00+00:00">though Wikipedia has a seemingly decent article about it</del> article moved, <a href="http://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude" target="_blank">here&#8217;s a different one</a> with a lot of funny symbols). Based on <a href="http://fas.org/news/reference/calc/degree.html" target="_blank">this calculator</a> by the Federation of American Scientists, at 34º17&#8217;58&#8221; N 108º36&#8217;55&#8221; W &#8212; one of my coordinates &#8212; it looks like one _second_ is about 30.8 meters (or 101 ft) of latitude and 25.7 meters (84 ft) of longitude.

Hint: They key for º is `option 0` on a Mac.

## Results

**My results found that the GPS was very accurate and precise.** In both locations, my second-to-second GPS location did not vary _at all_ between the 10 refreshes.

My first GPS location was 34º 17&#8242; 58&#8243; N 108º 36&#8242; 55&#8243; W. <a href="http://n8h.me/1uc65ZJ" target="_blank">View in Google Maps</a> || <a href="http://maps.apple.com/?lsp=7618&sll=34.299444,-108.615278&q=34.299444,-108.615278" target="_blank">View in Apple Maps</a>

If you don&#8217;t want to follow the links, here&#8217;s what it looks like:


<img class="" src="http://n8henrie.com/wp-content/uploads/2014/08/20140814_20140814-ScreenShot-358.jpg" alt="" width="557" height="251" /> 

Here you can see the actual location of my truck:

<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0471.jpg" alt="" width="439" height="329" />
  
<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0470.jpg" alt="" width="441" height="330" />

And here&#8217;s one of my 10 screenshots:


<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0473.PNG" alt="" width="250" height="445" /> 

The other 9 are pretty much the same, but if you care, you can download all the pics from this post + the extra / not shown screenshots [here](http://n8henrie.com/wp-content/uploads/2014/09/20140907_GPS.zip).

As you can see, there&#8217;s good agreement between the two services as to where that location is. Here are a few photos of the exact location of my truck for comparison.

Because I was surprised at there being _no_ second-by-second variability when refreshing the location, I decided to drive along the empty dirt road while refreshing until the location changed. Clearly I don&#8217;t recommend anyone drive while using their cellphone; this was along an empty dirt road at about 5 mph&#8230; and in the name of science. Here&#8217;s where it changed:


<img class="alignnone" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0484.JPG" alt="" width="426" height="320" /> 
<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0483.PNG" alt="" width="250" height="444" /> 

It looks like that&#8217;s probably about 121 feet. As it is essentially directly South, that is in pretty good agreement with the calculated number of 101 ft that I posted above (and I may have been a little generous on my line).


<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_20140907-ScreenShot-403.jpg" alt="" width="495" height="440" /> 

My second GPS location was 34º 35&#8242; 9&#8243; N 108º 23&#8242; 14&#8243; W. <a href="http://n8h.me/1uc6Ly4" target="_blank">View in Google Maps</a> || <a href="http://maps.apple.com/?lsp=7618&sll=34.585833,-108.387222&q=34.585833,-108.387222" target="_blank">View in Apple Maps</a>


<img class="" src="http://n8henrie.com/wp-content/uploads/2014/09/20140907_IMG_0485.PNG" alt="" width="250" height="444" /> 

I parked at essentially the same relative location in the intersection, but didn&#8217;t get out and take a picture. As stated above, I again had 100% agreement on the location between 10 refreshes of the Compass app. If you&#8217;ll follow the links above, you&#8217;ll see that both Apple and Google Maps place the location about 50 feet North of where I was in the actual intersection. However, as that 50 feet is less than the margin of accuracy of 1 degree of latitude at this location, they&#8217;re essentially both spot on.

## Conclusions and Script

Basically, it looks like the iPhone GPS can be pretty darn good. I&#8217;m sure there are plenty of situations that will compromise its accuracy, but it looks like even without cellular signal or data, it is still worth a shot using the Compass app to get your GPS coordinates.

Finally, what would a post like this be without a <a href="http://n8h.me/1dntsEH" target="_blank">Pythonista</a> script? The script below can get your GPS coordinates without cellular or internet connectivity, and gives you the option to take a quick look at your location (~5 secs) or spend a little more time to get more precise info (~25 secs). Then it places your coordinates with a timestamp into an SMS message. Now you won&#8217;t be able to _send_ this message without signal, but you should be able to _try_ to send it, then when it fails you can continue to retry to send it whenever you get a little better signal. My recommendation would be to turn on Airplane Mode to save battery (and / or get a spare battery pack &#8212; I have <a href="http://www.amazon.com/gp/product/B0054U6CEE/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B0054U6CEE&linkCode=as2&tag=n8henriecom-20&linkId=6ANRNKTXRCJEHII4" target="_blank">this one</a> and use it all the time), then check for signal every once in a while if you think you&#8217;ve gotten to a place with better reception.