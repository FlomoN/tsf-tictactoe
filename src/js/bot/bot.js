import * as tf from "@tensorflow/tfjs";

class Bot {
  /**
   * The DNN that makes the bot think
   * @param {Tictactoegame} game the instance of a game the bot is supposed to play
   * @param {array} config Configuration of the intermediate Layers, each object should have:
   * units (number of units) and activation (name of the activation function to use)
   */
  constructor(config) {
    this.model = tf.sequential();
    this.config = config;
    config.forEach((element, index) => {
      if (index === 0) {
        this.model.add(
          tf.layers.dense({
            units: element.units,
            activation: element.activation,
            inputDim: 10
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

  /**
   * Lets the bot make a guess on the current game
   * @param {number} player which player he should represent
   * @param {Tictactoegame} game the game to guess on
   */
  guess(player, game) {
    return tf.tidy(() => {
      const input = tf.tensor2d([player, ...game.getStandings()], [1, 10]);
      const prediction = this.model.predict(input);
      const result = prediction.argMax(1).dataSync();
      return result[0];
    });
  }

  /**
   * Extracts the weights out of the current model and layers
   * @returns an array of tensors representing the weights
   */
  extractWeights() {
    const weights = [];
    tf.tidy(() => {
      for (let i = 0; i < this.config.length + 1; i++) {
        const layer = this.model.getLayer(null, i);
        const l_weight = layer.getWeights();
        weights.push(l_weight);
        tf.keep(l_weight);
      }
    });

    return weights;
  }

  /**
   * Sets the weights of the current Model
   * @param {Tensor} weights
   */
  setWeights(weights) {
    tf.tidy(() => {
      for (let i = 0; i < this.config.length + 1; i++) {
        const layer = this.model.getLayer(null, i);
        layer.setWeights(weights[i]);
        // This Behavior is quite weird maybe ask in forum or issue on the github?
        // Do I have to dispose the weights i put in myself, why doesnt it take those and dispose the old weights
        tf.dispose(weights[i][0]);
      }
    });
  }

  /**
   * Frees the GPU Memory so no more Out of Memory Shit happens
   */
  kill() {
    this.model.dispose();
  }
}

export default Bot;
