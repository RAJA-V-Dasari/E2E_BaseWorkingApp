Vue.component("lobby-screen", {
  template: `
    <div>
      <h2>Choose Role</h2>
      <button @click="join('past')">Past Player</button>
      <button @click="join('future')">Future Player</button>
    </div>
  `,
  methods: {
    join(role) {
      socket.emit("joinGame", role);
    }
  }
});