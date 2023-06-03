# Apresentação        		
---
#### O projeto API desenvolvida em Node.js com Koa.js tem como objetivo gerenciar usuários, oferecendo operações completas de criação, leitura, atualização e exclusão. O Koa js é um framework minimalista e eficiente para o desenvolvimento de aplicações web. Com essa tecnologia, a API possui uma arquitetura modular e baseada em middlewares, o que facilita a organização e a flexibilidade do código.  Através dessa API, é possível gerenciar os usuários de forma simples e automatizada.
---
### 1 Tecnologias usadas:
- NodeJs
- KoaJs
- Mocha
- Chai
- uuid
- nodemon
- sucrase

### 2.1 Instalando Dependências

Clone o projeto em sua máquina e instale as dependências com o comando:

````
npm install

````

### 2.2 Variáveis de Ambiente

Em seguida, crie um arquivo **.env**, copiando o formato do arquivo **.env.example**:
```
cp .env.example .env
```
Configure suas variáveis de ambiente( por enquanto apenas há a configuração de PORT)

## 3. Endpoints

### Índice

- [User]   
  -[ POST - /user ]   
  -[ GET - /users ]    
      -[ GET -/user/:user_id ]   
  -[ PATCH -/user/:iuser_idd ]   
  -[ DELETE - /user/:user_id ] 
  
  ---
  
  ## 4. **Características do usuário**


| Campo      | Tipo   | Descrição                                       |
| -----------|--------|-------------------------------------------------|
| id         | string | Identificador único do usuário                  |
| nome       | string | O nome do usuário.                              |
| email      | string | O e-mail único do usuário.                      |
| idade      | number | A idade do usuario                              |

---

### Endpoints

| Método   | Rota       | Descrição                                             |
|----------|------------|-------------------------------------------------------|
| POST     | /user            | Criação de um usuário.                          |
| GET      | /users           | Lista 5 usuários por página                     |
| GET      | /user/:user_id   | Lista um usuário usando seu ID como parâmetro   |
| PATCH    | /user/:user_id   | Atualiza um usuário usando seu ID como parâmetro|
| DELETE   | /user/:user_id   | Deleta o usuário usando seu ID como parâmetro   |

---

### 1 **Criação de Usuário**

### `/users`

### Exemplo de Request:
```
POST /user
Host: localhost:3000
Authorization: None
Content-type: application/json
```

### Corpo da Requisição:
```json
{
	"nome": "André",
	"idade": 18,
	"email": "andre@mail.com"
}
```

### Validação:
```javascript
nome: string,
email: string,
idade: number
```
OBS.: Chaves não presentes no schema serão removidas.

### Exemplo de Response:
```
201 Created
```

```json
{
	"id": "9cda28c9-e540-4b2c-bf0c-c90006d37893",
	"nome": "André",
	"idade": 18,
	"email": "andre@mail.com"
}
```

### Possíveis Erros:
| Código do Erro | Descrição |
|----------------|-----------|
| 400 BAD REQUEST| "message": "This email has already been used" |

---

### 2 **Listando Usuários**

### `/users`

### Exemplo de Request:
```
GET /users
Host: localhost:3000
Authorization: None
Content-type: application/json
```

### Corpo da Requisição:
```json
Vazio
```

### Exemplo de Response:
```
200 OK
```
```json
{
	"total": 1,
	"page": 1,
	"pageCount": 1,
	"rows": [
		{
			"nome": "André",
			"email": "andre@mail.com",
			"idade": 18,
			"id": "6f278d88-c7bb-4993-851b-2fff06f18815"
		}
	]
}
```

### Possíveis Erros:
Nenhum, o máximo que pode acontecer é a lista "rows" estar vazia.

---

### 2.1 **Listando Um Usuário**

### `/user/:id_do_usuário`

### Exemplo de Request:
```
GET /user/6f278d88-c7bb-4993-851b-2fff06f18815
Host: localhost:3000
Authorization: None
Content-type: application/json
```

### Corpo da Requisição:
```json
Vazio
```

### Exemplo de Response:
```
200 OK
```
```json
{
			"nome": "André",
			"email": "andre@mail.com",
			"idade": 18,
			"id": "6f278d88-c7bb-4993-851b-2fff06f18815"
}
```

### Possíveis Erros:
| Código do Erro | Descrição |
|----------------|-----------|
| 404 NOT FOUND  | "message": "User not found" |

---

### 3 **Atualização de Usuário**

### `/user/:id_do_usuário`

### Exemplo de Request:
```
POST /user/6f278d88-c7bb-4993-851b-2fff06f18815
Host: localhost:3000
Authorization: None
Content-type: application/json
```

### Corpo da Requisição:
```json
{
	"nome": "Sandro"
}
```

### Validação:
```javascript

nome: string.opcional,
email: string.opcional,
idade: number.opcional

```
OBS.: Chaves não presentes no schema serão removidas.
OBS.: Caso body seja enviado vazio, os campos já registrados serão retornados na response

### Exemplo de Response:
```
202 Accepted
```

```json
{
	"id": "9cda28c9-e540-4b2c-bf0c-c90006d37893",
	"nome": "Sandro",
	"idade": 18,
	"email": "andre@mail.com"
}
```

### Possíveis Erros:
| Código do Erro | Descrição |
|----------------|-----------|
| 400 BAD REQUEST| "message": "This email has already been used" |

---

### 4 **Deletando Um Usuário**

### `/user/:id_do_usuário`

### Exemplo de Request:
```
GET /user/6f278d88-c7bb-4993-851b-2fff06f18815
Host: localhost:3000
Authorization: None
Content-type: application/json
```

### Corpo da Requisição:
```json
Vazio
```

### Exemplo de Response:
```
204 NO CONTENT
```
```json
NO BODY
```

### Possíveis Erros:
| Código do Erro | Descrição |
|----------------|-----------|
| 404 NOT FOUND  | "message": "User not found" |

---
