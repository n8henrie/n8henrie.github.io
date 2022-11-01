---
title: {{ .Title }}
date: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
author: n8henrie
layout: post
permalink: {{ .Date.Format "/2006/01/" }}{{ .Stub }}/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html | sk --layout=reverse -m | pbcopy
tags:
-
---
**Bottom Line:**
<!--more-->
