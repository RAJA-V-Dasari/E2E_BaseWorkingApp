const GameState = require("./GameState");
const Floor1 = require("./round1/Floor1_MemoryGrid");

class GameManager {
  constructor(io) {
    this.io = io;

    this.state = new GameState();

    this.floor1 = new Floor1(() => {
      this.broadcast(); 
    });

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
      this.state.phase = "floor2";
    }

    this.broadcast(); 
  }

  getState() {
    return {
      players: this.state.players,
      round: this.state.round,
      phase: this.state.phase,
      floor1: this.floor1.getState()
    };
  }
}

module.exports = GameManager;