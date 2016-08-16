---
id: 2304
title: How to Remove Corrupt OCR Data from a PDF
date: 2013-06-27T11:33:23+00:00
author: n8henrie
excerpt: This posts shows how to remove corrupt OCR data from a .pdf with all free-as-in-beer software.
layout: post
guid: http://n8henrie.com/?p=2304
permalink: /2013/06/how-to-remove-corrupt-ocr-data-from-a-pdf/
dsq_thread_id:
  - 1442782317
disqus_identifier: 2304 http://n8henrie.com/?p=2304
tags:
- bugfix
- eBooks
- Mac OSX
categories:
- tech
---
**Bottom Line:** This posts shows how to remove corrupt OCR data from a .pdf with all free-as-in-beer software.<!--more-->

One of the most frustrating things I’ve _ever_ tried to do on my computer is remove corrupt or partial <a target="_blank" href="http://en.wikipedia.org/wiki/Optical_character_recognition" title="Optical Character Recognition">OCR</a> text from a .pdf file. You can kind of think of a .pdf file as a “picture” of a document — and like any other picture, you can’t highlight, select, or copy a “picture” of a word. To get around this, you can embed an invisible layer of text data on top of the picture, which can be selected, etc., and _looks_ like a regular document. The problem is when this text data gets messed up… because it’s invisible, you can’t tell that anything is wrong. But when you go to copy something from it… you end up with gobbledegook. And it ends up being **really difficult** to get rid of this invisible text, and you can’t re-OCR the document until the old text is gone.

I have gone through every step and workflow I could find using Acrobat, Photoshop, <a target="_blank" href="http://skim-app.sourceforge.net/">Skim</a>, <a target="_blank" href="http://www.cups-pdf.de/download.shtml">CUPS</a>… you name it. I tried all the Acrobat tips about discarded invisible layers and embedded data and preflight… nothing. The closest I could get was by batch printing to an image file and recompiling that into a .pdf (which I could then re-OCR)… but when you’re talking about documents hundreds of pages long, this _just isn’t a practical option_.

Luckily, I finally figured out a way that works for me, using a “print-to-pdf” utility called <a target="_blank" href="http://sourceforge.net/projects/pdfwriterformac/">PDFwriter</a> and good old Adobe Reader. Basically, you tell Adobe Reader to print the .pdf “as an image,” and you print to PDFWriter. Alone, Reader won’t let you print to .pdf using the system .pdf printer — like Acrobat, just tells you to “save” instead of printing a .pdf to .pdf — and the system .pdf printer won’t print “as an image” — instead, it just gives you another exact copy of the .pdf (with the invisible text intact). Together, though, it works out.

Here’s the workflow:

  1. Download and install <a target="_blank" href="http://sourceforge.net/projects/pdfwriterformac/" title=".pdfwriter">PDFwriter</a>
  2. Open a print dialog (i.e. print something from e.g. Preview), Printer (drop down menu) -> “add printer” -> PDFwriter
  3. Open the .pdf to be converted in Adobe Reader
  4. Print -> Advanced -> “Print as Image”
  5. By default the file ends up in a strange location,

    `/Users/Shared/pdfwriter`, which simlinks to

    `/private/var/spool/pdfwriter/[username]/`
  6. You’re done and can re-OCR the file with whatever OCR tool you prefer.
