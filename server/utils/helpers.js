function generateCode() {
  const letter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const digit = () => Math.floor(Math.random() * 10);

  return `${letter()}${digit()}${digit()}${letter()}`;
}

function randomNoiseLog() {
  const templates = [
    "System execution has failed and validation has failed for {code}",
    "System execution has been successful but validation has failed for {code}",
    "System execution has failed but validation has passed for {code}",
    "System execution has been successful and validation has failed for {code}"
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace("{code}", generateCode());
}

function generateLogs(correctLog, count) {
  const logs = [];

  // generate all noise first
  for (let i = 0; i < count; i++) {
    logs.push(randomNoiseLog());
  }

  // pick index in later half
  const minIndex = Math.floor(count * 0.5);
  const maxIndex = Math.floor(count * 0.9);

  const insertIndex =
    Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

  logs[insertIndex] = correctLog;

  return logs;
}

function splitLogSegments(log) {
  const words = log.split(" ");

  // Decide split points
  const splitPoints = [];

  if (words.length > 8) {
    splitPoints.push(Math.floor(words.length / 3));
    splitPoints.push(Math.floor((2 * words.length) / 3));
  } else {
    splitPoints.push(Math.floor(words.length / 2));
  }

  let segments = [];
  let prev = 0;

  splitPoints.forEach(point => {
    segments.push(words.slice(prev, point).join(" "));
    prev = point;
  });

  segments.push(words.slice(prev).join(" "));

  let past = [];
  let future = [];

  let assignedToPast = false;
  let assignedToFuture = false;

  segments.forEach(seg => {
    const toPast = Math.random() < 0.5;

    if (toPast) {
      past.push(seg);
      future.push("-".repeat(seg.length));
      assignedToPast = true;
    } else {
      past.push("-".repeat(seg.length));
      future.push(seg);
      assignedToFuture = true;
    }
  });

  if (!assignedToPast || !assignedToFuture) {
    return splitLogSegments(log); // regenerate safely
  }

  return {
    past: past.join(" "),
    future: future.join(" ")
  };
}

function splitLogs(logs) {
  const past = [];
  const future = [];

  logs.forEach(log => {
    const split = splitLogSegments(log);
    past.push(split.past);
    future.push(split.future);
  });

  return { past, future };
}

module.exports = {
  generateCode,
  generateLogs,
  splitLogs
};