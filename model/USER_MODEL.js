import { Schema,  model } from "mongoose";

const userSchema =  new Schema({
    email:{
        type     : String,
        required : true,
        unique   : true,
        match    : [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password:{
        type     :String,
        required :true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


export default model('users', userSchema);

