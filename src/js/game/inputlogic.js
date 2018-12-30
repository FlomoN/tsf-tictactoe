import $ from "jquery";

let currentPlayer = 1;

/**
 * Sets Up the Input handling for the playing field
 * @param game The Game Logic Object
 * @param pvp The Mode of the Game with true being player vs player and false being player vs computer
 */
export default function setupInputs(game, pvp = false) {
  $(() => {
    setVals(game);
    onClickBehavior(game, pvp);
  });
}

/**
 * Sets the Playing Field with the correct Values
 * @param {TicTacToeGame} game
 */
function setVals(game) {
  let fields = game.getStandings();
  fields = fields.map(convertToTTT);

  $(".field").each((index, element) => {
    $(element).val(fields[index]);
  });
}

/**
 * Converts the number Values of the game logic to the proper Signs
 * @param number The Input Number
 * @returns the proper X, O, or whitespace representation
 */
function convertToTTT(number) {
  let temp;
  if (number === 0) {
    temp = " ";
  } else if (number === 1) {
    temp = "X";
  } else {
    temp = "O";
  }
  return temp;
}

/**
 * Handles Clicking of the fields
 * @param {TicTacToeGame} game The game logic
 * @param {boolean} pvp pvp enabled or not
 */
function onClickBehavior(game, pvp) {
  $(".field").each((index, element) => {
    $(element).click(() => {
      //What happens when a thing gets clicked
      const legal = game.makeMove(currentPlayer, index);
      if (legal) {
        setVals(game);
        if (pvp) {
          currentPlayer = (currentPlayer % 2) + 1;
        }
        checkIfWon(game);
      }
    });
  });
}

/**
 * Checks if the game has been won
 */
function checkIfWon(game) {
  const winner = game.getWinner();

  if (winner.winner) {
    console.log("Player " + winner.winner + " won with row: " + winner.row);
  }
}
