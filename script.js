const NUMBER_OF_GUESSES = 3;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString;
let nextPoke = document.getElementById("nextBtn");

toastr.options = {
  timeOut: 0,
  extendedTimeOut: 100,
  tapToDismiss: true,
  debug: false,
  fadeOut: 10,
  positionClass: "toast-top-center"
};

var radios = document.getElementsByName("myRadio");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("click", function() {
    for (var j = 0; j < radios.length; j++) {
      if (radios[j] !== this) {
        radios[j].checked = false;
      }
    }
  });
}


function setSelectedValue() {
  const selectedValue = document.querySelector('input[name="myRadio"]:checked').value;
  sessionStorage.setItem('selectedValue', selectedValue);
  window.location.href = 'game.html';
}

function selectGeneration() {
  window.location.href = 'poke.html';
}

const selectedValue = sessionStorage.getItem('selectedValue');
const pokemonGroup = parseInt(selectedValue);


const picture = document.getElementById("picture");
const name = document.getElementById("name");
const type = document.getElementById("type");
const ability = document.getElementById("ability");
const weight = document.getElementById("weight");
const id = document.getElementById("id");
const button = document.getElementById("myBtn");
const numColumn = document.getElementById("column");


button.addEventListener("mousedown", runGame);
nextPoke.addEventListener("mousedown", runGame);

function runGame() {
  toastr.clear();
  cleanKeyBoard();

  nextPoke.disabled = false;
  guessesRemaining = NUMBER_OF_GUESSES;
  currentGuess = [];
  nextLetter = 0;

  let pokemonId = 0;

  if (pokemonGroup === 1) { // 1 to 151
   pokemonId = Math.floor(Math.random() * 151) + 1;

  } else if (pokemonGroup === 2) { // 152 to 251
    pokemonId = Math.floor(Math.random() * 251) + 152;

  } else if (pokemonGroup === 3) { // 252 to 386
    pokemonId = Math.floor(Math.random() * 386) + 252;
    
  } else if (pokemonGroup === 4) { // 387 to 493
    pokemonId = Math.floor(Math.random() * 493) + 387;
    
  } else if (pokemonGroup === 5) { // 494 to 649
    pokemonId = Math.floor(Math.random() * 649) + 494;
    
  } else if (pokemonGroup === 6) { // 650 to 721
    pokemonId = Math.floor(Math.random() * 721) + 650;
    
  } else if (pokemonGroup === 7) { // 722 to 809
    pokemonId = Math.floor(Math.random() * 809) + 722;
    
  } else if (pokemonGroup === 8) { // 810 to 905
    pokemonId = Math.floor(Math.random() * 905) + 810;
    
  } else if (pokemonGroup === 9) { // 906 to 1016
    pokemonId = Math.floor(Math.random() * 1016) + 906;
    
  } else if (pokemonGroup === 10) { // all
    pokemonId = Math.floor(Math.random() * 1016) + 1;
    
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
   .then(response => response.json())
   .then(pokemon => {
      console.log(pokemon)
      name.innerHTML = pokemon['name']
      numColumn.innerHTML = name.innerText.length
      id.innerText = pokemon['id']
      type.innerText = pokemon['types'][0]['type']['name']
      ability.innerText = pokemon['abilities'][0]['ability']['name']
      weight.innerText = pokemon['weight']
      picture.src = pokemon['sprites']['front_default']
      var r = document.querySelector(':root');
      r.style.setProperty('--numColumn', name.innerText.length)
      rightGuessString = name.innerText;

      initBoard();


      ;})
}


function initBoard() {

  const oldGrid = document.querySelectorAll('.letter-row');

  for (let i = 0; i < oldGrid.length; i++) {
    if (oldGrid[i]) {
      oldGrid[i].remove();
    }
  }

  let board = document.getElementById("game-board");

  for (let i = 0; i < 3; i++) {
      let row = document.createElement("div")
      row.className = "letter-row"
      
      for (let j = 0; j < name.innerText.length; j++) {
          let box = document.createElement("div")
          box.className = "letter-box"
          box.maxLength = 1;
          row.appendChild(box)
      }

      board.appendChild(row)
  }
}



document.addEventListener("keyup", (e) => {

  if (guessesRemaining === 0) {
      return
  }

  let pressedKey = String(e.key)
  if (pressedKey === "Backspace" && nextLetter !== 0) {
      deleteLetter()
      return
  }

  if (pressedKey === "Enter") {
      checkGuess()
      return
  }

  let found = pressedKey.match(/[a-z]/gi)
  if (!found || found.length > 1) {
      return
  } else {
      insertLetter(pressedKey)
  }
})

function insertLetter (pressedKey) {
  if (nextLetter === name.innerText.length) {
      return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName("letter-row")[3 - guessesRemaining]
  let box = row.children[nextLetter]
  animateCSS(box, "pulse")
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

function deleteLetter () {
  let row = document.getElementsByClassName("letter-row")[3 - guessesRemaining]
  let box = row.children[nextLetter - 1]
  box.textContent = ""
  box.classList.remove("filled-box")
  currentGuess.pop()
  nextLetter -= 1
}

function checkGuess () {
  let row = document.getElementsByClassName("letter-row")[3 - guessesRemaining]
  let guessString = ''
  let rightGuess = Array.from(rightGuessString)

  for (const val of currentGuess) {
      guessString += val
  }

  if (guessString.length != name.innerText.length) {
      toastr.error("Not enough letters!")
      return
  }
  
  for (let i = 0; i < name.innerText.length; i++) {
      let letterColor = ''
      let box = row.children[i]
      let letter = currentGuess[i]
      
      let letterPosition = rightGuess.indexOf(currentGuess[i])

      if (letterPosition === -1) {
          letterColor = 'lightgrey'
      } else {
          if (currentGuess[i] === rightGuess[i]) {
              letterColor = 'lightgreen'
          } else {
              letterColor = 'khaki'
          }

          rightGuess[letterPosition] = "#"
      }

      let delay = 250 * i
      setTimeout(()=> {
          animateCSS(box, 'flipInx')
          //shade box
          box.style.backgroundColor = letterColor
          shadeKeyBoard(letter, letterColor)
      }, delay)
  }

  if (guessString === rightGuessString) {
      toastr.success("You guessed right! Go to next Pokemon!")
      guessesRemaining = 0
      return
  } else {
      guessesRemaining -= 1;
      currentGuess = [];
      nextLetter = 0;

      if (guessesRemaining === 0) {
          toastr.error("You've run out of guesses! Game over!")
          toastr.info(`The right word was: "${rightGuessString}"`)
          nextPoke.disabled = true;
          
      }
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
      if (elem.textContent === letter) {
          let oldColor = elem.style.backgroundColor
          if (oldColor === 'lightgreen') {
              return
          } 

          if (oldColor === 'khaki' && color !== 'lightgreen') {
              return
          }

          elem.style.backgroundColor = color
          break
      }
  }
}

function cleanKeyBoard() {
  const keys = document.querySelectorAll(".keyboard-button");

  for (let i = 0; i < keys.length; i++) {
    keys[i].style.backgroundColor = 'buttonface';

  }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target
  
  if (!target.classList.contains("keyboard-button")) {
      return
  }
  let key = target.textContent

  if (key === "Del") {
      key = "Backspace"
  } 

  document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

