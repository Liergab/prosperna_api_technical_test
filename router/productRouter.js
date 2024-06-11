import express from 'express'
import * as controller from '../controller/productController.js'
import {AuthMiddleware} from '../middleware/AuthMiddleware.js'
const productRoutes = express.Router();

productRoutes.post('/products' ,[AuthMiddleware], controller.createProduct);

productRoutes.get('/products', controller.getProduct)

productRoutes.get('/products/:id', controller.getProductById)

productRoutes.delete('/products/:id',[AuthMiddleware], controller.deleteProduct)

productRoutes.put('/products/:id' ,[AuthMiddleware], controller.updateProduct)


export default productRoutes