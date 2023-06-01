//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
require('dotenv').config()

const PORT = process.env.PORT;

const Koa = require('koa');
const Router = require('koa-router');

const koa = new Koa();
const router = new Router();
const listUsersRouter = require('./controllers/userController')

//rota simples pra testar se o servidor está online
router.get('/', async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; //http://localhost:3000/
});



koa
  .use(router.routes())
  .use(router.allowedMethods())
  .use(listUsersRouter.routes());

const server = koa.listen(PORT);

server.on('listening', () => {
  console.log(`Seu servidor esta rodando em http://localhost:${PORT}`)
})

module.exports = server;