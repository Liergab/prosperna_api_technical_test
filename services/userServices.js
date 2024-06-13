import USER_MODEL          from "../model/USER_MODEL.js";
import { comparedPassword,
        hashPassword }     from "../config/bcrypt.js";
import GenerateToken       from "../util/GenerateToken.js";


/* 
    Path: path v1/api/users/register
    method: Post
    access: public

*/

export const register = async (body, res) => {
   const {email, password, password_confirmation} = body;

   if ( !email || !password ||! password_confirmation) {
    res.status(400)
    throw new Error("All fields required!");
  }

   if(password !== password_confirmation){
        res.status(400)
        throw new Error('Password, Password_confirmation Does not Match')
   }

   const existingUser = await USER_MODEL.findOne({email});

   if(existingUser){
    res.status(400)
    throw new Error("Email already used!");
   }

   const user = await USER_MODEL.create({
        email, 
        password:await hashPassword(password)
    });

    GenerateToken(res, user._id);

    res.status(201).json(user);     

}

/* 
    Path: path v1/api/users/login
    method: post
    access: public

*/
export const login = async(body, res) => {

    const {email, password} = body

    if ( !email || !password) {
        res.status(400)
        throw new Error("All fields required!");
      }

    const user = await USER_MODEL.findOne({email});

    if(user && await comparedPassword(password, user.password)){
        GenerateToken(res, user.id)
        return res.status(200).json({  
             id        : user.id,
             email     : user.email,
             createdAt : user.createdAt,
             isAdmin   : user.isAdmin
         })
     }else{
         res.status(400)
         throw new Error('Invalid Credentials')
     }
}


/* 
    Path: path v1/api/users
    method: Get
    access: private admin only

*/
export const getAllUser = async (res) => {
    const user = await USER_MODEL.find();

    res.status(200).json(user);
}

/* 
    Path: path v1/api/users/:id
    method: Get
    access: private

*/

export const getUserById = async(id, req, res) => {

    if(req.user?.id !== id){
        res.status(403);
        throw new Error('You dont have permission to fetch other user details!');
    }

    const user = await USER_MODEL.findById(id);

    res.status(200).json(user);

}


/* 
    Path: path v1/api/users/:id
    method: Delete
    access: private owner/admin

*/


export const deleteUser = async (id, req, res) => {
    
   
    if(req.user?.isAdmin === true){
        const user = await USER_MODEL.findByIdAndDelete(id)

        res.status(200).json({message:"user Deleted!"})

    }
    if(req.user?.id === id){
        await USER_MODEL.findByIdAndDelete(id)

        res.status(200).json({message:"user Deleted!"})
    }


    res.status(403)
    throw new Error('You dont have permission to delete this user!')

};

/* 
    Path: path v1/api/users/:id
    method: Put
    access: Private

*/

export const updateUser = async(id,body,req, res) => {
    const {email, password, password_confirmation} = body
    if(req.user?.id !== id){
        res.status(403)
        throw new Error("You dont have permission to update other user details!")
    }

    if (!email && !password && !password_confirmation) {
        res.status(400)
        throw new Error("No fields to update!" );   
    }
    if (password !== password_confirmation) {
        res.status(400)
        throw new Error("Password and password confirmation do not match!"); 
    }

    let hashedPassword;
    if (password) {
        hashedPassword = await hashPassword(password);
    }
    const updateFields = {
        email,
        password: hashedPassword 
    };
    const updateUser = await USER_MODEL.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    return res.status(200).json({
        _id: updateUser.id,
        email: updateUser.email,
        isAdmin:updateUser.isAdmin,
        createdAt: updateUser.createdAt,
        updatedAt: updateUser.updatedAt
    });
}