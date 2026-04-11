Vue.component("game-screen", {
  template: `
    <div>
      <h2>Game Started</h2>
      <p>Your Role: {{ role }}</p>

      <p>Past: {{ players.past }}</p>
      <p>Future: {{ players.future }}</p>

      <div>
      <round1-container v-if="round === 1"></round1-container>
      </div>
    </div>
  `,
  computed: {
    role() { return state.role; },
    players() { return state.players; },
    round() { return state.round; }
  }
});