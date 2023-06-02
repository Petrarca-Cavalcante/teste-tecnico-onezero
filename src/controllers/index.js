import listUsers from "./listUserController";
import createUserRouter from "./createUserController";
import updateUserRouter from "./updateUserController";
import deleteUserRouter from "./deleteUserController";

const routes = {
  create: createUserRouter,
  update: updateUserRouter,
  list: listUsers,
  delete: deleteUserRouter,
};

export default routes;
