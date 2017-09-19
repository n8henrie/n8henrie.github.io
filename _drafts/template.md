---
title: {{ .Title }}
date: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
author: n8henrie
layout: post
permalink: {{ .Date.Format "/2006/01/" }}{{ .Stub }}/
categories:
- tech
excerpt: ""
# ggrep -oP '(?<=>Posts tagged with ).*?(?=<)' _site/tags/index.html
tags:
-
---
**Bottom Line:**
<!--more-->
