import { randomUUID } from "crypto";
import { machineIdSync } from "node-machine-id";
const machineId = () => {
  try {
    const deviceId = machineIdSync();
    return deviceId;
  } catch (error) {
    const deviceId = randomUUID();
    return deviceId;
  }
};
export {
  machineId as default
};
//# sourceMappingURL=machine-id.mjs.map
