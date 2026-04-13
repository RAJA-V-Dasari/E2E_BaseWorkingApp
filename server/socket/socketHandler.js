const events = require("./events");
const GameManager = require("../game/GameManager");

module.exports = (io) => {

  const game = new GameManager(io); 

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN GAME
    socket.on(events.JOIN_GAME, (role) => {
      const success = game.addPlayer(socket.id, role);

      if (!success) {
        socket.emit("error", "Role already taken");
        return;
      }

      socket.emit(events.ROLE_ASSIGNED, role);

      game.broadcast(); 
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      game.removePlayer(socket.id);

      game.broadcast();  
    });

    socket.on("memoryClick", (value) => {
      game.handleMemoryClick(value);
    });

    socket.on("floor2Submit", (answer) => {
      game.handleFloor2Submit(socket.id, answer);
    });

    socket.on("floor3Submit", (guess) => {
      game.handleFloor3Submit(socket.id, guess);
    });

    socket.on("floor3Reset", () => {
      game.handleFloor3Reset(socket.id);
    });

    socket.on("round2Move", (dir) => {
      game.handleRound2Move(dir);
    });

    socket.on("round2Shoot", (dir) => {
      game.handleRound2Shoot(dir);
    });

    socket.on("round2Respawn", () => {
      game.handleRound2Respawn(socket.id);
    });
  });
};