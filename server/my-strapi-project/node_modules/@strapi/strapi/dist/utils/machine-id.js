"use strict";
const crypto = require("crypto");
const nodeMachineId = require("node-machine-id");
const machineID = () => {
  try {
    const deviceId = nodeMachineId.machineIdSync();
    return deviceId;
  } catch (error) {
    const deviceId = crypto.randomUUID();
    return deviceId;
  }
};
module.exports = machineID;
//# sourceMappingURL=machine-id.js.map
