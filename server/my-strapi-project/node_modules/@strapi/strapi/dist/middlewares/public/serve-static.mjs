import path from "path";
import koaStatic from "koa-static";
const serveStatic = (filesDir, koaStaticOptions = {}) => {
  const serve = koaStatic(filesDir, koaStaticOptions);
  const middleware = async (ctx, next) => {
    const prev = ctx.path;
    const newPath = path.basename(ctx.path);
    ctx.path = newPath;
    await serve(ctx, async () => {
      ctx.path = prev;
      await next();
      ctx.path = newPath;
    });
    ctx.path = prev;
  };
  return middleware;
};
export {
  serveStatic
};
//# sourceMappingURL=serve-static.mjs.map
