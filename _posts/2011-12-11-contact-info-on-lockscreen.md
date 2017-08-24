---
id: 40
title: Contact info on the Lockscreen
date: 2011-12-11T04:30:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=40
permalink: /2011/12/contact-info-on-lockscreen/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2011/12/contact-info-on-lockscreen.html
geo_latitude:
  - 35.0844909
geo_longitude:
  - -106.6511367
geo_address:
  - Albuquerque, NM
blogger_images:
  - 1
dsq_thread_id:
  - 819620200
disqus_identifier: 40 http://n8henrie.com/?p=40
tags:
- iPad
- iPhone
- Mac OSX
- mobile
- photo
categories:
- tech
---
<div>
  I really like the idea of Apple's <a href="http://itunes.apple.com/us/app/find-my-iphone/id376101648?mt=8&at=10l5H6">Find My iPhone</a> app, and I have it installed on my iPhone and <span>iPad</span> "just in case." If you don't know about it, it's a free app provided by Apple that will let you find the location of your <span>iOS</span> device (or your Mac as of 10.7) in case you ever misplace it. You can remotely lock your device, send it a message, locate the device, or if all else fails you can remotely wipe it to keep your data safe.
</div>

<div>
</div>

<div>
  Of course this depends on a few things. For one, my <span>iPad</span> <span>WiFi</span> won't be tracked very accurately because it doesn't have GPS, and if it's not connected to a <span>WiFi</span> network then I'm out of luck. Additionally, if it's stolen by somebody on purpose, they can just shut the device off to keep me from tracking it. They could also just turn this feature off if you don't have a <span>passcode</span> set on your device.
</div>

<div>
</div>

<div>
  Reciprocally, the downside to having a <span>passcode</span> is that if I happen to <i>misplace</i> my iPhone — which I consider orders of magnitude more likely than having it stolen — nobody can access my phone, contacts, etc. in order to coordinate the return of my property. As soon as I can get <span>internet</span> access from a friend's <span>iOS</span> device or a computer, I can use Find My iPhone to deliver a message with my contact info, but here's a low-tech solution that may serve the same purpose: <b>just put some contact info on your lock screen</b>.
</div>

<div>
</div>

<div>
  As simple as this sounds, there are a few issues to consider.
</div>

<div>
  <ul>
    <li>
      You'll be basically advertising whatever contact info you use
    </li>
    <li>
      You need to find a way to put the text onto your <span>lockscreen</span> picture
    </li>
    <li>
      It's difficult to place the text in the perfect location so it's not behind the <span>lockscreen's</span> top or bottom strips or cropped off the side
    </li>
  </ul>
</div>

<div>
  The simplest solution I can think of to the first problem is to use my first name only and my<a href="https://accounts.google.com/ServiceLogin?service=grandcentral&passive=1209600&continue=https://www.google.com/voice&followup=https://www.google.com/voice&ltmpl=open"> Google Voice</a> number like so:
</div>

<div>
  <blockquote>
    Please return to [name]<br />[GV Number]<br />Reward!</p>
  </blockquote>
</div>

<div>
</div>

<div>
  If you don't have a Google Voice number, I highly recommend getting one. This way, if some jokester gets the number off my lockscreen and wants to cause mischief, I can go into my GVoice and block him with a single click. Additionally, it gives me web-based access to my texts and messages, which is obviously critical for something I will be using <i>in case I lose my phone</i>.
</div>

<div>
</div>

<div>
  The second problem is pretty simple — you can open up your lockscreen image in just about any photo editor and add the text. I decided to go with Photoshop. I'm no expert, but here's what I did.
</div>

<div>
  <ol>
    <li>
      use the text tool to make a layer in the font that I want
    </li>
    <li>
      set the text color to black
    </li>
    <li>
      make a selection of the text (I used the magic wand tool and unchecked "contiguous" and got it in a single click)
    </li>
    <li>
      in the "select" menu, modify and expand the selection by a few pixels
    </li>
    <li>
      make a new layer below the original and fill in the expanded selection with white
    </li>
    <li>
      select the relevant layers and save them as a smart object
    </li>
  </ol>
</div>

<div>
</div>

<div>
  This way, the black-on-white ensures that the text will be visible no matter what background they're on, and I'll be able to reuse the "smart object" to save myself a few steps in the future whenever I change my lockscreen image.
</div>

<div>
</div>

<div>
  The last step is positioning the message on the image. Luckily, I found a post [<a href="http://www.intridea.com/blog/2010/4/7/ipad-wallpaper-photoshop-template">here</a>] that lead me to [<a href="http://cl.ly/2t3l2a0T3x0S1F2b3x3x">this</a>] handy-dandy pre-made Photoshop smart object of an iPad, complete with guides set to show you where the borders of the screen are, including the upper and lower lock button and clock that get superimposed. <i>Very</i> handy — here's a screenshot to show you what I mean.</p> 
  
  <div style="clear: both; text-align: center;">
    <a href="{{ site.url }}/uploads/2012/09/ScreenShot2011-12-10at9.32.52PM.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="320" src="{{ site.url }}/uploads/2012/09/ScreenShot2011-12-10at9.32.52PM.jpg" width="253" /></a>
  </div>
  
  <p>
    You can just uncheck the "wallpaper" layer and insert your own to get an idea of how your final project will turn out. Whenever you're ready, delete the spare layers, save as a jpg, transfer the image to your iDevice and you're set! Now if you ever lose it, anybody that finds it will have an immediate opportunity to do the right thing and get it back to its original owner.<br />___________________________________________________________<br />Update: <br />I made a <a href="http://cl.ly/1P213T1T25371q3D300I" target="_blank">Photoshop template for the iPhone 4</a>.  I believe it is set to the correct screen dimensions and pixel density for the Retina display, and I imported a lock screen overlay so you can position your photo correctly.  Additionally, there is a "text" layer for your "Return to" information positioned below the swipe-to-unlock button.  I feel like this gives the optimal compromise between having the info on the screen without hurting the aesthetic value too much (having the info in the middle of the display doesn't look too hot).  When you're finished with everything,
  </p>
  
  <ol>
    <li>
      hide the lockscreen overlay
    </li>
    <li>
      save as
    </li>
    <li>
      check save as copy
    </li>
    <li>
      check visible layers only
    </li>
    <li>
      jpg
    </li>
    <li>
      import the image to your phone
    </li>
    <li>
      set as lockscreen
    </li>
  </ol>
  
  <p>
    Enjoy!  —n8henrie Sat Dec 17 14:29:37 MST 2011 </div> 
    
    <div>
    </div>