const { generateCode, generateLogs, splitLogs } = require("../../utils/helpers");
const config = require("../../config/gameConfig");


class Floor2_LogPuzzle {
  constructor() {
    this.generate();
  }

  generate() {
    this.code = generateCode();

    const correctLog =
      `System execution has been successful and validation has passed for ${this.code}`;

    const logs = generateLogs(correctLog, config.FLOOR2_LOG_COUNT);

    const split = splitLogs(logs);

    this.logsPast = split.past;
    this.logsFuture = split.future;
  }

  submit(answer) {
    if (!/^[A-Z][0-9][0-9][A-Z]$/.test(answer)) {
      return { status: "invalid" };
    }

    if (answer === this.code) {
      return { status: "correct" };
    }

    return { status: "wrong" };
  }

  getState() {
    return {
      logsPast: this.logsPast,
      logsFuture: this.logsFuture
    };
  }
}

module.exports = Floor2_LogPuzzle;