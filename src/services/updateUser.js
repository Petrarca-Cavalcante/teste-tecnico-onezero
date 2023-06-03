import users from "../data-source";
import validator from "../utils/dataValidator";

const updateUserService = (data, id) => {
  let response = {};

  if (typeof data != "object") {
    response["statusCode"] = 400;
    response["message"] = { message: "Type of body is invalid" };
    return response;
  }
  const userToModify = users.find((user) => user.id === id);
  const emailVerify = users.find((user) => user.email === data.email);

  if (!userToModify) {
    response["statusCode"] = 404;
    response["message"] = { message: "User not found" };
    return response;
  }
  
  if (emailVerify && emailVerify.id != id) {
    response["statusCode"] = 400;
    response["message"] = { message: "This email has already been used" };
    return response;
  }

  const validatedData = validator(data, userToModify);

  if (validatedData.response.statusCode === 400) {
    return validatedData.response;
  }

  const userIndex = users.findIndex((user) => user.id === id);

  users.splice(userIndex, 1, validatedData.changes);
  response["statusCode"] = 202;
  response["message"] = validatedData.changes;
  return response;
};

export default updateUserService;
