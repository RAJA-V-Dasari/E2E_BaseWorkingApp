Vue.component("past-wordle", {
  template: `
    <div>
      <h3>Feedback</h3>

      <p v-if="feedback">
        A (correct digits): {{ feedback.A }} <br>
        B (correct positions): {{ feedback.B }}
      </p>

      <p v-else>Waiting for guess...</p>

      <!-- ✅ SHOW RESET BUTTON ONLY WHEN FEEDBACK EXISTS -->
      <button v-if="feedback" @click="reset">
        Reset Round
      </button>
    </div>
  `,
  computed: {
    feedback() {
      return state.floor3?.lastFeedback;
    }
  },
  methods: {
    reset() {
      socket.emit("floor3Reset");
    }
  }
});