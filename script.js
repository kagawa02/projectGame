const gameData = {
    currentLevel: 1,
    moves: 0,
    matchedPairs: 0,
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    timer: null,
    seconds: 0,
    canClick: false
};

const cards = [
    { word: 'Table', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200' },
    { word: 'Chair', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=200' },
    { word: 'Lamp', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200' },
    { word: 'Book', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200' },
    { word: 'Clock', image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=200' },
    { word: 'Phone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
    { word: 'Plant', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200' },
    { word: 'Cup', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200' },
    { word: 'Pen', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=200' },
    { word: 'Mirror', image: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=200' },
    { word: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
    { word: 'Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200' },
    { word: 'Mouse', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200' },
    { word: 'Monitor', image: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=200' },
    { word: 'Desk', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200' },
    { word: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    { word: 'Speaker', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200' },
    { word: 'Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
    { word: 'Printer', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200' },
    { word: 'Scanner', image: 'https://images.unsplash.com/photo-1569775309692-fd5e62248d8b?w=200' },
    { word: 'Router', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200' },
    { word: 'Tablet', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200' },
    { word: 'Charger', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200' },
    { word: 'Cable', image: 'https://images.unsplash.com/photo-1559069879-fa0fc45cc0bf?w=200' }
];

function initializeGame(level) {
    // Set specific card count for each level
    let cardCount;
    switch(level) {
        case 1:
            cardCount = 4; // 2 pairs
            break;
        case 2:
            cardCount = 8; // 4 pairs
            break;
        case 3:
            cardCount = 16; // 8 pairs
            break;
        case 4:
            cardCount = 25; // 12.5 pairs (rounded to 12)
            break;
        case 5:
            cardCount = 32; // 15 pairs
            break;
        default:
            cardCount = 4;
    }

    const shuffledCards = [...cards]
    .sort(() => Math.random() - 0.5) // shuffle first
    .slice(0, Math.floor(cardCount / 2)) // then take the needed number
    .flatMap(card => [
        { type: 'word', content: card.word, pair: card.word },
        { type: 'image', content: card.image, pair: card.word }
    ])
    .sort(() => Math.random() - 0.5); // shuffle the final pairs too

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    document.querySelector('.game-container').setAttribute('data-level', level);

    shuffledCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        gameBoard.appendChild(cardElement);
    });

    resetGameState();
    showPreview(level);
}

function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.index = index;
    cardElement.dataset.pair = card.pair;

    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = '?';

    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    if (card.type === 'word') {
        cardBack.textContent = card.content;
    } else {
        const img = document.createElement('img');
        img.src = card.content;
        img.alt = card.pair;
        cardBack.appendChild(img);
    }

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);

    cardElement.addEventListener('click', () => handleCardClick(cardElement));

    return cardElement;
}

function showPreview(level) {
    gameData.canClick = false;
    const previewTime = 2000 * level; // 2 seconds * level number
    const cards = document.querySelectorAll('.card');
    
    // Show all cards
    cards.forEach(card => card.classList.add('flip'));
    
    // Hide cards after preview time
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('flip'));
        gameData.canClick = true;
        startTimer();
    }, previewTime);
}

function handleCardClick(card) {
    if (!gameData.canClick) return;
    if (gameData.lockBoard) return;
    if (card === gameData.firstCard) return;
    if (card.classList.contains('matched')) return;

    card.classList.add('flip');

    if (!gameData.firstCard) {
        gameData.firstCard = card;
        return;
    }

    gameData.secondCard = card;
    gameData.moves++;
    document.getElementById('moves').textContent = gameData.moves;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = gameData.firstCard.dataset.pair === gameData.secondCard.dataset.pair;

    if (isMatch) {
        handleMatch();
    } else {
        handleMismatch();
    }
}

function handleMatch() {
    gameData.firstCard.classList.add('matched');
    gameData.secondCard.classList.add('matched');
    gameData.matchedPairs++;

    resetBoard();

    // Get required pairs based on level
    const requiredPairs = Math.floor(getLevelCardCount(gameData.currentLevel) / 2);
    if (gameData.matchedPairs === requiredPairs) {
        setTimeout(showWinMessage, 500);
    }
}

function getLevelCardCount(level) {
    switch(level) {
        case 1: return 4;
        case 2: return 8;
        case 3: return 16;
        case 4: return 25;
        case 5: return 30;
        default: return 4;
    }
}

function handleMismatch() {
    gameData.lockBoard = true;
    setTimeout(() => {
        gameData.firstCard.classList.remove('flip');
        gameData.secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    gameData.firstCard = null;
    gameData.secondCard = null;
    gameData.lockBoard = false;
}

function resetGameState() {
    gameData.moves = 0;
    gameData.matchedPairs = 0;
    gameData.firstCard = null;
    gameData.secondCard = null;
    gameData.lockBoard = false;
    gameData.seconds = 0;
    if (gameData.timer) {
        clearInterval(gameData.timer);
        gameData.timer = null;
    }
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    document.getElementById('winMessage').style.display = 'none';
}

function startTimer() {
    if (gameData.timer) {
        clearInterval(gameData.timer);
    }
    gameData.timer = setInterval(() => {
        gameData.seconds++;
        const minutes = Math.floor(gameData.seconds / 60);
        const seconds = gameData.seconds % 60;
        document.getElementById('time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function showWinMessage() {
    clearInterval(gameData.timer);
    const winMessage = document.getElementById('winMessage');
    document.getElementById('finalMoves').textContent = gameData.moves;
    document.getElementById('finalTime').textContent = document.getElementById('time').textContent;
    winMessage.style.display = 'block';
    
    // Hide next level button if on max level
    const nextLevelBtn = document.getElementById('nextLevel');
    nextLevelBtn.style.display = gameData.currentLevel < 5 ? 'block' : 'none';
}

// Event Listeners
document.querySelectorAll('.level-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        gameData.currentLevel = parseInt(e.target.dataset.level);
        initializeGame(gameData.currentLevel);
    });
});

document.getElementById('playAgain').addEventListener('click', () => {
    initializeGame(gameData.currentLevel);
});

document.getElementById('nextLevel').addEventListener('click', () => {
    if (gameData.currentLevel < 5) {
        gameData.currentLevel++;
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === gameData.currentLevel) {
                btn.classList.add('active');
            }
        });
        initializeGame(gameData.currentLevel);
    }
});

// Initialize game with level 1
initializeGame(1);