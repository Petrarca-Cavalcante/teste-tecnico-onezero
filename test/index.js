//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

import { server } from "../src/index.js";
const app = server;

const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiJson = require("chai-json-schema");

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
  title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
  type: "object",
  required: ["nome", "email", "idade"],
  properties: {
    id: {
      type: "string",
    },
    nome: {
      type: "string",
    },
    email: {
      type: "string",
    },
    idade: {
      type: "number",
      minimum: 18,
    },
  },
};

//A Api agora gera um id para cada usuário, logo, é necessário armazenar o id gerado para o Raupp para os outros testes
let idDoRaupp = 0;


//testes da aplicação
describe("Testes da aplicaçao", () => {
  it("o servidor esta online", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("Retorna uma lista vazia de usuarios", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
      });
  });

  it("Cria o usuario raupp e outros 6 usuários", (done) => {
    const usuarios = [
      { nome: "Junji Ito", email: "junjiito@gmail.com", idade: 59 },
      { nome: "Scott Pilgrim", email: "scottpilgrim@hotmail.com", idade: 23 },
      { nome: "Carlos", email: "carlos@gmail.com", idade: 22 },
      { nome: "Davi", email: "davi@gmail.com", idade: 22 },
      { nome: "Lee", email: "lee@gmail.com", idade: 19 },
      { nome: "Guts", email: "guts@griffith.com", idade: 24 },
      { nome: "Raupp", email: "jose.raupp@devoz.com.br", idade: 35 },
    ];
    for (let usuario of usuarios) {
      chai
        .request(app)
        .post("/user")
        .send(usuario)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.jsonSchema(userSchema);
          expect(res.body).to.deep.include({
            nome: usuario["nome"],
            email: usuario["email"],
            idade: usuario["idade"],
          });
          if (res.body.nome === "Raupp") {
            idDoRaupp = res.body.id;
          }
        });
    }
    done();
  });

  it("Impede criação de usuário sem envio de body", (done) => {
    chai
      .request(app)
      .post("/user")
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.equal("invalid body format");
        done();
      });
  });

  it("Impede criação de usuário com email já existente", (done) => {
    const repeatedEmailUser = {
      nome: "Billy Butcher",
      email: "jose.raupp@devoz.com.br",
      idade: 34,
      chaveExtra: "deve ser ignorada",
    };

    chai
      .request(app)
      .post(`/user`)
      .send(repeatedEmailUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.equal(
          "This email has already been used"
        );
        done();
      });
  });

  it("Impede criação de usuário com menos de 18 anos", (done) => {
    const usuario = { nome: "Léo", email: "leo@gmail.com", idade: 17 };
    chai
      .request(app)
      .post("/user")
      .send(usuario)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("User must at least be 18 years old");
        done();
      });
  });

  it("Impede criação de usuário sem dados requeridos", (done) => {
    const usuario = { nome: "Léo", email: "leo@gmail.com", idade: 18 };
    const errors = [
      { Invalid_nome: "nome is required to be a string" },
      { Invalid_email: "email is required to be a string" },
      { Invalid_idade: "idade is required to be a number" },
    ];
    let missingData = { email: usuario.email, idade: usuario.idade };
    chai
      .request(app)
      .post("/user")
      .send(missingData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.deep.equal(errors[0]);
      });
    missingData = { nome: usuario.nome, idade: usuario.idade };
    chai
      .request(app)
      .post("/user")
      .send(missingData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.deep.equal(errors[1]);
      });
    missingData = { nome: usuario.nome, email: usuario.email };
    chai
      .request(app)
      .post("/user")
      .send(missingData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.deep.equal(errors[2]);
      });

    done();
  });

  it("Retorna usuário por ID (Raupp)", (done) => {
    chai
      .request(app)
      .get(`/user/${idDoRaupp}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        done();
      });
  });

  // Agora os usuários são manipulados por um id gerado por uuid, portanto, para não encontrar um usuário basta escrever qualquer coisa que não seja um uuid válido
  it("Retorna error 404 para usuario que nao existe no sistema", (done) => {
    chai
      .request(app)
      .get("/user/68bedf32-99fd-444c-808e-570242378df8")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("User not found");
        done();
      });
  });

  it("Atualiza o usuario por ID (Raupp)", (done) => {
    const raupChanges = {
      nome: "Raupp",
      email: "jose.raupp@devoz.com",
      idade: 34,
      chaveExtra: "deve ser ignorada",
    };

    chai
      .request(app)
      .patch(`/user/${idDoRaupp}`)
      .send(raupChanges)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(202);
        expect(res.body).to.be.jsonSchema(userSchema);
        expect(res.body).to.deep.include({
          nome: raupChanges["nome"],
          email: raupChanges["email"],
          idade: raupChanges["idade"],
        });
        done();
      });
  });

  it("Impede atualização de usuário sem envio de body", (done) => {
    chai
      .request(app)
      .patch(`/user/${idDoRaupp}`)
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.equal("invalid body format");
        done();
      });
  });

  it("Impede usuário de atualizar prórpio email para outro que já seja usado", (done) => {
    // email anterior era jose.raupp@devoz.com
    const raupChanges = {
      nome: "Raupp",
      email: "lee@gmail.com",
      idade: 34,
      chaveExtra: "deve ser ignorada",
    };

    chai
      .request(app)
      .patch(`/user/${idDoRaupp}`)
      .send(raupChanges)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("This email has already been used");
        done();
      });
  });

  it("Retorna error 404 ao tentar atualizar usuário inexistente", (done) => {
    const raupChanges = {
      nome: "Raupp",
      email: "jose.raupp@devoz.com",
      idade: 34,
      chaveExtra: "deve ser ignorada",
    };
    chai
      .request(app)
      .patch(`/user/${idDoRaupp}1`)
      .send(raupChanges)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("User not found");
        done();
      });
  });

  it("Deleta usuário por ID (Raupp)", (done) => {
    chai
      .request(app)
      .delete(`/user/${idDoRaupp}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        expect(res.body).to.be.empty;
        done();
      });
  });

  it("Retorna error 404 ao tentar deletar usuário que não existe (Raupp)", (done) => {
    chai
      .request(app)
      .get(`/user/${idDoRaupp}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("User not found");
        done();
      });
  });

  it("Há uma lista com pelomenos 5 usuarios", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.total).to.be.at.least(5);
        done();
      });
  });

  it("Devem haver duas páginas. A paginação deve ser feita a cada 5 usuários ", (done) => {
    chai
      .request(app)
      .get("/users/?page=1")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.total).to.be.at.least(5);
        expect(res.body.pageCount).to.be.at.least(2);
        done();
      });
  });
});
