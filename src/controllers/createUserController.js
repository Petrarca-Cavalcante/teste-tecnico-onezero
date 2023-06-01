import Router from 'koa-router';
import createUserService from '../services/createUser';

const createUserRouter = new Router()

createUserRouter.post("/user", (ctx) => {
    const serializer = createUserService(ctx.request.body)
    ctx.status = serializer.statusCode;
    ctx.body = {"message": serializer.message};
})

export default createUserRouter