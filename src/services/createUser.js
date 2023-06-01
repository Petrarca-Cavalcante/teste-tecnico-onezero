import users from "../data-source";
import findUser from "../utils/findUser";

const createUserService = (body) => {
  if (typeof body != "object") {
    return { InvalidBody: "invalid body format" };
  }

  let errors = {};
  let newUser = {};
  let response = {};

  const requiredFields = {
    nome: "string",
    email: "string",
    idade: "number",
  };

  for (let field in requiredFields) {
    if (typeof body[field] != requiredFields[field] || !body[field]) {
      errors[
        `Invalid_${field}`
      ] = `${field} is required to be a ${requiredFields[field]} `;
      response["statusCode"] = 400;
      response["message"] = errors;
    } else {
      newUser[field] = body[field];
    }
  }

  const verifyUserExists = findUser(newUser["nome"], "block");
  if (verifyUserExists != null) {
    return verifyUserExists;
  }

  if (Object.keys(errors).length > 0) {
    response["statusCode"] = 400;
    response["message"] = errors;
    return response;
  }

  if (newUser["idade"] < 18) {
    response["statusCode"] = 400;
    response["message"] = "User must at least be 18 years old";
    return response;
  }

  users.push(newUser);
  response["statusCode"] = 201;
  response["message"] = newUser;

  return response;
};

export default createUserService;
