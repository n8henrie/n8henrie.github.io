---
layout: page
title: Tags
nav: true
---
<!-- Modified borrowed code. Credits:
- https://github.com/psteadman/psteadman.github.io/blob/f18936617c12622da816a008caa446c33e14bb38/tags.html
- dbtek -->

{% comment %}
Would be great to have the line below use case insensitive sort / sort_natural when a more recent Liquid is merged into Jekyll / GitHub Pages.
Also,
Instead of everything in one line, use {% raw %} `{%-` {% endraw %} for whitespace control once Liquid 4.0 lands in Jekyll
http://stackoverflow.com/questions/40830392/how-to-remove-the-white-space-in-jekyll
{% endcomment %}

{% capture unique_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %}|{% endunless %}{% endfor %}{% endcapture %}
{% assign site_tags_downcase = unique_tags | downcase | split:'|' | sort %}
{% assign unique_tags = unique_tags | split:'|' %}
{% capture tag_words %}{% for tag_downcase in site_tags_downcase %}{% for tag in unique_tags %}{% assign t = tag | downcase %}{% if t == tag_downcase %}{{ tag }}|{% endif %}{% endfor %}{% endfor %}{% endcapture %}

{% assign tag_words = tag_words | split:'|' %}

<div id="tag-column">
    <ul>
        {% for this_word in tag_words %}
            <li>
                <a href="#{{ this_word | replace:' ','-' }}-ref">{{ this_word }} :: {{ site.tags[this_word].size }}</a>
            </li>
        {% endfor %}
    </ul>
</div>

<div >
    {% for this_word in tag_words %}
            <div id="{{ this_word | replace:' ','-' }}-ref">
                <h2 >Posts tagged with {{ this_word }}</h2>
                <ul >
                    {% for post in site.tags[this_word] %}
                        {% if post.title != null %}
                            <li >
                                <a href="{{ site.BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
                                <span > - {{ post.date | date: "%B %d, %Y" }}</span>
                            </li>
                        {% endif %}
                    {% endfor %}
                </ul>
            </div>
    {% endfor %}
</div>
