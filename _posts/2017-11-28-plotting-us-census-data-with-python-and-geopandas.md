---
title: Plotting US Census Data with Python and GeoPandas
date: 2017-11-28T09:34:11-07:00
author: n8henrie
layout: post
permalink: /2017/11/plotting-us-census-data-with-python-and-geopandas/
categories:
- tech
- python
excerpt: "Here's a simple way to plot some of the US Census data."
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
-
---
**Bottom Line:** Here's a simple way to plot some of the US Census data.
<!--more-->

I've been wanting to learn how to do some simple geo data plotting in Python
for a while, so I finally sat down and figured out the first few steps.

A lot of the US Census data is freely available to download from
[census.gov](https://www.census.gov/), so finding and downloading it was easy.
The part that actually tripped me up the most was figuring out how to load the
data into [GeoPandas](http://geopandas.org/). I first tried loading the file
with the built-in `read_file()` method, which didn't work. I tried extracting
the data from the zipfile a bunch of different ways and loading the shapefiles
using Fiona and nothing seemed to work... until I found [a blog
post](http://blog.danwin.com/census-places-cartodb-geopandas-mapping/) where
someone was prefixing their filename with `zip://` before reading into
GeoPandas. Sure enough that worked like a charm.

Anyway, you can [view my Jupyter
notebook](/uploads/2017/11/plotting-us-census-data-with-python-and-geopandas.html)
to see how it came out.
