import users from "../data-source";
import findUser from "../utils/findUser";
import { v4 as uuid } from "uuid";

const createUserService = (body) => {
  let errors = {};
  let newUser = {};
  let response = {};

  if (typeof body != "object" || !body) {
    response["statusCode"] = 400;
    response["message"] = { message: "invalid body format" };
    return response;
  }

  const requiredFields = {
    nome: "string",
    email: "string",
    idade: "number",
  };

  for (let field in requiredFields) {
    if (typeof body[field] != requiredFields[field] || !body[field]) {
      errors[
        `Invalid_${field}`
      ] = `${field} is required to be a ${requiredFields[field]}`;
      response["statusCode"] = 400;
      response["message"] = errors;
    } else {
      newUser[field] = body[field];
    }
  }

  const verifyUserExists = findUser(newUser["email"], "block");
  if (verifyUserExists != null) {
    return verifyUserExists;
  }

  if (Object.keys(errors).length > 0) {
    response["statusCode"] = 400;
    response["message"] = {message: errors};
    return response;
  }

  if (newUser["idade"] < 18) {
    response["statusCode"] = 400;
    response["message"] = { message: "User must at least be 18 years old" };
    return response;
  }

  newUser["id"] = uuid();
  users.push(newUser);
  response["statusCode"] = 201;
  response["message"] = newUser;

  return response;
};

export default createUserService;
