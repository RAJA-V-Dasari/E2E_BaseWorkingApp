class Floor3_NumberWordle {
  constructor() {
    this.generate();
    this.locked = false;
  }

  generate() {
    // ensure at least 2 unique digits
    while (true) {
      const code = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 10)
      );

      const unique = new Set(code);
      if (unique.size >= 2) {
        this.code = code.join("");
        console.log(this.code); //DEBUG RREMOVE IN FINAL DEPLOYMENT
        break;
      }

      console.log(this.code);//DEBUG REMOVE IN FINAL DEPLOYMENT
    }
  }

  submit(guess) {
    if (this.locked) {
        return { status: "locked" };
    }

    if (!/^[0-9]{4}$/.test(guess)) {
        return { status: "invalid" };
    }

    if (guess === this.code) {
        return { status: "correct" };
    }

    let A = 0, B = 0;

    for (let i = 0; i < 4; i++) {
        if (this.code[i] === guess[i]) B++;
        if (this.code.includes(guess[i])) A++;
    }

    this.locked = true; 

    return { status: "wrong", A, B };
    }

  getState() {
    return {
      lastFeedback: this.lastFeedback || null,
      locked: this.locked
    };
  }

  setFeedback(feedback) {
    this.lastFeedback = feedback;
  }
}

module.exports = Floor3_NumberWordle;