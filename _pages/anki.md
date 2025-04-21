---
layout: archive
permalink: /anki/
title: "Anki Deck"
---

<div>
  <p><a href="https://apps.ankiweb.net/" target="_blank" rel="nofollow noopener noreferrer me">Anki</a>
  is a (free) spaced repetition flashcard app. I greatly recommend it, and for many years I used it to memorise whatever I was studying (i.e. theorems and proofs). I stopped about a year ago because I didn't feel like I needed it anymore, and it does have a relatively expensive upkeep (20 to 60 minutes every day) when used with long and complicated flashcards.</p>
  
  <p>Nevertheless, my Anki deck accompanied and grew with me from somewhere in the middle of my undergraduate through my Master's and much of my PhD, and I think back on it very fondly. So I decided to eternalise it here, and you can flick through the cards below!
  </p>
<div class="anki-browser-container">
  <div class="card-navigation">
      <button id="prev-card">&laquo; </button>
      <!--<label for="card-index-input">Card:</label>-->
      <input type="number" id="card-index-input" min="0" value="0" aria-label="Card Number">
      <span id="total-cards">/ ?</span>
      <button id="next-card"> &raquo;</button>
      <button id="random-card"><i class="fas fa-repeat" aria-hidden="true"></i></button> 
  </div>

  <div id="card-display" class="card-display">
      <div id="card-front" class="card-section card-front">
          Loading...
      </div>
      <hr class="card-separator">
      <div id="card-back" class="card-section card-back">
          </div>
  </div>

  <div id="error-message" class="error-message" style="display: none;"></div>
</div>

<p style="font-size: small;"><em> It was something of a pain to get the cards to render correctly, and there are likely still many that don't. Also, some of the earlier cards are in German, and some of them don't contain the complete answer but just a reference (e.g. "[PGL, Page 4]") to some set of written notes.</em></p>
</div>

<script src="{{ '/assets/scripts/anki_script.js' | relative_url }}"></script>