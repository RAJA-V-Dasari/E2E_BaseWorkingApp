Vue.component("round1-container", {
  template: `
    <div>
      <h2>Round 1</h2>

      <div v-if="phase === 'floor1'">
        <past-memory v-if="role === 'past'"></past-memory>
        <future-memory v-if="role === 'future'"></future-memory>
      </div>

      <div v-if="phase === 'floor2'">
        <h3>Floor 2 Coming Soon...</h3>
      </div>
    </div>
  `,
  computed: {
    phase() { return state.phase; },
    role() { return state.role; }
  }
});