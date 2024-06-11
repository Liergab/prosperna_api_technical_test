import express            from "express";
import * as controller    from '../controller/userContoller.js'
import { AdminMiddleware,
         AuthMiddleware } from "../middleware/AuthMiddleware.js";


const userRoutes = express.Router();


userRoutes.post('/users/login',    controller.login);
userRoutes.post('/users/register', controller.register);
userRoutes.get('/users',          [AdminMiddleware, AuthMiddleware], controller.getAllUser);
userRoutes.get('/users/:id',      [AuthMiddleware], controller.getUserById );
userRoutes.delete('/users/:id',   [AuthMiddleware], controller.deleteUser);
userRoutes.put('/users/:id',      [AuthMiddleware], controller.updateUser);

export default userRoutes;
