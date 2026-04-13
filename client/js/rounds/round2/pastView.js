Vue.component("past-view", {
  template: `
    <div>
      <h3>Map View (Past)</h3>

      <div v-if="grid">
        <div v-for="(row, i) in grid" :key="i" style="display:flex;">
          <div
            v-for="(cell, j) in row"
            :key="j"
            style="width:25px;height:25px;border:1px solid #ccc;text-align:center;"
          >
            {{ cellSymbol(cell.type) }}
          </div>
        </div>
      </div>
      
      <h4>Legend</h4>
      <p>P = Pit (Danger)</p>
      <p>W = Wall (Blocked)</p>
      <p>L = Logic Station</p>
      <p>D = DFA Station</p>
      <p>. = Empty</p>

      <p>⚠️ Hint: Arrow refill station is at (0,0)</p>
    </div>
  `,
  computed: {
    grid() {
      return state.round2?.grid;
    }
  },
  methods: {
    cellSymbol(type) {
      switch(type) {
        case "PIT": return "P";
        case "WALL": return "W";
        case "LOGIC_STATION": return "L";
        case "DFA_STATION": return "D";
        default: return ".";
      }
    }
  }
});