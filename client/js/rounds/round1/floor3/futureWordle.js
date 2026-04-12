Vue.component("future-wordle", {
  template: `
    <div>
      <h3>Enter 4-digit Code</h3>
      <input v-model="guess" maxlength="4" :disabled="locked" />
      <button @click="submit" :disabled="locked">Submit</button>
      <p v-if="locked">Waiting for Past player to reset...</p>
    </div>
  `,
  data() {
    return { guess: "" };
  },
  methods: {
    submit() {
      socket.emit("floor3Submit", this.guess);
    }
  },
  computed: {
    locked() {
        return state.floor3?.locked;
    }
  },
});