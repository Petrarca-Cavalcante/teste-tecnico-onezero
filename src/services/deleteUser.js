import users from "../data-source";

const deleteUserService = (userId) => {
  let response = {};
  const userIndex = users.findIndex((user) => userId === userId);
  if(userIndex === -1){
    response["statusCode"] = 404
    response["message"] = "User not found"
    return response
  }

  users.splice(userIndex, 1)
  response["statusCode"] = 204
  return response
};

export default deleteUserService;
