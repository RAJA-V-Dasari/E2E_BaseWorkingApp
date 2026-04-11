Vue.component("past-logs", {
  template: `
    <div>
      <h3>Log Analysis</h3>

      <div class="log-box">
        <div v-for="(log, i) in logs" :key="i">
          {{ log }}
        </div>
      </div>

      <input v-model="code" placeholder="Enter Code" />
      <button @click="submit">Submit</button>
    </div>
  `,
  data() {
    return { code: "" };
  },
  computed: {
    logs() {
      return state.floor2?.logsPast || [];
    }
  },
  methods: {
    submit() {
      socket.emit("floor2Submit", this.code);
    }
  }
});