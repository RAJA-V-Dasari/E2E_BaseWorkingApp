class GameState {
  constructor() {
    this.players = {
      past: null,
      future: null
    };

    this.round = 1;
    this.phase = null;
    this.screen = "game"; // default
  }
}

module.exports = GameState;