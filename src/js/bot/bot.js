import * as tf from "@tensorflow/tfjs";

class Bot {
  /**
   * The DNN that makes the bot think
   * @param {Tictactoegame} game the instance of a game the bot is supposed to play
   * @param {array} config Configuration of the intermediate Layers, each object should have:
   * units (number of units) and activation (name of the activation function to use)
   */
  constructor(game, config) {
    this.game = game;
    this.model = tf.sequential();
    config.forEach((element, index) => {
      if (index === 0) {
        this.model.add(
          tf.layers.dense({
            units: element.units,
            activation: element.activation,
            inputDim: 9
          })
        );
      } else {
        this.model.add(
          tf.layers.dense({
            units: element.units,
            activation: element.activation
          })
        );
      }
    });
    this.model.add(tf.layers.dense({ units: 9, activation: "softmax" }));
  }

  guess() {
    tf.tensor;
    const input = tf.tensor2d(this.game.getStandings(), [1, 9]);
    const prediction = this.model.predict(input);
    tf.dispose(input);
    const result = prediction.argMax(1).dataSync();
    prediction.print();
    tf.dispose(prediction);
    return result;
  }
}

export default Bot;
