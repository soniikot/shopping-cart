"use strict";
const createDebugger = require("debug");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const createDebugger__default = /* @__PURE__ */ _interopDefault(createDebugger);
const debug = createDebugger__default.default("strapi:worker-queue");
const noop = () => {
};
class WorkerQueue {
  logger;
  worker;
  concurrency;
  running;
  queue;
  constructor({ logger, concurrency = 5 }) {
    debug("Initialize worker queue");
    this.logger = logger;
    this.worker = noop;
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  subscribe(worker) {
    debug("Subscribe to worker queue");
    this.worker = worker;
  }
  enqueue(payload) {
    debug("Enqueue event in worker queue");
    if (this.running < this.concurrency) {
      this.running += 1;
      this.execute(payload);
    } else {
      this.queue.unshift(payload);
    }
  }
  pop() {
    debug("Pop worker queue and execute");
    const payload = this.queue.pop();
    if (payload) {
      this.execute(payload);
    } else {
      this.running -= 1;
    }
  }
  async execute(payload) {
    debug("Execute worker");
    try {
      await this.worker(payload);
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.pop();
    }
  }
}
module.exports = WorkerQueue;
//# sourceMappingURL=worker-queue.js.map
