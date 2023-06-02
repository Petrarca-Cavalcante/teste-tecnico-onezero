import Router from "koa-router";
import findUser from "../utils/findUser";

const retrieveUserRouter = new Router();
retrieveUserRouter.get("/user/:id", async (ctx) => {
  const { id } = ctx.params;
  const user = findUser(id, "find", "id");
  ctx.status = user.statusCode;
  ctx.body = user.message;
});

export default retrieveUserRouter;
