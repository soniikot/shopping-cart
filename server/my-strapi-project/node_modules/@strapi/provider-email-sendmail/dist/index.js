"use strict";
const sendmailFactory = require("sendmail");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const sendmailFactory__default = /* @__PURE__ */ _interopDefault(sendmailFactory);
const index = {
  init(providerOptions, settings) {
    const sendmail = sendmailFactory__default.default({
      silent: true,
      ...providerOptions
    });
    return {
      send(options) {
        return new Promise((resolve, reject) => {
          const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
          const msg = {
            from: from || settings.defaultFrom,
            to,
            cc,
            bcc,
            replyTo: replyTo || settings.defaultReplyTo,
            subject,
            text,
            html,
            ...rest
          };
          sendmail(msg, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
