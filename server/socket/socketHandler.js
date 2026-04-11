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
  });
};