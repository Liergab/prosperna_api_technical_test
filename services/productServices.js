import PRODUCT_MODEL from "../model/PRODUCT_MODEL.js"

/* 
    Path: path v1/api/product/
    method: Post
     access/ private

*/
export const createProduct = async(body,req,res) => {
    const { product_name,
            product_description, 
            product_price,
            product_tag } = body;

    if(!product_name || !product_description || !product_price || !product_tag){
            res.status(400)
            throw new Error('All Fields in creating product required')
    }


    const product = await PRODUCT_MODEL.create({
        product_name,
        product_description,
        product_price,
        product_tag ,
        user:req.user?.id
    })

    return res.status(201).json(product)

}


/* 
    Path: path v1/api/product/
    method: Get
    access: public

*/

export const getProduct = async(res) => {
    const product = await PRODUCT_MODEL.find();

    res.status(200).json(product);
    
}

/* 
    Path: path v1/api/product/:id
    method: Get
    access: public

*/

export const getProductById = async(id,res) => {

    const product = await PRODUCT_MODEL.findById(id);

    if(!product){
        res.status(404);
        throw new Error('Product not found!');
    }


    res.status(200).json(product);

    
}

/* 
    Path: path v1/api/product/:id
    method: Delete
    access: private

*/

export const deleteProduct = async(id,req,res) => {

   
    const product = await PRODUCT_MODEL.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Only the owner can delete this product');
    }

    await PRODUCT_MODEL.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product Deleted!' });
  
}


/* 
    Path: path v1/api/product/:id
    method: Put
    access: Private

*/


export const updateProduct = async (id, body, req, res) => {
    const { product_name, product_description, product_price, product_tag } = body;

    const product = await PRODUCT_MODEL.findById(id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Only the owner can update this product");
    }

    if (!product_name || !product_description || !product_price || !product_tag) {
        res.status(400);
        throw new Error('All fields in updating product are required');
    }

    const updateFields = {
        product_name,
        product_description,
        product_price,
        product_tag
    };

    const updatedProduct = await PRODUCT_MODEL.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    return res.status(200).json({
        _id: updatedProduct._id,
        product_name: updatedProduct.product_name,
        product_description: updatedProduct.product_description,
        product_price: updatedProduct.product_price,
        product_tag: updatedProduct.product_tag,
        updatedAt: updatedProduct.updatedAt
    });
};
