import Bot from "../bot/bot";
import Tictactoegame from "../game/game";
import { dispose, tidy } from "@tensorflow/tfjs";

/**
 * A single Citizen in the Population with Behavior for playing Tic Tac Toe
 * has a fitness function to evaluate Performance,
 * method for extracting its weights,
 * method for making the next move on a given game
 * or a method to just make a prediction on a given game.
 */
class Citizen {
  constructor(config, birthyear, weights = undefined) {
    this.brain = new Bot(config);
    this.birthyear = birthyear;
    this.weights = this.brain.extractWeights();
    if (weights) {
      this.setWeights(weights);
    }
  }

  /**
   * Determins the Fitness of the current Citizen after the current game
   * @returns number of rounds played (?)
   */
  fitness() {
    return 0; //TODO Evaluate Fitness
  }

  /**
   * Get the weights of the Citizen
   * @returns The weights
   */
  getWeights() {
    const x = [];
    this.weights.forEach(element => {
      x.push(element[0]);
    });

    return x;
  }

  setWeights(w) {
    this.weights.forEach((element, index) => {
      element[0] = w[index];
    });
    this.brain.setWeights(this.weights);
    this.weights = this.brain.extractWeights();
  }

  /**
   * Lets the Citizen Make a Move on the given game
   * @param {number} player which player he is
   * @param {Tictactoegame} game the game he plays in
   * @returns whether his move was legal or not
   */
  makeMove(player, game) {
    const guess = this.makePrediction(player, game);
    const result = game.makeMove(player, guess);
    return result;
  }

  /**
   * Lets the Citizen just make the prediction but not the actual move
   * @param {number} player which player he is
   * @param {Tictactoegame} game
   * @returns the guessed move to make
   */
  makePrediction(player, game) {
    const guess = this.brain.guess(player, game);
    return guess;
  }

  /**
   * Kills the Citizen and clears all alocated GPU Memory
   */
  kill() {
    this.brain.kill();
    //Maybe this shouldnt be here?
    this.weights.forEach(element => {
      dispose(element);
    });
  }
}

export default Citizen;
