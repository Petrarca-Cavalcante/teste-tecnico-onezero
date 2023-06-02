import users from "../data-source";
import validator from "../utils/dataValidator";

const updateUser = (data, id) => {
  let response = {};
  const userToModify = users.find((user) => user.id === id);
  if (!userToModify) {
    response["statusCode"] = 404;
    response["message"] = "User not found";
    return response;
  }
  const validatedData = validator(data, userToModify);

  if (validatedData.response.statusCode === 400) {
    return validatedData.response;
  }

  const index = users.findIndex((user) => user.id === id);

  users.splice(index, 1, validatedData.changes);
  response["statusCode"] = 202
  response["message"] = validatedData.changes
  return response;
};

export default updateUser;
