import { getProduct } from "../../services/productServices.js";
import PRODUCT_MODEL from "../../model/PRODUCT_MODEL.js";


jest.mock('../../model/PRODUCT_MODEL.js')


describe('getProduct function', () => {
    it('Should return all products', async() => {
        const mockProducts = [
            {  _id: 'product123',product_name: "Sample Product",product_description: "This is a sample product",
                product_price: "100",product_tag: "sample", user:'userId1'
            },
            {  _id: 'product124',product_name: "Sample Product",product_description: "This is a sample product",
                product_price: "100",product_tag: "sample", user:'userId2'
            }
        ]

        const res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }

        PRODUCT_MODEL.find.mockResolvedValue(mockProducts);

        await getProduct(res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockProducts)
    })
})