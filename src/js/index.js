import Tictactoe from "./game/game";
import Bot from "./bot/bot";
import inputLogic from "./game/inputlogic";
import $ from "jquery";

console.log("Starting Tic Tac Toe...");

const game1 = new Tictactoe();
console.log(game1.getStandings());

inputLogic(game1, true);

const bot1 = new Bot(game1, [{ units: 20, activation: "relu" }]);
bot1.model.summary();

$(document).click(() => {
  console.log(bot1.guess()[0]);
});
