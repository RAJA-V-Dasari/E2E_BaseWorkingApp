const GameState = require("./GameState");
const Floor1 = require("./round1/Floor1_MemoryGrid");
const Floor2 = require("./round1/Floor2_LogPuzzle");

class GameManager {
  constructor(io) {
    this.io = io;

    this.state = new GameState();

    this.floor1 = new Floor1(() => {
      this.broadcast(); 
    });

    this.floor2 = null;

    this.state.phase = "floor1";
  }

  broadcast() {
    this.io.emit("gameStateUpdate", this.getState());
  }

  addPlayer(socketId, role) {
    if (role === "past") {
      if (this.state.players.past) return false;
      this.state.players.past = socketId;
      return true;
    }

    if (role === "future") {
      if (this.state.players.future) return false;
      this.state.players.future = socketId;
      return true;
    }

    return false;
  }

  removePlayer(socketId) {
    if (this.state.players.past === socketId) {
      this.state.players.past = null;
    }

    if (this.state.players.future === socketId) {
      this.state.players.future = null;
    }
  }

  handleMemoryClick(value) {
    const result = this.floor1.handleClick(value);

    if (result.status === "reset") {
      this.floor1.reset(() => this.broadcast());
    }

    if (result.status === "complete") {
      this.floor2 = new Floor2();
      this.state.phase = "floor2";
    }

    this.broadcast(); 
  }

  handleFloor2Submit(socketId, answer) {
    if (this.state.players.past !== socketId) return;

    const result = this.floor2.submit(answer);

    if (result.status === "correct") {
      this.state.phase = "floor3";
    }

    this.broadcast();
  }

  getState() {
    return {
      players: this.state.players,
      round: this.state.round,
      phase: this.state.phase,
      floor1: this.floor1.getState(),
      floor2: this.floor2 ? this.floor2.getState() : null
    };
  }
}

module.exports = GameManager;