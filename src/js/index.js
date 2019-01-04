import Tictactoe from "./game/game";
import Citizen from "./genetics/citizen";
import inputLogic from "./game/inputlogic";
import Population from "./genetics/population";
import $ from "jquery";
import Evolver from "./genetics/evolver";
import setConfig from "./config";

import * as tfvis from "@tensorflow/tfjs-vis";

console.log("Starting Tic Tac Toe...");

$(() => {
  const game1 = new Tictactoe();
  console.log(game1.getStandings());
  const config = [
    { units: 20, activation: "relu", kernelInitializer: "randomUniform" },
    { units: 20, activation: "relu", kernelInitializer: "randomUniform" }
  ];

  setConfig(config);

  let evolver;

  let cit;

  $("#evolve").click(async () => {
    evolver = new Evolver(
      20,
      config,
      { chance: 0.1, rate: 0.5 },
      true,
      $("#iterations").val()
    );
    cit = await evolver.evolve((year, fit) => {
      $("#cicles").text("Cicles run: " + year + "/" + $("#iterations").val());
      $("#fitness").text("Average Fitness: " + fit);
    });

    inputLogic(game1, false, cit);

    // Get a surface
    const visor = tfvis.visor();
    const surface = visor.surface({ name: "Layer 0", tab: "Model" });
    const surface2 = visor.surface({ name: "Layer 1", tab: "Model" });
    const surface3 = visor.surface({ name: "Layer 2", tab: "Model" });
    tfvis.show.layer(surface, cit.brain.model.getLayer(null, 0));
    tfvis.show.layer(surface2, cit.brain.model.getLayer(null, 1));
    tfvis.show.layer(surface3, cit.brain.model.getLayer(null, 2));
    // Render a barchart on that surface
    //tfvis.render.barchart(data, surface, {});

    $("#showvis").click(() => {
      visor.open();
    });
  });
});
