const config = require("../../config/gameConfig");

class MapGenerator {
  constructor() {
    this.size = config.GRID_SIZE;
    let attempts = 0;

    do {
      this.grid = this.createGrid();
      this.generateBase();
      attempts++;
    } while (!this.isValid() && attempts < config.MAX_GENERATION_ATTEMPTS);

    if (attempts >= config.MAX_GENERATION_ATTEMPTS) {
      throw new Error("Map generation failed");
    }
  }

  createGrid() {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({ type: "EMPTY" }))
    );
  }

  generateBase() {
    const n = this.size;

    this.grid[n - 1][0].type = "LOGIC_STATION";
    this.grid[n - 1][n - 1].type = "DFA_STATION";

    this.carvePath(n - 1, 0);
    this.carvePath(n - 1, n - 1);

    this.placeRandom("PIT", config.PIT_MIN, config.PIT_MAX);
    this.placeRandom("WALL", config.WALL_MIN, config.WALL_MAX);
    this.placeRandom("WUMPUS", config.WUMPUS_COUNT, config.WUMPUS_COUNT);

    this.clearSpawn();
  }

  carvePath(tx, ty) {
    let x = 0, y = 0;

    while (x !== tx || y !== ty) {
      this.grid[x][y].type = "EMPTY";

      if (Math.random() < 0.5) {
        if (x < tx) x++;
        else if (y < ty) y++;
      } else {
        if (y < ty) y++;
        else if (x < tx) x++;
      }
    }
  }

  clearSpawn() {
    [[0,0],[0,1],[1,0]].forEach(([r,c]) => {
      if (this.grid[r] && this.grid[r][c]) {
        this.grid[r][c].type = "EMPTY";
      }
    });
  }

  placeRandom(type, min, max) {
    const count = min + Math.floor(Math.random() * (max - min + 1));
    let placed = 0;

    while (placed < count) {
      const r = Math.floor(Math.random() * this.size);
      const c = Math.floor(Math.random() * this.size);

      if (this.grid[r][c].type !== "EMPTY") continue;
      if (r === 0 && c === 0) continue;

      if (config.SAFE_ROW === r && (type === "PIT" || type === "WUMPUS")) continue;

      this.grid[r][c].type = type;
      placed++;
    }
  }

  isValid() {
    const visited = Array.from({ length: this.size }, () =>
      Array(this.size).fill(false)
    );

    const queue = [[0,0]];
    visited[0][0] = true;

    let foundLogic = false;
    let foundDFA = false;

    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    while (queue.length) {
      const [x,y] = queue.shift();

      const type = this.grid[x][y].type;

      if (type === "LOGIC_STATION") foundLogic = true;
      if (type === "DFA_STATION") foundDFA = true;

      for (let [dx,dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (!this.grid[nx] || !this.grid[nx][ny]) continue;
        if (visited[nx][ny]) continue;

        const t = this.grid[nx][ny].type;
        if (t === "WALL" || t === "PIT" || t === "WUMPUS") continue;

        visited[nx][ny] = true;
        queue.push([nx,ny]);
      }
    }

    return foundLogic && foundDFA;
  }

  getGrid() {
    return this.grid;
  }
}

module.exports = MapGenerator;