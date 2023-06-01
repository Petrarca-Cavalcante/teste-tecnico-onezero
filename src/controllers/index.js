import listUsers from "./listUserController"
import createUserRouter from "./createUserController"


const routes = {
    create: createUserRouter,
    update: {},
    list: listUsers,
    delete: {}
}

export default routes