---
title: Calling Swift from Objective C in 2021
date: 2021-04-30T11:19:04-06:00
author: n8henrie
layout: post
permalink: /2021/04/calling-swift-from-objective-c-in-2021/
categories:
- tech
excerpt: "Quick example of calling Swift from an Objective C app"
tags:
- MacOS
- Mac OSX
- Quicksilver
- swift

---
**Bottom Line:** This is a quick example of calling Swift from an Objective C
app.

I've often wished that I could contribute to [Quicksilver], probably my
all-time favorite app, but unfortunately it's written in Objective C. I don't
know *any* Objective C, and honestly I'm not terribly interested in learning
it.

Lately, I've been picking up a little Swift. So far I don't care for it as much
as Rust, but I've read that it can be integrated into existing ObjC projects,
which *does* pique my interest.

Today I decided to see if I could get a Swift "hello world" working in
Quicksilver. It ended up not being terribly difficult, mostly thanks to [this
blog post][0] and [the StackOverflow thread it links to][1]. There were a few
bumps along the way, especially since I'm not proficient with Xcode or ObjC, so
I wanted to document my process here.

Again, note that this is *almost exactly* as documented [here][0], and I've
copied the example code from there with minimal changes, just enough to run
under a more modern version of Swift (5.4).

Basically my process was:

1. Clone [Quicksilver] and open in Xcode
1. Note that the `Product Module Name` is `Quicksilver` in the project settings
1. Open the `Code-App` folder in the file navigator
1. Create a new Swift File (name doesn't seem to matter)
1. Select **yes** regarding automatic generation of the header bridge file
1. Add some Swift code
    - Classes should inherit from `NSObject`
    - Functions to be called from ObjC should be marked with `@objc`
1. Back in `Code-App`, add to `main.m`:
    - `#import <Quicksilver-Swift.h>` (or replace `Quicksilver` with the
      product module name you found above -- this has nothing to do with the
      name of the Swift file)
    - Some `hello, world!` code to call your Swift functions
1. Run and see if it works!

Points that contrast with some of the other tutorials I found:

- I did **not** have to enable the `Defines Module` setting
- I **did** have to let Xcode do the automatic header bridge generation
    - NB: Some tutorials say you can decline this; it looks like that also
      works, but in that case I think you have to scatter `public` all over
      your Swift code to allow access to your class, init, functions, etc. --
      with the header file Xcode creates you can leave out the `public`.
- I had to change a few Swift function definitions in the example code provided
  in the blog post I keep linking
- I had to add `@objc` to functions that were going to be used directly from
  ObjC code

I'll include below copies of the code changes I added / made; the parts of
`main.m` that I modified are marked with comments.

```console
$ swiftc --version
Apple Swift version 5.4 (swiftlang-1205.0.26.9 clang-1205.0.19.55)
Target: arm64-apple-darwin20.4.0
```

```swift
//
//  TrySomeSwift.swift
//  Quicksilver
//
//  Created by Nathan Henrie on 20210430.
//

import Foundation

class SwiftClass : NSObject {

    override init() {
        super.init()
        print("SwiftClass init")
    }

    func helloWorld() -> Void {
        print("hello, world!")
    }

    @objc func sayHello() -> Void {
        print("hello")
        helloWorld()
    }

    @objc func addX(_ x:Int, andY y:Int) -> Int {
        return x+y
    }

    // Make a dictionary
    // No, this code doesn't protect against values.count > keys.count
    @objc func dictionaryWithKeys(_ keys:[String], andValues values:[String]) -> Dictionary<String,String> {

        var dictionary = Dictionary<String,String>()

        for i in 0..<keys.count {
            dictionary[keys[i]] = values[i]
        }

        return dictionary
    }
}
```

```objc
//
//  main.m
//  Quicksilver
//
//  Created by Alcor on Sun Jun 29 2003.
//  Copyright (c) 2003 Blacktree, Inc. All rights reserved.
//

#import <Cocoa/Cocoa.h>
// BEGIN added by NDH 20210430
#import <Quicksilver-Swift.h>
// END added by NDH

int main(int argc, const char *argv[]) {
#ifdef DEBUG
	if(DEBUG_MEMORY) {
		setenv("NSZombieEnabled", "YES", 1);
		setenv("NSDeallocateZombies", "YES", 1); // So leaks don't get mad.
		setenv("MallocStackLogging", "1", 1);
		setenv("MallocStackLoggingNoCompact", "1", 1);
		setenv("NSAutoreleaseFreedObjectCheckEnabled", "YES", 1);
	}
#endif

	// BEGIN added by NDH 20210430
	SwiftClass* mySwiftClass = [[SwiftClass alloc]init];

	[mySwiftClass sayHello];

	int result = [mySwiftClass addX:5 andY:5];

	NSLog(@"5 + 5 is %d", result);

	NSDictionary* dictionary = [mySwiftClass dictionaryWithKeys:@[@"key1",@"key2",@"key3"] andValues:@[@"val1",@"val2",@"val3"]];

	NSLog(@"dictionary = %@", dictionary);

	NSLog(@"I'm here");
	// END added by NDH
	return NSApplicationMain(argc, argv);
}
```

Output in the Xcode console:

```plaintext
SwiftClass init
hello
hello, world!
2021-04-30 11:55:04.910562-0600 Quicksilver[92200:6185299] 5 + 5 is 10
2021-04-30 11:55:04.911047-0600 Quicksilver[92200:6185299] dictionary = {
    key1 = val1;
    key2 = val2;
    key3 = val3;
}
2021-04-30 11:55:04.911072-0600 Quicksilver[92200:6185299] I'm here
```

## References

- <https://dev.iachieved.it/iachievedit/using-swift-in-an-existing-objective-c-project/>
- <https://stackoverflow.com/questions/24062618/swift-to-objective-c-header-not-created-in-xcode-6>
- <https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_swift_into_objective-c>

[Quicksilver]: https://github.com/quicksilver/Quicksilver
[0]: https://dev.iachieved.it/iachievedit/using-swift-in-an-existing-objective-c-project/
[1]: https://stackoverflow.com/questions/24062618/swift-to-objective-c-header-not-created-in-xcode-6
