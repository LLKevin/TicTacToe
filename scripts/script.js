//module pattern --- use only if you need one of something (gameboard, display controller)
//keeps track of creating the board, modifying the board, updating the display

let playerOne;
let playerTwo;
let btnStartGame = document.querySelector('.btnStartGame');
let btnResetGame = document.querySelector('.btnReset');
let btnNextRound = document.querySelector('.btnNextRound');

const Gameboard = (() => {

  let gameBoard = Array(3).fill().map(() => Array(3));
  let gameBoardContainer = document.querySelector('.gameBoardContainer');

  const getGameBoard = () => gameBoard;
  const createBoard = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      let row = document.createElement('div');
      row.className = "row";

      for (let j = 0; j < gameBoard[i].length; j++) {

        var tile = document.createElement("input");
        tile.addEventListener('click', function (e) {
          GameFlow.applyMark(e.target);
        });

        tile.type = "button";
        tile.className = "gameBoardTiles";
        tile.name = `${i} ${j}`;

        //append to row
        row.appendChild(tile);

        gameBoard[i][j] = tile;
        gameBoardContainer.appendChild(row);
      }
    };
  };
  const clearGameBoard = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        gameBoard[i][j].value = "";
      }
    }
    DisplayUI.clearMessages();
    GameFlow.resetGameFlow();
  }
  const resetGame = () => {
    while (gameBoardContainer.firstChild)
      gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    playerOne = {};
    playerTwo = {};
    DisplayUI.clearMessages();
    GameFlow.resetGameFlow();
  };
  return {
    getGameBoard,
    createBoard,
    resetGame,
    clearGameBoard,
  };
})();

//responsible for keeping try of turns, applying the marker to the tile, and checking win conditions.
const GameFlow = (() => {
  let firstPlayersTurn = "true";
  let numberOfMarks = 0;
  let gameOver = false;

  const switchTurn = () => {
    firstPlayersTurn === "true" ? firstPlayersTurn = "false" : firstPlayersTurn = "true";
    DisplayUI.displayPlayerTurnMessage(firstPlayersTurn);
  }
  const applyMark = (tile) => {
    if (tile.value === "" && gameOver == false) {
      if (firstPlayersTurn === "true") {
        tile.value = playerOne.getMarker();
      } else {
        tile.value = playerTwo.getMarker();
      }
      numberOfMarks++;
      switchTurn();
      winCondition(tile);
    }
  };
  const winCondition = () => {

    let board = Gameboard.getGameBoard();


    for (let i = 0; i < board.length; i++) {
      //row
      if (board[i][0].value == "X" && board[i][1].value == "X" &&
        board[i][2].value == "X") {
        DisplayUI.displayWinnerMessage(true);
      }
      if (board[i][0].value == "O" && board[i][1].value == "O" &&
        board[i][2].value == "O") {
        DisplayUI.displayWinnerMessage(false);
      }

      //col
      if (board[0][i].value == "X" && board[1][i].value == "X" &&
        board[2][i].value == "X") {
        DisplayUI.displayWinnerMessage(true);

      }
      if (board[0][i].value == "O" && board[1][i].value == "O" &&
        board[2][i].value == "O") {
        DisplayUI.displayWinnerMessage(false);
      }
    }

    //diagonally
    if (board[0][0].value == "X" && board[1][1].value == "X" &&
      board[2][2].value == "X") {
      DisplayUI.displayWinnerMessage(true);

    }
    if (board[0][0].value == "O" && board[1][1].value == "O" &&
      board[2][2].value == "O") {
      DisplayUI.displayWinnerMessage(false);

    }
    if (board[0][2].value == "X" && board[1][1].value == "X" &&
      board[2][0].value == "X") {
      DisplayUI.displayWinnerMessage(true);

    }
    if (board[0][2].value == "O" && board[1][1].value == "O" &&
      board[2][0].value == "O") {
      DisplayUI.displayWinnerMessage(false);

    }
    //TIE;
    if (numberOfMarks === 9) {
      DisplayUI.displayTieMessage();
      gameOver = true;
    }
  };

  const resetGameFlow = () => {
    gameOver = false;
    firstPlayersTurn = "true";
    numberOfMarks = 0;
  };

  return {
    applyMark,
    switchTurn,
    resetGameFlow,
    winCondition,
  };

})();

//responsible for any display messages 
const DisplayUI = (() => {

  let messageBox = document.querySelector(".messageBox");

  const displayWinnerMessage = (playerOneWins) => {
    if (playerOneWins === true) {
      messageBox.textContent = `${playerOne.getName()} Wins`;
      playerOne.incrementPoints();
    } else {
      messageBox.textContent = `${playerTwo.getName()} Wins`;
      playerTwo.incrementPoints();
    }
    btnResetGame.style.display = "block"
    btnNextRound.style.display = "block"
    gameOver = true;

  }
  const displayPlayerTurnMessage = (playerOneTurn) => {
    if (playerOneTurn === "true") {
      messageBox.textContent = `${playerOne.getName()} Turn`;

    } else {
      messageBox.textContent = `${playerTwo.getName()} Turn`;
    }
  }
  const displayTieMessage = () => {
    messageBox.textContent = "Tie";
  }
  const clearMessages = () => {
    messageBox.textContent = "";
  }
  return {
    displayWinnerMessage,
    displayPlayerTurnMessage,
    displayTieMessage,
    clearMessages,
  }
})();

// keeps track of the scoreboard of a player (wins/loses/ties) and name
const Player = (name, marker) => {
  let totalPoints = 0;
  const getName = () => name;
  const getMarker = () => marker;
  const getPoints = () => totalPoints;
  const incrementPoints = () => totalPoints++;

  return {
    getName,
    getMarker,
    getPoints,
    incrementPoints,
  }
};

//click handlers
btnStartGame.addEventListener('click', () => {

  let firstName = document.querySelector('.playerOne');
  let secondName = document.querySelector('.playerTwo');

  if (firstName.value !== "" && secondName.value !== "") {
    Gameboard.createBoard(3, 3); //create game board
    playerOne = Player(firstName.value, 'X');
    playerTwo = Player(secondName.value, 'O');
    DisplayUI.displayPlayerTurnMessage("true");
    btnStartGame.style.display = "none";
  } else {
    alert("You must enter player names to Play"); //TODO add ui element to
  }
});
btnResetGame.addEventListener('click', () => {
  Gameboard.resetGame();
  btnResetGame.style.display = "none";
  btnNextRound.style.display = "none";
  btnStartGame.style.display = "block";
});
btnNextRound.addEventListener('click', () => {
  Gameboard.clearGameBoard();
  DisplayUI.displayPlayerTurnMessage("true");

  btnResetGame.style.display = "none"
  btnNextRound.style.display = "none"
  console.log(playerOne.getPoints());
  console.log(playerTwo.getPoints());
});