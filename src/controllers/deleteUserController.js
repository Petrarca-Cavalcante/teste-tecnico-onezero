import Router from "koa-router";
import deleteUserService from "../services/deleteUser";

const deleteUserRouter = new Router();

deleteUserRouter.delete("/user/:id", (ctx) => {
  const { id } = ctx.params;
  const response = deleteUserService(id);

  ctx.status = response.statusCode;
  if(response.message){
    ctx.body = {message: response.message}
  }
});

export default deleteUserRouter;
