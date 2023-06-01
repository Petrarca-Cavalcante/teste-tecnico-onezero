import Router from "koa-router";
import listUsersService from "../services/listUsers";


const listUsersRouter = new Router()

listUsersRouter.get("/users", async (ctx) => {
  const {page} = ctx.query
  const response = listUsersService(page)
  console.log(response)
  ctx.status = 200;
  ctx.body = { total: response.totalUsers, page: response.currentPage, pageCount: response.totalPages, rows: [response.users] };
});



export default listUsersRouter