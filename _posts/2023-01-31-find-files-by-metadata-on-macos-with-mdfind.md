---
title: Find Files by Metadata on MacOS with mdfind
date: 2023-01-31T10:11:11-07:00
author: n8henrie
layout: post
permalink: /2023/01/find-files-by-metadata-on-macos-with-mdfind/
categories:
- tech
excerpt: "The `mdfind` tool on MacOS lets you run CLI queries for files based on metadata."
tags:
- bash
- Mac OSX
- MacOS
- productivity
- tech
- Terminal
---
**Bottom Line:** The `mdfind` tool on MacOS lets you run CLI queries for
files based on metadata.
<!--more-->

After years of using MacOS, I can't believe didn't know about the `mdfind`
(metadatafind) command. It apparently has a database that makes its searches
give *extremely* fast results.

For example:

- Find files that were taken by my current iPhone:

```console
$ mdfind 'kMDItemAcquisitionModel == "iPhone 13 Pro"' | head -n 1
/Users/n8henrie/Pictures/Photos Library.photoslibrary/scopes/cloudsharing/data/284353093/468E2820-F706-45AC-82D5-BA26D72E10F2/1357B948-1D66-48ED-96EB-54101B8BB1AD.JPG
$ mdfind -count 'kMDItemAcquisitionModel == "iPhone 13 Pro"'
26
$ time mdfind 'kMDItemAcquisitionModel == "iPhone 13 Pro"' >/dev/null

real    0m0.056s
user    0m0.005s
sys     0m0.015s
```

- For a case insensitive search, add a trailing `c` to the query:

```console
$ mdfind -count 'kMDItemAcquisitionModel == "iphone 13 pro"c'
26
```

I'm *pretty* sure I've taken more than 26 photos with my iPhone 13. Ends up I
needed to manually prompt spotlight to reindex my photos library with
`mdimport`, and then I could watch (in real time!) as the database was updated:

```console
$ mdimport ~/Pictures/Photos\ Library.photoslibrary
$ mdfind -live 'kMDItemAcquisitionModel == "iphone 13 pro"c'
```

- `mdls` will show you the metadata on an existing file to give you ideas for
  searching:

```console
$ mdls privacypolicy.md
_kMDItemDisplayNameWithExtensions  = "privacypolicy.md"
kMDItemContentCreationDate         = 2017-01-24 00:07:14 +0000
kMDItemContentCreationDate_Ranking = 2021-02-26 00:00:00 +0000
kMDItemContentModificationDate     = 2017-01-24 00:07:14 +0000
kMDItemContentType                 = "net.daringfireball.markdown"
kMDItemContentTypeTree             = (
    "net.daringfireball.markdown",
    "public.plain-text",
    "public.text",
    "public.data",
    "public.item",
    "public.content"
)
kMDItemDateAdded                   = 2021-02-26 01:36:36 +0000
kMDItemDisplayName                 = "privacypolicy.md"
kMDItemDocumentIdentifier          = 0
kMDItemFSContentChangeDate         = 2017-01-24 00:07:14 +0000
kMDItemFSCreationDate              = 2017-01-24 00:07:14 +0000
kMDItemFSCreatorCode               = ""
kMDItemFSFinderFlags               = 0
kMDItemFSHasCustomIcon             = (null)
kMDItemFSInvisible                 = 0
kMDItemFSIsExtensionHidden         = 0
kMDItemFSIsStationery              = (null)
kMDItemFSLabel                     = 0
kMDItemFSName                      = "privacypolicy.md"
kMDItemFSNodeCount                 = (null)
kMDItemFSOwnerGroupID              = 20
kMDItemFSOwnerUserID               = 501
kMDItemFSSize                      = 3723
kMDItemFSTypeCode                  = ""
kMDItemInterestingDate_Ranking     = 2017-01-24 00:00:00 +0000
kMDItemKind                        = "Markdown Document"
kMDItemLogicalSize                 = 3723
kMDItemPhysicalSize                = 4096
```

- Counts of extensions of files created by iPhone 13 pro:
```console
$ mdfind -0 'kMDItemAcquisitionModel == "iphone 13 pro"c' |
    xargs -0 -I{} bash -c \
    ': ${1,,}; printf "%s\n" "${_##*.}"' _ {} | sort | uniq -c
     54 heic
   1625 jpeg
     99 jpg
```

`man mdfind` also suggests looking through `mdimport -X`, which has a *lot*
more about the schema (~2k lines), and can print out even more information
for a specific file than `mdls`, e.g. `mdimport -t -d3 example.file`.

I have 71 files that involve the word "skateboard", and it takes < 0.55 seconds
to find them. Manually verified -- pdfs, excel files, text files, all with the
work skateboard. Amazing, can't believe I didn't know about this.

```console
$ time mdfind skateboard | wc -l
71

real    0m0.549s
user    0m0.014s
sys     0m0.010s
```

There are *many* more powerful ways to search with `mdfind` detailed as
[developer.apple.com][0]. Some examples:

```
$ mdfind -onlyin ~ 'kMDItemFSContentChangeDate >= $time.today(-3)'
$ mdfind -onlyin ~ -name some-file.txt
$ mdfind kind:image -name foo
$ mdfind 'kMDItemUserModifiedDate >= $time.this_month(-1)'
```

Further reading (I've picked some of the above examples from this list):

- <https://blog.superuser.com/2011/06/03/digging-deeper-mastering-spotlight-in-os-x/>
- [developer.apple.com][0]
- <https://metaredux.com/posts/2019/12/22/mdfind.html>

[0]: https://web.archive.org/web/20221223175248/https://developer.apple.com/library/archive/documentation/Carbon/Conceptual/SpotlightQuery/Concepts/QueryFormat.html
