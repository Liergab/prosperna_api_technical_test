import { getProductById } from "../../services/productServices.js";
import PRODUCT_MODEL from "../../model/PRODUCT_MODEL.js";

jest.mock('../../model/PRODUCT_MODEL.js');

describe('getProductById', () => {
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('Should return product data if product is found', async () => {
        const id = 'product123';
        const mockProduct = {
            _id: 'product123',
            product_name: 'Sample Product',
            product_description: 'This is a sample product',
            product_price: 100,
            product_tag: 'sample'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

        await getProductById(id, res);

        expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('Should send status code 404 if product is not found', async () => {
        const id = 'nonexistentProductId';

        PRODUCT_MODEL.findById.mockResolvedValue(null);

        try {
            await getProductById(id, res);
        } catch (e) {
            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(e.message).toBe('Product not found!');
        }
    });
});
