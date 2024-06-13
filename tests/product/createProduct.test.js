import { createProduct } from "../../services/productServices.js";
import PRODUCT_MODEL from "../../model/PRODUCT_MODEL.js";

jest.mock('../../model/PRODUCT_MODEL.js')

describe('createProduct function', () => {
    let res;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    })

    const req = {
        user:{id:'logginId'}
    }
    it('Should send status code 400 if field dont have value', async() => {
        const testCases =[
            {product_name:"",product_description:"",product_price:"",product_tag:"" },
            {product_name:"sample",product_description:"sample",product_price:"100",product_tag:"" },
            {product_name:"sample",product_description:"sample",product_price:"",product_tag:"sample" },
            {product_name:"sample",product_description:"",product_price:"sample",product_tag:"sample" }
        ]

            for(const testCase of testCases){
                try {
                   await createProduct(testCase, req, res) 
                } catch (e) {
                    expect(res.status).toHaveBeenCalledWith(400)
                    expect(e.message).toBe('All Fields in creating product required')
                }
            }
    })

    it('Should return data when creating product', async()=> {
        const requestBody = {
            product_name: "Sample Product",
            product_description: "This is a sample product",
            product_price: "100",
            product_tag: "sample"
        };

        const mockCreatedProduct = {
            _id: 'product123',
            product_name: "Sample Product",
            product_description: "This is a sample product",
            product_price: "100",
            product_tag: "sample",
            user: req.user.id
        };

        PRODUCT_MODEL.create.mockResolvedValue(mockCreatedProduct);

        await createProduct(requestBody, req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCreatedProduct);
    })
})