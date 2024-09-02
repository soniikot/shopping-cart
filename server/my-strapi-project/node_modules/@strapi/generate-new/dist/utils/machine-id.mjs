import { randomUUID } from "crypto";
import { machineIdSync } from "node-machine-id";
const machineID = () => {
  try {
    const deviceId = machineIdSync();
    return deviceId;
  } catch (error) {
    const deviceId = randomUUID();
    return deviceId;
  }
};
export {
  machineID as default
};
//# sourceMappingURL=machine-id.mjs.map
