class SignalEngine {
  static getSignals(grid, x, y, wumpusList) {
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    let breeze = false;
    let stench = false;

    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      if (!grid[nx] || !grid[nx][ny]) return;

      const type = grid[nx][ny].type;

      if (type === "PIT") breeze = true;
      if (wumpusList.some(w => w.x === nx && w.y === ny)) {
        stench = true;
      }
    });

    return { breeze, stench };
  }
}

module.exports = SignalEngine;