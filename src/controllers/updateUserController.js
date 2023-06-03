import Router from "koa-router";
import updateUserService from "../services/updateUser";

const updateUserRouter = new Router();
updateUserRouter.patch("/user/:id", async (ctx) => {
  const { id } = ctx.params;
  const serializer = updateUserService(ctx.request.body, id);
  ctx.status = serializer.statusCode;
  ctx.body = serializer.message;
});

export default updateUserRouter;
