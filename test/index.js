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

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe("Um simples conjunto de testes", () => {
  it("deveria retornar -1 quando o valor não esta presente", () => {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

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
      { nome: "Andressa", email: "andressa@gmail.com", idade: 23 },
      { nome: "Bianca", email: "bianca@gmail.com", idade: 21 },
      { nome: "Carlos", email: "carlos@gmail.com", idade: 22 },
      { nome: "Davi", email: "davi@gmail.com", idade: 22 },
      { nome: "Lee", email: "lee@gmail.com", idade: 19 },
      { nome: "Lucas", email: "lucas@gmail.com", idade: 28 },
      { nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35 },
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
          if (res.body.nome === "raupp") {
            idDoRaupp = res.body.id;
          }

        });
    }
    done();
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

  // Agora os usuários são manipulados por um id gerado por uuid, portanto, para não encontrar um usuário basta escrever qualquer coisa que não seja um uuid válido
  it("Retorna error 404 para usuario nao existe não existe no sistema", (done) => {
    chai
      .request(app)
      .get("/user/naoExiste")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("User not found");
        done();
      });
  });

  it("O usuario raupp existe e é valido", (done) => {
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

  it("Atualiza o usuario raupp", (done) => {
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

  it("Error 404 ao tentar atualizar usuário inexistente", (done) => {
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

  it("Exclui o usuario raupp", (done) => {
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

  it("Usuario raupp não existe mais no sistema", (done) => {
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
