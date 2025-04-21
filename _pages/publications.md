---
layout: archive
permalink: /publications/
title: "Publications"
---

<div>
Also check my <a href="https://scholar.google.com/citations?user=8P3zHSsAAAAJ&hl=en" itemprop="sameAs" rel="nofollow noopener noreferrer me" target="_blank">Google Scholar</a>,
since I might not always keep this list up-to-date.

<hr>

<ul class="publications-list" style="font-size: 17px;">
  {% assign pubs = site.publications | sort: "date" | reverse %}
  {% for pub in pubs %}
    <li>
      {% assign my_last_name = "Koepernik" %}
      {% for author in pub.authors %}
        {% if author contains my_last_name %}
          <strong>{{ author }}</strong>{% if forloop.last %}.{% else %},{% endif %}
        {% else %}
          {{ author }}{% if forloop.last %}.{% else %},{% endif %} <!--{ unless forloop.last }, { endunless } (percent signs removed)-->
        {% endif %}
      {% endfor %}
      <em>{{ pub.title }}</em>
      [<!--
      --><a href="{{ pub.paper-url }}" rel="nofollow noopener noreferrer" target="_blank">link</a><!--
      -->{% if pub.pdf-url %}, <a href="{{ pub.pdf-url | relative_url }}" target="_blank">pdf</a>{% endif %}<!--
      -->]
      <br>
      {{ pub.venue }}, {{ pub.date | date: "%Y" }}
    </li>
  {% endfor %}
</ul>
<p style="font-size: medium; font-style: italic; margin-top: 0;">*Main contributor. In mathematical publications, authors are always ordered alphabetically.</p>
</div>