import express       from 'express';
import userRoutes    from './userRouter.js';
import productRoutes from './productRouter.js';

const rootRouter = express.Router();

rootRouter.use(userRoutes);
rootRouter.use(productRoutes)


export default rootRouter