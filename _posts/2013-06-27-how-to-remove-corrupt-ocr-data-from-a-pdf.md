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
---
**Bottom Line:** This posts shows how to remove corrupt OCR data from a .pdf with all free-as-in-beer software.<!--more-->

One of the most frustrating things I&#8217;ve _ever_ tried to do on my computer is remove corrupt or partial <a target="_blank" href="http://en.wikipedia.org/wiki/Optical_character_recognition" title="Optical Character Recognition">OCR</a> text from a .pdf file. You can kind of think of a .pdf file as a &#8220;picture&#8221; of a document &#8212; and like any other picture, you can&#8217;t highlight, select, or copy a &#8220;picture&#8221; of a word. To get around this, you can embed an invisible layer of text data on top of the picture, which can be selected, etc., and _looks_ like a regular document. The problem is when this text data gets messed up&#8230; because it&#8217;s invisible, you can&#8217;t tell that anything is wrong. But when you go to copy something from it&#8230; you end up with gobbledegook. And it ends up being **really difficult** to get rid of this invisible text, and you can&#8217;t re-OCR the document until the old text is gone.

I have gone through every step and workflow I could find using Acrobat, Photoshop, <a target="_blank" href="http://skim-app.sourceforge.net/">Skim</a>, <a target="_blank" href="http://www.cups-pdf.de/download.shtml">CUPS</a>&#8230; you name it. I tried all the Acrobat tips about discarded invisible layers and embedded data and preflight&#8230; nothing. The closest I could get was by batch printing to an image file and recompiling that into a .pdf (which I could then re-OCR)&#8230; but when you&#8217;re talking about documents hundreds of pages long, this _just isn&#8217;t a practical option_.

Luckily, I finally figured out a way that works for me, using a &#8220;print-to-pdf&#8221; utility called <a target="_blank" href="http://sourceforge.net/projects/pdfwriterformac/">PDFwriter</a> and good old Adobe Reader. Basically, you tell Adobe Reader to print the .pdf &#8220;as an image,&#8221; and you print to PDFWriter. Alone, Reader won&#8217;t let you print to .pdf using the system .pdf printer &#8212; like Acrobat, just tells you to &#8220;save&#8221; instead of printing a .pdf to .pdf &#8212; and the system .pdf printer won&#8217;t print &#8220;as an image&#8221; &#8212; instead, it just gives you another exact copy of the .pdf (with the invisible text intact). Together, though, it works out.

Here&#8217;s the workflow:

  1. Download and install <a target="_blank" href="http://sourceforge.net/projects/pdfwriterformac/" title=".pdfwriter">PDFwriter</a>
  2. Open a print dialog (i.e. print something from e.g. Preview), Printer (drop down menu) -> &#8220;add printer&#8221; -> PDFwriter
  3. Open the .pdf to be converted in Adobe Reader
  4. Print -> Advanced -> &#8220;Print as Image&#8221;
  5. By default the file ends up in a strange location,

    `/Users/Shared/pdfwriter`, which simlinks to

    `/private/var/spool/pdfwriter/[username]/`
  6. You&#8217;re done and can re-OCR the file with whatever OCR tool you prefer.
