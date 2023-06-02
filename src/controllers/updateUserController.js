import Router from "koa-router";
import updateUser from "../services/updateUser";

const updateUserRouter = new Router();
updateUserRouter.patch("/user/:id", async (ctx) => {
  const { id } = ctx.params;
  const serializer = updateUser(ctx.request.body, id);
  ctx.status = serializer.statusCode;
  ctx.body = serializer.message;
});

export default updateUserRouter;
