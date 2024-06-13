import { deleteProduct } from "../../services/productServices.js";
import PRODUCT_MODEL from "../../model/PRODUCT_MODEL.js";

jest.mock('../../model/PRODUCT_MODEL.js');

describe('deleteProduct function', () => {
    let res;
    let req;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        req = {
            user: { id: 'logginId' }
        };
    });

    it('Should delete the product if the logged-in user is the owner', async () => {
        const id = 'product123';
        const mockProduct = {
            _id: 'product123',
            user: 'logginId'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);
        PRODUCT_MODEL.findByIdAndDelete.mockResolvedValue(mockProduct);

        await deleteProduct(id, req, res);

        expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
        expect(PRODUCT_MODEL.findByIdAndDelete).toHaveBeenCalledWith(id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product Deleted!' });
    });

    it('Should send status code 403 if the logged-in user is not the owner', async () => {
        const id = 'product123';
        const mockProduct = {
            _id: 'product123',
            user: 'differentUserId'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

        try {
            await deleteProduct(id, req, res);
        } catch (e) {
            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe('Only the owner can delete this product');
        }
    });

    it('Should send status code 404 if the product is not found', async () => {
        const id = 'nonexistentProductId';

        PRODUCT_MODEL.findById.mockResolvedValue(null);

        try {
            await deleteProduct(id, req, res);
        } catch (e) {
            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(e.message).toBe('Product not found!');
        }
    });
});
