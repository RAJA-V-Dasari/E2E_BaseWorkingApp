class GameState {
  constructor() {
    this.players = {
      past: null,
      future: null
    };

    this.round = 1;
    this.phase = null;
  }
}

module.exports = GameState;