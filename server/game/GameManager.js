const GameState = require("./GameState");
const Floor1 = require("./round1/Floor1_MemoryGrid");
const Floor2 = require("./round1/Floor2_LogPuzzle");
const Floor3 = require("./round1/Floor3_NumberWordle");

class GameManager {
  constructor(io) {
    this.io = io;

    this.state = new GameState();

    this.floor1 = new Floor1(() => {
      this.broadcast(); 
    });

    this.floor2 = null;
    this.floor3 = null;

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
      if (!this.floor3) {  
        this.floor3 = new Floor3();
      }
      this.state.phase = "floor3";
    }

    this.broadcast();
  }

  handleFloor3Submit(socketId, guess) {
    if (this.state.players.future !== socketId) return;

    const result = this.floor3.submit(guess);

    if (result.status === "invalid") {
      return;
    }

    if (result.status === "correct") {
      this.state.phase = null;
      this.state.screen = "end";
    }

    if (result.status === "wrong") {
      this.floor3.setFeedback({ A: result.A, B: result.B });

    }

    this.broadcast();
  }

  handleFloor3Reset(socketId) {
    if (this.state.players.past !== socketId) return;
    this.floor3.locked = false;
    this.floor3.setFeedback(null); 

    this.floor1.reset(() => this.broadcast());
    this.floor2 = null;

    this.state.phase = "floor1";

    this.broadcast();
  }

  getState() {
    return {
      players: this.state.players,
      round: this.state.round,
      phase: this.state.phase,
      screen: this.state.screen,
      floor1: this.floor1.getState(),
      floor2: this.floor2 ? this.floor2.getState() : null,
      floor3: this.floor3 ? this.floor3.getState() : null,
    };
  }
}

module.exports = GameManager;