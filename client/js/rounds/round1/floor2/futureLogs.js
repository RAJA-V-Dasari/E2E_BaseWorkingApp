Vue.component("future-logs", {
  template: `
    <div>
      <h3>Data Center Logs</h3>

      <div class="log-box">
        <div v-for="(log, i) in logs" :key="i">
          {{ log }}
        </div>
      </div>

      <p>Communicate with Past Player</p>
    </div>
  `,
  computed: {
    logs() {
      return state.floor2?.logsFuture || [];
    }
  }
});