// Pokémon data including Megas and Gigantamaxes
const pokemonList = [
    { name: 'Pikachu', id: 25 },
    { name: 'Charizard', id: 6 },
    { name: 'Blastoise', id: 9 },
    { name: 'Venusaur', id: 3 },
    { name: 'Alakazam', id: 65 },
    { name: 'Machamp', id: 68 },
    { name: 'Golem', id: 76 },
    { name: 'Arcanine', id: 59 },
    { name: 'Lapras', id: 131 },
    { name: 'Snorlax', id: 143 },
    { name: 'Articuno', id: 144 },
    { name: 'Zapdos', id: 145 },
    { name: 'Moltres', id: 146 },
    { name: 'Dragonite', id: 149 },
    { name: 'Mewtwo', id: 150 },
    { name: 'Gyarados', id: 130 },
    { name: 'Gengar', id: 94 },
    { name: 'Kangaskhan', id: 115 },
    { name: 'Pinsir', id: 127 },
    { name: 'Salamence', id: 373 },
    { name: 'Metagross', id: 376 },
    { name: 'Rayquaza', id: 384 },
    { name: 'Garchomp', id: 445 },
    { name: 'Lucario', id: 448 },
    { name: 'Abomasnow', id: 460 },
    { name: 'Audino', id: 531 },
    { name: 'Druddigon', id: 621 },
    { name: 'Haxorus', id: 612 },
    { name: 'Goodra', id: 706 },
    { name: 'Tyranitar', id: 248 },
    { name: 'Ampharos', id: 181 },
    { name: 'Scizor', id: 212 },
    { name: 'Heracross', id: 214 },
    { name: 'Houndoom', id: 229 },
    { name: 'Banette', id: 354 },
    { name: 'Absol', id: 359 },
    { name: 'Gardevoir', id: 282 },
    { name: 'Glalie', id: 362 },
    { name: 'Medicham', id: 308 },
    { name: 'Manectric', id: 310 },
    // Mega Evolutions
    { name: 'Mega Charizard X', id: 10034, fallbackId: 6 },
    { name: 'Mega Charizard Y', id: 10035, fallbackId: 6 },
    { name: 'Mega Mewtwo Y', id: 10144, fallbackId: 150 },
    { name: 'Mega Rayquaza', id: 10079, fallbackId: 384 },
    { name: 'Mega Garchomp', id: 10058, fallbackId: 445 },
    { name: 'Mega Lucario', id: 10076, fallbackId: 448 },
    { name: 'Mega Gengar', id: 10059, fallbackId: 94 },
    { name: 'Mega Tyranitar', id: 10119, fallbackId: 248 },
    { name: 'Mega Salamence', id: 10115, fallbackId: 373 },
    { name: 'Mega Metagross', id: 10148, fallbackId: 376 },
    // Gigantamax forms
    { name: 'Gigantamax Charizard', id: 10199, fallbackId: 6 },
    { name: 'Gigantamax Pikachu', id: 10080, fallbackId: 25 },
    { name: 'Gigantamax Meowth', id: 10082, fallbackId: 52 },
    { name: 'Gigantamax Gengar', id: 10201, fallbackId: 94 },
    { name: 'Gigantamax Machamp', id: 10209, fallbackId: 68 },
    { name: 'Gigantamax Lapras', id: 10210, fallbackId: 131 },
    { name: 'Gigantamax Snorlax', id: 10143, fallbackId: 143 },
    { name: 'Gigantamax Eevee', id: 10200, fallbackId: 133 },
    { name: 'Gigantamax Corviknight', id: 10207, fallbackId: 823 },
    { name: 'Gigantamax Alcremie', id: 10217, fallbackId: 869 }
];

let currentQuestion = 0;
let score = 0;
let currentPokemon = null;
let gameActive = false;
let questionPool = [];

function startGame() {
    currentQuestion = 0;
    score = 0;
    gameActive = true;

    // Fisher-Yates shuffle to get 20 unique, uniformly random Pokémon
    const pool = pokemonList.slice();
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    questionPool = pool.slice(0, 20);

    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');

    loadNextQuestion();
}

