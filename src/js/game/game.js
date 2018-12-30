/**
 * A class that simulates a Tic Tac Toe Game
 */
class Tictactoegame {
  constructor() {
    this.field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.roundsPlayed = 0;
  }

  /**
   * Gets the current State of the Playing Field
   * @returns An array of 9 representing the playing field
   */
  getStandings() {
    return this.field;
  }

  /**
   * Indicates the number of rounds played on this game already
   * @returns the number of rounds played
   */
  getRoundsPlayed() {
    return this.roundsPlayed;
  }

  /**
   * Determines if a game has been won
   * @returns the player who has won (1 or 2) or 0 if its not won yet
   */
  getWinner() {
    const winningStandings = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let winner = 0;
    let row = [];

    if (this.roundsPlayed < 4) {
      return { winner, row };
    }

    winningStandings.forEach(element => {
      if (
        this.field[element[0]] !== 0 &&
        this.field[element[0]] === this.field[element[1]] &&
        this.field[element[1]] === this.field[element[2]]
      ) {
        winner = this.field[element[0]];
        row = element;
      }
    });

    return { winner, row };
  }

  /**
   * A single move in the tictactoe game
   * @param {*} player the number of the player making the move
   * @param {*} position The Field the player wants to put his sign in (number 0-8)
   * @returns if the move was legal (true) or not (false)
   */
  makeMove(player, position) {
    if (this.field[position] === 0) {
      this.field[position] = player;
      this.roundsPlayed++;
      return true;
    } else {
      return false;
    }
  }
}

export default Tictactoegame;
