Vue.component("past-memory", {
  template: `
    <div>
      <h3>Memory Grid</h3>

      <div v-if="showNumbers">
        <h4>Memorize: {{ countdown }}</h4>
      </div>

      <div class="grid">
        <button
          v-for="(tile, index) in tiles"
          :key="index"
          @click="clickTile(tile)"
        >
          {{ showNumbers ? tile : "?" }}
        </button>
      </div>
    </div>
  `,

  data() {
    return {
      countdown: 3,
      interval: null
    };
  },

  computed: {
    tiles() { return state.floor1?.tiles || []; },
    showNumbers() { return state.floor1?.showNumbers; },
    startTime() { return state.floor1?.startTime; }
  },

  watch: {
    startTime() {
      this.startTimer();  
    }
  },

  methods: {
    clickTile(tile) {
      socket.emit("memoryClick", tile);
    },

    startTimer() {
      if (!this.startTime) return;

      clearInterval(this.interval);

      this.interval = setInterval(() => {
        const duration = state.floor1?.duration || 3000;
        const remaining = Math.ceil((duration - (Date.now() - this.startTime)) / 1000);

        this.countdown = remaining > 0 ? remaining : 0;

        if (remaining <= 0) {
          clearInterval(this.interval);
        }
      }, 200);
    }
  },

  mounted() {
    this.startTimer();
  },

  beforeDestroy() {
    clearInterval(this.interval);
  }
});