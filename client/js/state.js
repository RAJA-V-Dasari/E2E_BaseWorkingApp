const state = Vue.observable({
  screen: "lobby",
  role: null,
  players: {
    past: null,
    future: null
  },
  round: 1,
  phase: null,

  floor1: null,
  floor2: null,
  floor3: null
});