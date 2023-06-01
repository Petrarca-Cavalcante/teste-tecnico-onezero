const Router = require("koa-router");

const listUsersRouter = new Router()

listUsersRouter.get("/users", async (ctx) => {
  ctx.status = 200;
  ctx.body = { total: 0, count: 0, rows: [] };
});


module.exports = listUsersRouter