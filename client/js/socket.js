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
  state.screen = gameState.screen || "game";
  state.floor1 = gameState.floor1;
  state.floor2 = gameState.floor2;
  state.floor3 = gameState.floor3;
  state.round2 = gameState.round2;
});

socket.on("error", (msg) => {
  alert(msg);
});