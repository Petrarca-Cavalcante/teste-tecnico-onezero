import users from "../data-source";

const findUser = (userToFind, mode) => {
  let response = {};
  const userFound = users.find((user) => user.email === userToFind);
  if (mode === "block" && userFound) {
    response["statusCode"] = 400;
    response["message"] = "This email has already been used";
    return response;
  } else if (mode === "find" && !userFound) {
    response["statusCode"] = 404;
    response["message"] = "User not found";
    return response;
  } else if (mode === "find" && userFound) {
    response["statusCode"] = 200;
    response["message"] = userFound;
    return response;
  }
  return null;
};

export default findUser;
