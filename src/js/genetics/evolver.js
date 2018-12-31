import Population from "./population";

/**
 * The Evolver handles the Evolution of the TicTacToeBots, sets them up,
 * makes them evolve after given parameters and provides functions to select single bots to play against
 * or to visualize the evolution process
 */
class Evolver {
  constructor(pop_size, config, cicles = 500) {
    this.size = pop_size;
    this.config = config;
    this.cicles = cicles;
    this.population = new Population(pop_size, config);
  }

  /**
   * Makes the Population play one tournament
   * @param {boolean} giveBest whether the first winner in the population should be returned
   */
  evolveStep(giveBest = false) {
    this.population.setupGames();
    this.population.play();
    this.population.breed();
    if (giveBest) {
      return this.population.population[0];
    }
  }

  /**
   * Makes the Population play tournaments until amount reaches cicles
   * @returns the best player
   */
  evolve() {
    for (let i = 0; i < this.cicles - 1; i++) {
      this.evolveStep();
      console.log("Year: " + i);
    }
    console.log("Year: " + (this.cicles - 1));
    return this.evolveStep(true);
  }
}

export default Evolver;
