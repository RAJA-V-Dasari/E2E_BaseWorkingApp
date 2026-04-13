const MapGenerator = require("./MapGenerator");
const SignalEngine = require("./SignalEngine");
const config = require("../../config/gameConfig");

class Round2Engine {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;

    this.map = new MapGenerator();
    this.grid = this.map.getGrid();

    this.player = {
      x: 0,
      y: 0,
      arrows: config.ARROWS,
      alive: true,
      lives: config.PLAYER_LIVES
    };

    this.wumpus = [];
    this.extractWumpus();
    this.startLoop();
  }

  extractWumpus() {
    this.original = [];

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j].type === "WUMPUS") {
          const pos = { x: i, y: j };
          this.wumpus.push(pos);
          this.original.push({ ...pos });
          this.grid[i][j].type = "EMPTY";
        }
      }
    }
  }

  move(dir) {
    if (!this.player.alive) return;

    const map = {
      UP: [-1,0],
      DOWN: [1,0],
      LEFT: [0,-1],
      RIGHT: [0,1]
    };

    if (!map[dir]) return;

    const [dx,dy] = map[dir];
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;

    if (!this.grid[nx] || !this.grid[nx][ny]) return;
    if (this.grid[nx][ny].type === "WALL") return;

    this.player.x = nx;
    this.player.y = ny;

    this.resolve();
  }

  resolve() {
    const cell = this.grid[this.player.x][this.player.y];

    if (cell.type === "PIT") {
      this.die("Fell into pit");
    }

    if (this.wumpus.some(w => w.x === this.player.x && w.y === this.player.y)) {
      this.die("Killed by Wumpus");
    }

    if (this.player.x === 0 && this.player.y === 0) {
      this.player.arrows = config.ARROWS;
      this.lastRefill = true;
    } else {
      this.lastRefill = false;
    }
  }

  die(reason) {
    if (!this.player.alive) return;

    this.player.alive = false;
    this.player.lives--;
    this.player.deathReason = reason;

    if (this.player.lives <= 0) {
      setTimeout(() => this.fullReset(), 2000);
    }
  }

  fullReset() {
    this.player = {
      x: 0,
      y: 0,
      arrows: config.ARROWS,
      alive: true,
      lives: config.PLAYER_LIVES
    };

    this.wumpus = this.original.map(w => ({...w}));
  }

  resetPlayer() {
    this.player.x = 0;
    this.player.y = 0;
    this.player.alive = true;
    this.player.arrows = config.ARROWS;
  }

  shoot(dir) {
    if (!this.player.alive) return;
    if (this.player.arrows <= 0) return;

    this.player.arrows--;

    const map = {
      UP: [-1,0],
      DOWN: [1,0],
      LEFT: [0,-1],
      RIGHT: [0,1]
    };

    const [dx,dy] = map[dir];

    let x = this.player.x;
    let y = this.player.y;

    while (true) {
      x += dx;
      y += dy;

      if (!this.grid[x] || !this.grid[x][y]) break;
      if (this.grid[x][y].type === "WALL") break;

      const hit = this.wumpus.findIndex(w => w.x === x && w.y === y);

      if (hit !== -1) {
        this.wumpus.splice(hit,1);
        this.lastShotResult = "HIT";
        return;
      }
    }

    this.lastShotResult = "MISS";
  }

  startLoop() {
    this.loop = setInterval(() => {
      this.moveWumpus();
      this.onUpdate && this.onUpdate();
    }, config.WUMPUS_MOVE_INTERVAL);
  }

  moveWumpus() {
    this.wumpus.forEach(w => {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
      const move = dirs[Math.floor(Math.random()*dirs.length)];

      const nx = w.x + move[0];
      const ny = w.y + move[1];

      if (!this.grid[nx] || !this.grid[nx][ny]) return;
      if (this.grid[nx][ny].type === "WALL" || this.grid[nx][ny].type === "PIT") return;

      w.x = nx;
      w.y = ny;

      if (w.x === this.player.x && w.y === this.player.y) {
        this.die("Killed by Wumpus");
      }
    });
  }

  getState(role) {
    return {
      player: this.player,
      signals: SignalEngine.getSignals(this.grid, this.player.x, this.player.y, this.wumpus),
      grid: role === "past" ? this.grid : null,
      lastShotResult: this.lastShotResult,
      lastRefill: this.lastRefill
    };
  }
}

module.exports = Round2Engine;