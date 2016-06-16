---
id: 2786
title: 'How to Install Apple&#8217;s HomeKit Catalog App on iOS with Xcode'
date: 2015-12-21T09:03:05+00:00
author: n8henrie
excerpt: "Here's how to load open source iOS apps like Apple's HomeKit Catalog onto your iOS devices using Xcode."
layout: post
guid: http://n8henrie.com/?p=2786
permalink: /2015/12/how-to-install-apples-homekit-catalog-app-on-ios-with-xcode/
yourls_shorturl:
  - http://n8henrie.com/n8urls/75
dsq_thread_id:
  - 4422694673
---
**Bottom Line:** Here&#8217;s how to load open source iOS apps like Apple&#8217;s HomeKit Catalog onto your iOS devices using Xcode.<!--more-->

With Xcode 7, anybody can &#8220;sideload&#8221; an app onto their iPhone if you have access to the source code. What this means is that there are a good number of open source apps that you can install yourself &#8212; even if that app isn&#8217;t in the App Store.

As an excellent example, Apple has basic app called HomeKit Catalog that they&#8217;ve made to help set up HomeKit compatible devices. They haven&#8217;t release the app in the App Store, but since its source code is available, you can install it yourself as an alternative to some of the popular paid apps like <a title="Home - Smart Home Automation" href="https://itunes.apple.com/us/app/home-smart-home-automation/id995994352?mt=8&uo=4&at=10l5H6" target="_blank">Home</a> or <a title="MyTouchHome" href="http://mytouchhome.webs.com/" target="_blank">MyTouchHome</a>.

## HomeKit Catalog Installation

### Setup: download HomeKit Catalog and open in Xcode

#### Option: GUI

Pretty straightforward here, should just take a few minutes **once you have Xcode downloaded**.

  1. <a title="Xcode" href="https://itunes.apple.com/us/app/xcode/id497799835?mt=12&uo=4&at=10l5H6" target="_blank">Download Xcode</a>
  2. Open <a href="https://developer.apple.com/library/ios/samplecode/HomeKitCatalog" target="_blank">https://developer.apple.com/library/ios/samplecode/HomeKitCatalog</a> and `Download Sample Code` (top right)
  3. Unzip
  4. Open `HMCatalog.xcodeproj` in Xcode

#### Option: Command line

After the first time I installed it, I didn&#8217;t much care for the default name `HMCatalog`, so I wanted to change it. I figured the command like would probably be the easiest way (though I don&#8217;t know much about Xcode, so perhaps this was all unnecessary work). If you&#8217;re choosing the command line option, I&#8217;ll assume you more or less know what you&#8217;re doing, so I&#8217;ll go easy on the explanations here. Ask in the commends if you have questions.

I will note that I initially tried to give it the name &#8220;HomeKit,&#8221; which resulted in some namespace issues and was a big mess, so in the example below I&#8217;m using the name &#8220;HKSetup.&#8221;

`brew install wget rename git`

<pre><code class="bash"># Very long name
wget https://developer.apple.com/library/ios/samplecode/HomeKitCatalog/HomeKitCatalogCreatingHomesPairingandControllingAccessoriesandSettingUpTriggers.zip
unzip HomeKitCatalogCreatingHomesPairingandControllingAccessoriesandSettingUpTriggers.zip
rm HomeKitCatalogCreatingHomesPairingandControllingAccessoriesandSettingUpTriggers.zip
mv HomeKitCatalogCreatingHomesPairingandControllingAccessoriesandSettingUpTriggers HKSetup

cd HKSetup

# Might as well put it in version control
git init
git add .
git commit -m "Import original HMCatalog source from Apple"

# Change all instances of HMCatalog to HKSetup
find . -type f -not -path "./.git*" -exec perl -pi -e 's|HMCatalog|HKSetup|g' '{}' \;
find . -type d -iname "*HMCatalog*" | rename -s HMCatalog HKSetup
find . -type f -iname "*HMCatalog*" | rename -s HMCatalog HKSetup

# Open in Xcode
open HKSetup.xcodeproj</code></pre>

You&#8217;re almost there! Now just have to change one or two settings and load it onto your iOS device.

  1. Connect your iOS device by USB
  2. Select your iOS device in the top left corner (where you see `NatePhone` in the image below) 
    ![](http://n8henrie.com/wp-content/uploads/2015/12/20151210_ScreenShot2015-12-10at2.08.32PM.jpg)</li> 
    
      * Change the Bundle Identifier (e.g. I used `com.n8henrie.HKSetup`)
      * Select your account from `Team` (if you don&#8217;t have one, add one from the dropdown)
      * `Fix Issue` 
        <img class="" src="http://n8henrie.com/wp-content/uploads/2015/12/20151210_ScreenShot2015-12-10at2.26.42PM.jpg" alt="" width="699" height="259" /></li> 
        
          * Hit the &#8220;Play&#8221; (triangle) button on the left: 
            ![](http://n8henrie.com/wp-content/uploads/2015/12/20151210_ScreenShot2015-12-10at2.08.32PM.jpg)</li> 
            
              * On first run you&#8217;ll likely get an error like this: 
![](http://n8henrie.com/wp-content/uploads/2015/12/20151211_ScreenShot2015-12-11at5.26.47PM.jpg) 
                and a corresponding one on your iOS device:
                
                <img class="" src="http://n8henrie.com/wp-content/uploads/2015/12/20151217_File_Dec_13__7_24_06_PM.jpg" alt="" width="341" height="274" /></li> 
                
                  * To run the app, you&#8217;ll need to &#8220;trust&#8221; yourself in your iOS device&#8217;s settings: `Settings` -> `General` -> `Device management`.
  
                    1.Reload the app (the &#8220;Play&#8221; button again from step 6) and it will launch on your iPhone without an error.</ol> 
                
                That&#8217;s it! I found the app itself fairly easy to use and was able to add some existing HomeKit compatible devices with no trouble.
                
                Also, just FYI, looking around in Xcode, I saw some suggestions to download `HomeKit Accessory Simulator`, but I couldn&#8217;t find it at the linked page (<a href="https://developer.apple.com/downloads/?name=for%20Xcode" target="_blank">https://developer.apple.com/downloads/?name=for%20Xcode</a>). Ends up, it&#8217;s inside the `Hardware IO Tools for Xcode 7` package. <a href="http://justabeech.com/2015/01/12/hardware-io-tools-for-xcode/" target="_blank">As noted</a> by <a href="https://twitter.com/mbogh" target="_blank">@mbogh</a>, you can download this and move the included applications to `/Applications/Xcode.app/Contents/Applications/` to make them accessible from Xcode&#8217;s `Open Developer Tools` menu.