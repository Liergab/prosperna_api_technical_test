import * as userServices from '../services/userServices.js';
import asyncHandler       from 'express-async-handler';

export const register = asyncHandler(async(req, res) => {
    const body = req.body;
    await userServices.register(body, res);
   
}); 

export const login = asyncHandler(async(req, res) => {
    const body = req.body;
    await userServices.login(body, res);
})

export const getAllUser = asyncHandler(async(req, res) => {
    await userServices.getAllUser(res);
});


export const getUserById = asyncHandler(async(req,res) => {
    const {id} = req.params;
    await userServices.getUserById(id, req, res);
})


export  const deleteUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    await userServices.deleteUser(id, req, res);
})

export const updateUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const body = req.body;
    await userServices.updateUser(id, body, req, res);
})