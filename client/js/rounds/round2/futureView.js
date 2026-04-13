Vue.component("future-view", {
  template: `
    <div>
      <div v-if="!player.alive">
        <h2>💀 Wasted</h2>
        <p>{{ player.deathReason }}</p>
        <button @click="respawn">Respawn</button>
      </div>
      <div v-else>
        <h3>Field Agent</h3>

        <p>Signals:</p>
        <p v-if="signals.breeze">🌬️ Breeze</p>
        <p v-if="signals.stench">💀 Stench</p>
        <p v-if="!signals.breeze && !signals.stench">None</p>

        <hr>

        <div>
          <button @click="move('UP')">UP</button><br>
          <button @click="move('LEFT')">LEFT</button>
          <button @click="move('DOWN')">DOWN</button>
          <button @click="move('RIGHT')">RIGHT</button>
        </div>

        <hr>

        <div>
          <button @click="shoot('UP')">Shoot UP</button>
          <button @click="shoot('DOWN')">Shoot DOWN</button>
          <button @click="shoot('LEFT')">Shoot LEFT</button>
          <button @click="shoot('RIGHT')">Shoot RIGHT</button>
        </div>

        <p>Arrows: {{ player.arrows }}</p>
        <p v-if="refill">🔋 Arrows Refilled!</p>
        <p v-if="lastShot">
          🎯 Shot Result: {{ lastShot }}
        </p>
      </div>
    </div>
  `,
  computed: {
    signals() {
      return state.round2?.signals || {};
    },
    player() {
      return state.round2?.player || {};
    },
    lastShot() {
      return state.round2?.lastShotResult;
    },
    refill() {
      return state.round2?.lastRefill;
    }
  },
  methods: {
    move(dir) {
      socket.emit("round2Move", dir);
    },
    shoot(dir) {
      socket.emit("round2Shoot", dir);
    },
    respawn() {
      socket.emit("round2Respawn");
    }
  }
});