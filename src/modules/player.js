import createGameBoard from "./gameboard";
function createPlayer(type) {
  let player = {};
  player.type = type;
  player.board = createGameBoard();

  return player;
}

export default createPlayer;
