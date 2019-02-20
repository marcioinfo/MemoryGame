// define all variable that will be used throughout the code
let card = document.getElementsByClassName('card');
let cards = [...card];
console.log(cards);

let deck = document.getElementsByClassName('card-deck')[0];
let moves = 0;
let counter = document.querySelector('.moves');
let stars = document.querySelectorAll('.fa-star');
let starsList = document.querySelectorAll('.stars li');
let matchingCard = document.getElementsByClassName('matching');
let closeIcon = document.querySelector('.close');
let modal = document.getElementsByClassName('modal')[0];
let openedCards = [];
let timer = document.querySelector('.timer');
let interval;
const resetButton = document.querySelector('.restart');
const modalButton = document.querySelector('.play-again');


//Function to play the soung when cards match, need a parameter with the path and file name!
function song(src) {
  let sound = document.createElement("AUDIO");
  sound.id       = 'macth';
  sound.src      = src //'sound/match.mp3';
  sound.type     = 'audio/mp3';
  document.body.appendChild(sound);
  const song = document.getElementById("macth");
  song.play();
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
  }

// Shuffles cards upon page load
document.body.onload = startMemoryGame();
// Calls startMemoryGame()
resetButton.addEventListener('click', startMemoryGame);
// Calls reset() function (hides modal and restarts game) with user clicks "play again" button in modal
modalButton.addEventListener('click', reset);
//define function startMemoryGame()
function startMemoryGame() {
  // call function Shuffles and get return shuffled array into cards and add it into deck
  cards = shuffle(cards);
  for (let i = 0; i < cards.length; i++) {
        deck.appendChild(cards[i]);
    cards[i].classList.remove('show', 'open', 'matching', 'disabled');
  }
  openedCards = [];
  // Resets
  moves = 0;
  counter.innerHTML = moves;

  for (let i = 0; i < stars.length; i++) {
    stars[i].style.color = '#ffd700';
    stars[i].style.display = 'inline';
  }

  let s = 0;
  let m = 0;
  let h = 0;
  let timer = document.querySelector('.timer');
  timer.innerHTML = '0 mins 0 secs';
  clearInterval(interval);
}


// When called, function toggles open and show classes to display cards. 
let displayCard = function() {
  this.classList.toggle('open');
  this.classList.toggle('show');
  this.classList.toggle('disabled');
};
// Adds flipped cards to openedCards array, and checks if cards are a match or not
function cardOpen() {
  openedCards.push(this);
  let len = openedCards.length;
  if (len === 1 && moves === 0) {
    startTimer();
  } else if (len === 2) {
    moveCounter();
    if (openedCards[0].type === openedCards[1].type) {
      matching();
      song('sound/match.mp3');
    } else {
      unMatching();      
    }
  }
}

// When cards match, adds/removes classes
function matching() {
  openedCards[0].classList.add('matching', 'disabled');
  openedCards[1].classList.add('matching', 'disabled');
  openedCards[0].classList.remove('show', 'open');
  openedCards[1].classList.remove('show', 'open');
  openedCards = [];
}

// When cards don't match, adds class "unmatching" and calls disable() function (to disable flipping of other cards). and call enable() function (to make flipping cards possible again)
function unMatching() {
  openedCards[0].classList.add('unmatching');
  openedCards[1].classList.add('unmatching');
  disable();
  setTimeout(function() {
    openedCards[0].classList.remove('show', 'open', 'unmatching');
    openedCards[1].classList.remove('show', 'open', 'unmatching');
    enable();
    openedCards = [];
  }, 500);
}

// Disables all cards temporarily (while two cards are flipped)
function disable() {
  cards.forEach(card => card.classList.add('disabled'));
}

// Enables flipping of cards, disables matching cards
function enable() {
  Array.prototype.filter.call(cards, function(card) {
    card.classList.remove('disabled');
    for (let i = 0; i < matchingCard.length; i++) {
      matchingCard[i].classList.add('disabled');
    }
  });
}

// Updates move counter
function moveCounter() {
  moves++;
  counter.innerHTML = moves;
  // Sets star rating based on number of moves.
  if (moves > 8 && moves < 12) {
    for (i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.display = 'none';
      }
    }
  }
  else if (moves > 16) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.display = 'none';
      }
    }
  }
}

// Game timer
function startTimer() {
  s = 0;
  m = 0;
  h = 0;
  interval = setInterval(function() {
    timer.innerHTML = m + ' mins ' + s + ' secs';
    s++;
    if (s == 60) {
      m++;
      s = 0;
    }
    if (m == 60) {
      h++;
      m = 0;
    }
  }, 1000);
}

// Congratulates player and shows modal

function congratulations() {
  if (matchingCard.length == 16) {
    //Stops setInterval()
    clearInterval(interval);
    let finalTime = timer.innerHTML;
    // Shows congratulations modal
    modal.classList.add('show');
    let starRating = document.querySelector('.stars').innerHTML;
    document.getElementsByClassName('final-moves')[0].innerHTML = moves;
    document.getElementsByClassName('star-rating')[0].innerHTML = starRating;
    document.getElementsByClassName('total-time')[0].innerHTML = finalTime;
    closeModal();
  }
}

// Closes modal upon clicking its close icon
function closeModal() {
  closeIcon.addEventListener('click', function(e) {
    modal.classList.remove('show');
    startMemoryGame();
  });
}

// Called when user hits "play again" button
function reset() {
  modal.classList.remove('show');
  startMemoryGame();
}

// Adds event listeners to each card
for (let i = 0; i < cards.length; i++) {
  card = cards[i];
  card.addEventListener('click', displayCard);
  card.addEventListener('click', cardOpen);
  card.addEventListener('click', congratulations);
}
