import { updateProduct } from "../../services/productServices.js";
import PRODUCT_MODEL from "../../model/PRODUCT_MODEL.js";

jest.mock('../../model/PRODUCT_MODEL.js');

describe('updateProduct function', () => {
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

    it('Should update the product if the logged-in user is the owner and all fields are provided', async () => {
        const id = 'product123';
        const body = {
            product_name: 'Updated Product',
            product_description: 'Updated Description',
            product_price: 200,
            product_tag: 'updatedTag'
        };
        const mockProduct = {
            _id: 'product123',
            product_name: 'Updated Product',
            product_description: 'Updated Description',
            product_price: 200,
            product_tag: 'updatedTag',
            user: 'logginId',
            updatedAt: new Date()
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);
        PRODUCT_MODEL.findByIdAndUpdate.mockResolvedValue(mockProduct);

        await updateProduct(id, body, req, res);

        expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
        expect(PRODUCT_MODEL.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: body }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            _id: mockProduct._id,
            product_name: mockProduct.product_name,
            product_description: mockProduct.product_description,
            product_price: mockProduct.product_price,
            product_tag: mockProduct.product_tag,
            updatedAt: mockProduct.updatedAt
        }));
    });

    it('Should send status code 404 if the product is not found', async () => {
        const id = 'nonexistentProductId';
        const body = {
            product_name: 'Updated Product',
            product_description: 'Updated Description',
            product_price: 200,
            product_tag: 'updatedTag'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(null);

        try {
            await updateProduct(id, body, req, res);
        } catch (e) {
            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(e.message).toBe('Product not found');
        }
    });

    it('Should send status code 403 if the logged-in user is not the owner', async () => {
        const id = 'product123';
        const body = {
            product_name: 'Updated Product',
            product_description: 'Updated Description',
            product_price: 200,
            product_tag: 'updatedTag'
        };
        const mockProduct = {
            _id: 'product123',
            user: 'differentUserId'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

        try {
            await updateProduct(id, body, req, res);
        } catch (e) {
            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe('Only the owner can update this product');
        }
    });

    it('Should send status code 400 if any field is missing', async () => {
        const id = 'product123';
        const mockProduct = {
            _id: 'product123',
            user: 'logginId'
        };

        PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

        const testCases = [
            { product_name: '', product_description: 'desc', product_price: 100, product_tag: 'tag' },
            { product_name: 'name', product_description: '', product_price: 100, product_tag: 'tag' },
            { product_name: 'name', product_description: 'desc', product_price: '', product_tag: 'tag' },
            { product_name: 'name', product_description: 'desc', product_price: 100, product_tag: '' }
        ];

        for (const body of testCases) {
            try {
                await updateProduct(id, body, req, res);
            } catch (e) {
                expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith(id);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(e.message).toBe('All fields in updating product are required');
            }
        }
    });
});
