const config = require("../../config/gameConfig");

class Floor1_MemoryGrid {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.reset(this.onUpdate);
    this.duration = config.FLOOR1_TIMER;
  }

  reset(onUpdate) {
    this.size = Math.floor(Math.random() * 3) + 8;
    this.tiles = this.shuffle([...Array(this.size).keys()].map(x => x + 1));

    this.currentIndex = 0;
    this.showNumbers = true;

    this.startTime = Date.now();

    setTimeout(() => {
        this.showNumbers = false;

        if (onUpdate) onUpdate(); 
    }, this.duration);
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  handleClick(value) {
    const expected = this.currentIndex + 1;

    if (value === expected) {
      this.currentIndex++;

      if (this.currentIndex === this.size) {
        return { status: "complete" };
      }

      return { status: "correct" };
    } else {
      this.reset();
      return { status: "reset" };
    }
  }

  getState() {
    return {
      tiles: this.tiles,
      showNumbers: this.showNumbers,
      size: this.size,
      startTime: this.startTime,
      duration: this.duration 
    };
  }
}

module.exports = Floor1_MemoryGrid;