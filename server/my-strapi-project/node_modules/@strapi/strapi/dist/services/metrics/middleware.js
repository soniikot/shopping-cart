"use strict";
const createMiddleware = ({ sendEvent }) => {
  const state = {
    currentDay: null,
    counter: 0
  };
  const middleware = async (ctx, next) => {
    const { url, method } = ctx.request;
    if (!url.includes(".") && ["GET", "PUT", "POST", "DELETE"].includes(method)) {
      const dayOfMonth = (/* @__PURE__ */ new Date()).getDate();
      if (dayOfMonth !== state.currentDay) {
        state.currentDay = dayOfMonth;
        state.counter = 0;
      }
      if (state.counter < 1e3) {
        sendEvent("didReceiveRequest", { eventProperties: { url: ctx.request.url } });
        state.counter += 1;
      }
    }
    await next();
  };
  return middleware;
};
module.exports = createMiddleware;
//# sourceMappingURL=middleware.js.map
