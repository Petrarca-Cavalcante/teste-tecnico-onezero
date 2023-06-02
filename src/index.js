//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
import "dotenv/config";
import Koa from "koa";
import Router from "koa-router";
import routes from "./controllers/index";
import koaBody from "koa-body";

const PORT = process.env.PORT;

const koa = new Koa();
const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; //http://localhost:3000/
});

koa
  .use(koaBody())
  .use(router.routes())
  .use(routes.list.routes())
  .use(routes.create.routes())
  .use(routes.update.routes())
  .use(routes.delete.routes())
  .use(router.allowedMethods());

const server = koa.listen(PORT);

server.on("listening", () => {
  console.log(`Seu servidor esta rodando em http://localhost:${PORT}`);
});

export { router, server };
