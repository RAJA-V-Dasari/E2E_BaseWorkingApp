const socket = io("http://10.114.78.46:3000"); // CHANGE IP

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("roleAssigned", (role) => {
  state.role = role;
  state.screen = "game";
});

socket.on("gameStateUpdate", (gameState) => {
  state.players = gameState.players;
  state.round = gameState.round;
  state.phase = gameState.phase;
  state.floor1 = gameState.floor1;
});

socket.on("error", (msg) => {
  alert(msg);
});