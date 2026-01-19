var deck = [];
var playerCards = [];
var dealerCards = [];
var wins = 0;
var losses = 0;
var draws = 0;
let bgm = new Audio("sound/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.5;
window.startGame = function() {
    bgm.play();
    playerCards = [];
    dealerCards = [];
    createDeck();
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    
    playerCards.push(drawCard());
    playerCards.push(drawCard());
    dealerCards.push(drawCard());
    dealerCards.push(drawCard());
    
    showCard(playerCards[0], 'player-cards', false);
    showCard(playerCards[1], 'player-cards', false);
    showCard(dealerCards[0], 'dealer-cards', true);
    showCard(dealerCards[1], 'dealer-cards', false);
    
    document.getElementById('player-score').textContent = getScore(playerCards);
    var visibleDealerCards = [dealerCards[1]];
    document.getElementById('dealer-score').textContent = getScore(visibleDealerCards);
    
    var startBtn = document.querySelector('button[onclick="startGame()"]');
    if (startBtn) startBtn.disabled = true;
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    document.getElementById('new-btn').disabled = true;
    document.getElementById('message').textContent = 'ヒットかスタンドを選んでください';
};

window.hit = function() {
    var hitBtn = document.getElementById('hit-btn');
    if (!hitBtn || hitBtn.disabled) {
        return;
    }
    
    var card = drawCard();
    if (!card) {
        console.error('No card drawn');
        return;
    }
    
    playerCards.push(card);
    showCard(card, 'player-cards', false);
    var score = getScore(playerCards);
    document.getElementById('player-score').textContent = score;
    
    if (score > 21) {
        document.getElementById('message').textContent = 'バスト！負け';
        losses++;
        document.getElementById('losses').textContent = losses;
        document.getElementById('hit-btn').disabled = true;
        document.getElementById('stand-btn').disabled = true;
        document.getElementById('new-btn').disabled = false;
    } else if (score == 21) {
        stand();
    }
};

window.stand = function() {
    var standBtn = document.getElementById('stand-btn');
    if (!standBtn || standBtn.disabled) {
        return;
    }
    
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    
    for (var i = 0; i < playerCards.length; i++) {
        showCard(playerCards[i], 'player-cards', false);
    }
    
    for (var i = 0; i < dealerCards.length; i++) {
        showCard(dealerCards[i], 'dealer-cards', false);
    }
    
    var dealerScore = getScore(dealerCards);
    while (dealerScore < 17) {
        var card = drawCard();
        if (!card) break;
        dealerCards.push(card);
        showCard(card, 'dealer-cards', false);
        dealerScore = getScore(dealerCards);
    }
    
    var playerScore = getScore(playerCards);
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = dealerScore;
    
    if (dealerScore > 21) {
        document.getElementById('message').textContent = '勝ち！';
        wins++;
    } else if (playerScore > dealerScore) {
        document.getElementById('message').textContent = '勝ち！';
        wins++;
    } else if (playerScore < dealerScore) {
        document.getElementById('message').textContent = '負け';
        losses++;
    } else {
        document.getElementById('message').textContent = '引き分け';
        draws++;
    }
    
    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('draws').textContent = draws;
    
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('new-btn').disabled = false;
};

window.newGame = function() {
    playerCards = [];
    dealerCards = [];
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('message').textContent = 'ゲームを開始してください';
    var startBtn = document.querySelector('button[onclick="startGame()"]');
    if (startBtn) startBtn.disabled = false;
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('new-btn').disabled = true;
    document.getElementById('player-score').textContent = '0';
    document.getElementById('dealer-score').textContent = '0';
};

var suits = ['♠', '♥', '♦', '♣'];
var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    deck = [];
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            deck.push({ suit: suits[i], value: values[j] });
        }
    }
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function drawCard() {
    if (deck.length == 0) createDeck();
    return deck.pop();
}

function getScore(cards) {
    var score = 0;
    var aces = 0;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].value == 'A') {
            score += 11;
            aces++;
        } else if (cards[i].value == 'J' || cards[i].value == 'Q' || cards[i].value == 'K') {
            score += 10;
        } else {
            score += parseInt(cards[i].value);
        }
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function showCard(card, where, hidden) {
    var div = document.getElementById(where);
    if (!div) {
        console.error('Element not found: ' + where);
        return;
    }
    
    if (hidden) {
        var cardDiv = document.createElement('div');
        cardDiv.className = 'card-back';
        cardDiv.textContent = '?';
        div.appendChild(cardDiv);
    } else {
        var cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        if (card && card.suit) {
            if (card.suit == '♥' || card.suit == '♦') {
                cardDiv.classList.add('red');
            } else {
                cardDiv.classList.add('black');
            }
            cardDiv.textContent = card.value + card.suit;
        } else {
            cardDiv.textContent = '?';
        }
        div.appendChild(cardDiv);
    }
}
