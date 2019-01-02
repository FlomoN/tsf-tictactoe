import Citizen from "./citizen";
import Game from "../game/game";
import * as tf from "@tensorflow/tfjs";

/**
 * The Population of Tic Tac Toe playing bots. This class handles the setup of a population
 * and the necessary selection and crossbreeding functions
 */
class Population {
  constructor(size, config, mutation) {
    this.size = size;
    this.config = config;
    this.year = 0;
    this.mutation = mutation;
    this.init();
  }

  /**
   * Initializes the first population
   */
  init() {
    this.population = [];
    for (let i = 0; i < this.size; i++) {
      this.population.push(new Citizen(this.config, this.year));
    }
  }

  /**
   * Sets up all the games and seats the players
   */
  setupGames() {
    this.games = [];
    shuffle(this.population);
    for (let i = 0; i < this.size / 2; i++) {
      this.games.push({
        p1: this.population[i * 2],
        p2: this.population[i * 2 + 1],
        game: new Game(),
        finished: false
      });
    }
  }

  /**
   * Plays all the Games until everyone is finished
   */
  play() {
    this.nextPopulation = [];
    this.games.forEach(element => {
      this.gameLoop(element);
    });
  }

  /**
   * Breeds the next population out of the winners
   */
  breed() {
    this.year++;
    tf.tidy(() => {
      const parents = this.nextPopulation.slice(0);
      for (let k = 0; k < 2; k++) {
        shuffle(parents);
        for (let i = 0; i < this.size / 4; i++) {
          this.nextPopulation.push(
            this.cross(parents[i * 2], parents[i * 2 + 1])
          );
        }
      }
    });

    this.mutate();
    this.population = this.nextPopulation;
  }

  /**
   * Crosses the genes of two citizens to make a new citizen
   * @param {Citizen} mom The Mom
   * @param {Citizen} dad The Dad
   * @returns the Child
   */
  cross(mom, dad) {
    const newWeights = [];
    tf.tidy(() => {
      mom.getWeights().forEach((element, index) => {
        const b = tf.scalar(2);
        const newWeight = element.add(dad.getWeights()[index]).div(b);
        newWeights.push(newWeight);
        tf.keep(newWeight);
      });
    });
    const child = new Citizen(this.config, this.year, newWeights);
    return child;
  }

  /**
   * Mutates randomly selected Citizens a little bit
   */
  mutate() {
    tf.tidy(() => {
      this.nextPopulation.forEach(element => {
        const chance = Math.random();
        if (chance <= this.mutation.chance) {
          const weights = element.getWeights();
          const newWArr = [];
          weights.forEach(w => {
            const arr = tf.tidy(() => {
              return w.flatten().dataSync();
            });

            arr.forEach((val, index) => {
              const rate = Math.random();
              if (rate <= this.mutation.rate) {
                //Set new Value
                arr[index] = Math.random() * 2 - 1;
              }
            });
            newWArr.push(arr);
          });

          // Now Reset Weights with new Values
          const shapes = weights.map(x => x.shape);

          const finalWeights = [];

          shapes.forEach((x, index) => {
            const t = tf.tensor2d(newWArr[index], x);
            finalWeights.push(t);
            tf.keep(t);
          });

          // And give em to the citizen
          element.setWeights(finalWeights);
        }
      });
    });
  }

  /**
   * The Gameloop until finished of a single game
   * @private
   */
  gameLoop(game) {
    let currentplayer = 0;
    while (!game.finished) {
      let legal;

      switch (currentplayer) {
        case 0:
          legal = game.p1.makeMove(currentplayer + 1, game.game);
          break;
        case 1:
          legal = game.p2.makeMove(currentplayer + 1, game.game);
          break;
        default:
          break;
      }

      const gameResult = game.game.getWinner();
      const winner = gameResult.winner;

      if (!legal) {
        //Current Player loses because move was illegal
        switch (currentplayer) {
          case 0:
            this.nextPopulation.push(game.p2);
            game.p1.kill();
            break;
          case 1:
            this.nextPopulation.push(game.p1);
            game.p2.kill();
            break;
          default:
            break;
        }
        game.finished = true;
      } else if (winner !== 0) {
        console.log("A Fucking Bot won with " + gameResult.row);
        console.log(game.game.getStandings());
        switch (winner - 1) {
          case 0:
            this.nextPopulation.push(game.p1);
            game.p2.kill();
            break;
          case 1:
            this.nextPopulation.push(game.p2);
            game.p1.kill();
            break;
          default:
            break;
        }
        game.finished = true;
      } else {
        currentplayer = (currentplayer + 1) % 2;
      }
    }
  }
}

export default Population;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
