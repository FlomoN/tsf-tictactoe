import $ from "jquery";
import Citizen from "../genetics/citizen";

let currentPlayer = 1;

/**
 * Sets Up the Input handling for the playing field
 * @param game The Game Logic Object
 * @param pvp The Mode of the Game with true being player vs player and false being player vs computer
 */
export default function setupInputs(game, pvp = true, cit = undefined) {
  $(() => {
    setVals(game);
    onClickBehavior(game, pvp, cit);
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
 * @param {Citizen} cit The Citizen to play against
 */
function onClickBehavior(game, pvp, cit) {
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
      if (!pvp) {
        setTimeout(() => {
          const result = cit.makeMove(2, game);
          if (!result) {
            console.log("Bot was stupid!");
          }
          setVals(game);
        }, 500);
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