function loadNextQuestion() {
    if (currentQuestion >= 20) {
        endGame();
        return;
    }

    currentPokemon = questionPool[currentQuestion];

    const img = document.getElementById('pokemonImage');
    img.classList.add('loading');
    img.src = '';

    const officialArtUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.id}.png`;
    const frontSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.id}.png`;
    const fallbackOfficialArtUrl = currentPokemon.fallbackId
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.fallbackId}.png`
        : null;

    img.onload = function () {
        img.classList.remove('loading');
    };

    img.onerror = function () {
        if (currentPokemon.fallbackId) {
            // Special form (Mega/Gigantamax): skip the front sprite of the form ID
            // because it may map to a completely unrelated Pokémon (e.g. cosplay Pikachu).
            // Fall back directly to the base Pokémon's official artwork instead.
            this.onerror = function () {
                img.classList.remove('loading');
            };
            this.src = fallbackOfficialArtUrl;
        } else {
            // Standard Pokémon: try the front sprite as a secondary source.
            this.onerror = function () {
                img.classList.remove('loading');
            };
            this.src = frontSpriteUrl;
        }
    };
    img.src = officialArtUrl;

    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    document.getElementById('currentScore').textContent = Math.round(score);
    document.getElementById('guessInput').value = '';
    document.getElementById('feedbackMessage').textContent = '';
    document.getElementById('feedbackMessage').className = 'feedback-message';
    document.getElementById('guessInput').focus();
}

function submitGuess() {
    if (!gameActive) return;

    const guess = document.getElementById('guessInput').value.trim().toLowerCase();
    const correctAnswer = currentPokemon.name.toLowerCase();

    if (!guess) {
        showFeedback('Please enter a Pokémon name!', 'incorrect');
        return;
    }

    let points = 0;
    let message = '';

    if (guess === correctAnswer) {
        points = 5;
        message = `✓ Correct! It's ${currentPokemon.name}! (+5 points)`;
        showFeedback(message, 'correct');
    } else if (levenshteinDistance(guess, correctAnswer) <= 2) {
        points = 2.5;
        message = `~ Close! It's ${currentPokemon.name}! (+2.5 points for spelling)`;
        showFeedback(message, 'half');
    } else {
        message = `✗ Wrong! It was ${currentPokemon.name}. (0 points)`;
        showFeedback(message, 'incorrect');
    }

    score += points;
    document.getElementById('currentScore').textContent = Math.round(score);

    setTimeout(() => {
        currentQuestion++;
        loadNextQuestion();
    }, 2000);
}

function skipQuestion() {
    if (!gameActive) return;

    showFeedback(`Skipped! It was ${currentPokemon.name}. (0 points)`, 'incorrect');

    setTimeout(() => {
        currentQuestion++;
        loadNextQuestion();
    }, 1500);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
}

function showFeedback(message, type) {
    const feedbackEl = document.getElementById('feedbackMessage');
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback-message ${type}`;
}

function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const d = [];

    for (let i = 0; i <= len1; i++) {
        d[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        d[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            d[i][j] = Math.min(
                d[i - 1][j] + 1,
                d[i][j - 1] + 1,
                d[i - 1][j - 1] + cost
            );
        }
    }

    return d[len1][len2];
}

function endGame() {
    gameActive = false;
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('endScreen').classList.add('active');

    const finalScore = Math.round(score);
    document.getElementById('finalScore').textContent = finalScore;

    let rating = '';
    if (finalScore >= 90) {
        rating = "🏆 LEGENDARY! You're a true Pokémon Master! 🏆";
    } else if (finalScore >= 75) {
        rating = '⭐ GREAT! You know your Pokémon well!';
    } else if (finalScore >= 60) {
        rating = '👍 GOOD! Not bad, keep practicing!';
    } else if (finalScore >= 45) {
        rating = "📚 OKAY! You've got some knowledge!";
    } else if (finalScore >= 30) {
        rating = '🤔 FAIR! Maybe brush up on your Pokédex!';
    } else {
        rating = "💪 KEEP TRYING! You'll get better!";
    }

    document.getElementById('ratingText').textContent = rating;
}
