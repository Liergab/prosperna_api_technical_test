import asyncHandler from 'express-async-handler';
import * as productServices from '../services/productServices.js'


export const createProduct = asyncHandler(async(req,res) => {
    const body = req.body;
    await productServices.createProduct(body, req, res);

})

export const getProduct = asyncHandler(async(req,res) => {
    await productServices.getProduct(res);
})

export const getProductById = asyncHandler(async(req,res) => {
    const {id} = req.params;
    await productServices.getProductById(id, res);
    
})

export const deleteProduct = asyncHandler(async(req,res) => {
    const {id} =  req.params;
    await productServices.deleteProduct(id, req, res);
})

export const updateProduct = asyncHandler(async(req,res) => {
    const {id} = req.params;
    const body = req.body;
    await productServices.updateProduct(id, body, req, res);
})
