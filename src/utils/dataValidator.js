const updateValidator = (data, userToModify) => {
  delete data["id"];
  let errors = {};
  let changes = {};
  let response = {};

  const requiredFields = {
    nome: "string",
    email: "string",
    idade: "number",
  };

  for (let key in userToModify) {
    if (!(key in data)) {
      data[key] = userToModify[key];
    }
  }

  for (let field in requiredFields) {
    if (typeof data[field] != requiredFields[field] || !data[field]) {
      errors[
        `Invalid_${field}`
      ] = `${field} is required to be a ${requiredFields[field]} `;
      response["statusCode"] = 400;
      response["message"] = errors;
    } else {
      changes[field] = data[field];
    }
  }
  changes["id"] = userToModify["id"];
  return { changes, response };
};

export default updateValidator;
