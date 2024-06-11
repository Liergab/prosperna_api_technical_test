import mongoose, { model, Schema } from 'mongoose';

const productSchema = new Schema({
    product_name:{ 
        type       : String,
         required  : true 
    },
    product_description: { 
        type       : String,
        required   : true
    },
    product_price:{
        type      : Number,
        required  : true 
    },
    product_tag:{ 
        type: [String], default: []
     },
    user:{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
     } 
}, { timestamps: true });



export default model('products', productSchema);