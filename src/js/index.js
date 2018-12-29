import tictactoe from "./game/game";

console.log("Starting Tic Tac Toe...");

const game1 = new tictactoe();
console.log(game1.getStandings());

game1.makeMove(1, 4);
console.log("Spieler 1 setzt auf 4");
console.log(game1.getStandings());
game1.makeMove(2, 3);
console.log("Spieler 2 setzt auf 3");
console.log(game1.getStandings());
game1.makeMove(1, 1);
console.log("Spieler 1 setzt auf 1");
console.log(game1.getStandings());
game1.makeMove(2, 0);
console.log("Spieler 2 setzt auf 0");
console.log(game1.getStandings());
game1.makeMove(1, 7);
console.log("Spieler 1 setzt auf 7");
console.log(game1.getStandings());
console.log("Gewinner ist: Spieler " + game1.getWinner());
