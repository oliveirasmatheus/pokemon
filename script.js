const picture = document.getElementById("picture");
const name = document.getElementById("name");
const type = document.getElementById("type");
const ability = document.getElementById("ability");
const weight = document.getElementById("weight");
const id = document.getElementById("id");
const button = document.getElementById("myBtn");
const numColumn = document.getElementById("column");

button.addEventListener("mousedown", (e) => {    
    e.preventDefault();
    const pokemonId = Math.floor(Math.random() * 1100) + 1;
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

        startup();

        ;})
})


let state = {
    secret: name.innerText,
    grid: Array(3)
        .fill()
        .map(() => Array(name.innerText.length).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < name.innerText.length; col++) {
            drawBox(grid, row, col);
        }
    }

    container.appendChild(grid);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
      const key = e.key;
      if (key === 'Enter') {
        if (state.currentCol === name.innerText.length) {
          const word = getCurrentWord();
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        }
      }
      if (key === 'Backspace') {
        removeLetter();
      }
      if (isLetter(key)) {
        addLetter(key);
      }
  
      updateGrid();
    };
  }
  
  function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
  }
  
  function isWordValid(word) {
    return name.innerText.includes(word);
  }
  
  function getNumOfOccurrencesInWord(word, letter) {
    let result = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        result++;
      }
    }
    return result;
  }
  
  function getPositionOfOccurrence(word, letter, position) {
    let result = 0;
    for (let i = 0; i <= position; i++) {
      if (word[i] === letter) {
        result++;
      }
    }
    return result;
  }
  
  function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500; // ms
  
    for (let i = 0; i < name.innerText.length; i++) {
      const box = document.getElementById(`box${row}${i}`);
      const letter = box.textContent;
      const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
        state.secret,
        letter
      );
      const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
      const letterPosition = getPositionOfOccurrence(guess, letter, i);
  
      setTimeout(() => {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        }
        
      }, ((i + 1) * animation_duration) / 2);
  
      box.classList.add('animated');
      box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
  
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 3;
  
    setTimeout(() => {
      if (isWinner) {
          alert('Congratulations!');
        }
      else if (isGameOver) {
          alert(`Better luck next time! The word was ${state.secret}.`);
      }
    }, 6 * animation_duration);
  }
  
  function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
  }
  
  function addLetter(letter) {
    if (state.currentCol === name.innerText.length) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
  
  function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
  }

function startup() {
    state = {
      secret: name.innerText,
      grid: Array(3)
          .fill()
          .map(() => Array(name.innerText.length).fill('')),
      currentRow: 0,
      currentCol: 0,
    };
    
    const oldGrid = document.querySelector('.grid');
    if (oldGrid) oldGrid.remove();

    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();
}


