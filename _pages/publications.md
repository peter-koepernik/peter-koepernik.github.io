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
      <strong>{{ pub.title }}</strong>.
      <br>
      {% assign my_last_name = "Koepernik" %}
      {% for author in pub.authors %}
        {% if author contains my_last_name %}
          <span style="font-weight:450;">{{ author }}</span>{% if forloop.last %}.{% else %},{% endif %}
        {% else %}
          {{ author }}{% if forloop.last %}.{% else %},{% endif %} <!--{ unless forloop.last }, { endunless } (percent signs removed)-->
        {% endif %}
      {% endfor %}
      <em> {{ pub.venue }}</em>, {{ pub.date | date: "%Y" }}.
      <br>
      <!--
      -->{% if pub.paper-url %} [<a href="{{ pub.paper-url }}" rel="nofollow noopener noreferrer" target="_blank">link</a>]{% endif %}<!--
      -->{% if pub.pdf-url %} [<a href="{{ pub.pdf-url | relative_url }}" rel="nofollow noopener noreferrer" target="_blank">pdf</a>]{% endif %}<!--
      -->{% if pub.talk-url %} [<a href="{{ pub.talk-url | relative_url }}" rel="nofollow noopener noreferrer" target="_blank">talk</a>]{% endif %}<!--
      -->
    </li>
  {% endfor %}
</ul>
<p style="font-size: medium; font-style: italic; margin-top: 0;">*Main contributor(s). In mathematical publications, authors are always ordered alphabetically.</p>
</div>