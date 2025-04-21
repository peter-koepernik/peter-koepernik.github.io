document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cardFrontElement = document.getElementById('card-front');
    const cardBackElement = document.getElementById('card-back');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    const cardIndexInput = document.getElementById('card-index-input');
    const totalCardsSpan = document.getElementById('total-cards');
    const errorMessageElement = document.getElementById('error-message');
    const randomButton = document.getElementById('random-card');

    // State
    let cards = [];
    let currentCardIndex = 1;
    let cumulativeWeights = [];
    let totalWeight = 0;
    const deckPath = '/assets/data/anki_cards.json'; // Path to your JSON file

    // --- Functions ---

    function showError(message) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        console.error(message);
    }

    function hideError() {
        errorMessageElement.style.display = 'none';
    }

    function updateNavigationButtons() {
        if (cards.length === 0) {
            prevButton.disabled = true;
            nextButton.disabled = true;
            randomButton.disabled = true; // Disable if no cards
            cardIndexInput.disabled = true;
        } else {
            prevButton.disabled = (currentCardIndex === 1);
            nextButton.disabled = (currentCardIndex === cards.length);
            // Disable random button if deck has 0 or 1 card
            randomButton.disabled = (cards.length <= 1);
            cardIndexInput.disabled = false;
            cardIndexInput.max = cards.length; // Update max attribute
        }
    }

    function displayCard(index) {
        if (index < 1 || index > cards.length) {
            console.warn(`Invalid card index: ${index}`);
            return; // Index out of bounds
        }

        hideError(); // Clear any previous errors
        const card = cards[index-1];
        currentCardIndex = index;

        // Update card content
        cardFrontElement.innerHTML = card.front;
        cardBackElement.innerHTML = card.back;

        // Update input field
        cardIndexInput.value = currentCardIndex;

        // IMPORTANT: Tell MathJax to typeset the new content
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            // Use Promise-based typesetting for MathJax 3
            MathJax.typesetPromise([cardFrontElement, cardBackElement])
                .catch((err) => console.error('MathJax typesetting error:', err));
        } else if (typeof MathJax !== 'undefined' && MathJax.Hub && MathJax.Hub.Queue) {
            // Fallback for MathJax 2 (less likely with current CDN)
             MathJax.Hub.Queue(["Typeset", MathJax.Hub, cardFrontElement]);
             MathJax.Hub.Queue(["Typeset", MathJax.Hub, cardBackElement]);
        } else {
            console.warn('MathJax not fully loaded or configured.');
        }

        updateNavigationButtons();
    }

    function goToCard(index) {
        const newIndex = parseInt(index, 10);
        if (!isNaN(newIndex) && newIndex >= 1 && newIndex <= cards.length) {
            displayCard(newIndex);
        } else {
            // Optionally provide feedback or reset input
            cardIndexInput.value = currentCardIndex; // Reset to current index
            console.warn(`Attempted to navigate to invalid index: ${index}`);
            // You could show a temporary error message here if desired
        }
    }

    function displayRandomCard() {
        if (cards.length <= 1) {
            if(cards.length === 1 && currentCardIndex !== 0) displayCard(1);
            return;
        }

        let randomIndex;
        // Loop to ensure the new random index is different from the current one
        do {
            randomIndex = pickWeightedIndex();

            if (randomIndex === -1) {
                 console.error("Could not pick weighted index.");
                 return;
            }
        } while (cards.length > 1 && randomIndex === currentCardIndex);

        displayCard(randomIndex);

        //let randomIndex;
        //do {
        //    randomIndex = 1 + Math.floor(Math.random() * cards.length);
        //} while (randomIndex === currentCardIndex);
    }

    function loadDeck() {
        fetch(deckPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                   throw new Error('Deck data is not an array.');
                }
                cards = data;

                cumulativeWeights = []; // Reset weights
                totalWeight = 0;
                let currentCumulativeSum = 0;
                let baseWeight = 200;
                cards.forEach(card => {
                    const weight = baseWeight + 0.4 * (card.back ? card.back.length : 0);
                    // Ensure weight is non-negative
                    const validWeight = Math.max(0, weight);
                    currentCumulativeSum += validWeight;
                    cumulativeWeights.push(currentCumulativeSum);
                });
                totalWeight = currentCumulativeSum;
                console.log("Weighted sampling preprocessed. Total weight:", totalWeight);

                if (cards.length > 0) {
                    totalCardsSpan.textContent = `/ ${cards.length}`; // Display total (0-based)
                    cardIndexInput.min = 1;
                    cardIndexInput.max = cards.length;
                    displayRandomCard(); // Display a random card
                } else {
                    showError("The deck is empty.");
                    cardFrontElement.textContent = 'Deck is empty.';
                    cardBackElement.textContent = '';
                    totalCardsSpan.textContent = '/ 0';
                    prevButton.disabled = true;
                    nextButton.disabled = true;
                    cardIndexInput.disabled = true;
                }
            })
            .catch(error => {
                showError(`Failed to load deck: ${error.message}`);
                cardFrontElement.textContent = 'Error loading deck.';
                cardBackElement.textContent = '';
            });
    }

    // --- Helper Functions ---

    function pickWeightedIndex() {
        // Handle edge case: If totalWeight is 0 (e.g., all 'back' strings were empty)
        // or if there are no cards, fall back to uniform sampling or return error indicator.
        if (totalWeight <= 0 || cards.length === 0) {
             console.warn("Total weight is zero or less, or no cards. Falling back to uniform random sampling.");
             if (cards.length === 0) return -1; // Indicate error or no possible index
             return Math.floor(Math.random() * cards.length);
        }

        const randomNum = Math.random() * totalWeight;

        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (cumulativeWeights[i] > randomNum) {
                return i + 1; // Return the 1-based index
            }
        }

        // Fallback (should ideally not be reached if totalWeight > 0)
        // Could happen due to floating point nuances, return last index.
        return cumulativeWeights.length;
    }

    // --- Event Listeners ---

    prevButton.addEventListener('click', () => {
        if (currentCardIndex > 1) {
            displayCard(currentCardIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentCardIndex < cards.length) {
            displayCard(currentCardIndex + 1);
        }
    });

    cardIndexInput.addEventListener('change', (event) => { // 'change' fires when value is committed
        goToCard(event.target.value);
    });

    randomButton.addEventListener('click', displayRandomCard);

    // --- Initial Load ---
    loadDeck();

}); // End DOMContentLoaded