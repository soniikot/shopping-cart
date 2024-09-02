"use strict";
function stopProcess(message) {
  if (message) {
    console.error(message);
  }
  process.exit(1);
}
module.exports = stopProcess;
//# sourceMappingURL=stop-process.js.map
