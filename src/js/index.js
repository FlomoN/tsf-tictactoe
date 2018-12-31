import Tictactoe from "./game/game";
import Citizen from "./genetics/citizen";
import inputLogic from "./game/inputlogic";
import Population from "./genetics/population";
import $ from "jquery";
import Evolver from "./genetics/evolver";

console.log("Starting Tic Tac Toe...");

$(() => {
  const game1 = new Tictactoe();
  console.log(game1.getStandings());

  const evolver = new Evolver(
    20,
    [{ units: 20, activation: "relu" }, { units: 20, activation: "relu" }],
    200
  );
  $("#evolve").click(() => {
    const cit = evolver.evolve();
    inputLogic(game1, false, cit);
  });
});
