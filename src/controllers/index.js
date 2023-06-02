import listUsers from "./listUserController";
import createUserRouter from "./createUserController";
import updateUserRouter from "./updateUserController";
import deleteUserRouter from "./deleteUserController";
import retrieveUserRouter from "./retrieveUserController";

const routes = {
  create: createUserRouter,
  update: updateUserRouter,
  list: listUsers,
  delete: deleteUserRouter,
  retrieveUser: retrieveUserRouter
};

export default routes;
