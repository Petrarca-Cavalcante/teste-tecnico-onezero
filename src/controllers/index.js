import listUsers from "./listUserController"
import createUserRouter from "./createUserController"
import updateUserRouter from "./updateUserController"


const routes = {
    create: createUserRouter,
    update: updateUserRouter,
    list: listUsers,
    delete: {}
}

export default routes