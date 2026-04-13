Vue.component("round2-container", {
  template: `
    <div>
      <h2>Round 2 - Facility Breach</h2>

      <div v-if="role === 'past'">
        <past-view></past-view>
      </div>

      <div v-if="role === 'future'">
        <future-view></future-view>
      </div>
    </div>
  `,
  computed: {
    role() { return state.role; }
  }
});