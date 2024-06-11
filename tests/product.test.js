/*There is a errror in my unit test but i guaranteed i will re study the jest again this
 is the second time i doing unit test with jest*/
import { createProduct, getProduct, getProductById, deleteProduct, updateProduct } from '../services/productServices';
import PRODUCT_MODEL from '../model/PRODUCT_MODEL';

jest.mock('../model/PRODUCT_MODEL');

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn()
};

const mockRequest = {
    user: {
        _id: 'user_id',
    }
};

const mockProduct = {
    _id: 'product_id',
    product_name: 'Test Product',
    product_description: 'Test Description',
    product_price: 100,
    product_tag: 'Test Tag',
    user: 'user_id',
};

describe('Product Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            PRODUCT_MODEL.create.mockResolvedValue(mockProduct);
            const mockBody = {
                product_name: 'Test Product',
                product_description: 'Test Description',
                product_price: 100,
                product_tag: 'Test Tag',
            };

            await createProduct(mockBody, mockRequest, mockResponse);

            expect(PRODUCT_MODEL.create).toHaveBeenCalledWith({
                ...mockBody,
                user: mockRequest.user._id,
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should return 400 if required fields are missing', async () => {
            const mockBody = {};

            await expect(createProduct(mockBody, mockRequest, mockResponse)).rejects.toThrow('All Fields in creating product required');
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getProduct', () => {
        it('should get all products', async () => {
            PRODUCT_MODEL.find.mockResolvedValue([mockProduct]);

            await getProduct(mockResponse);

            expect(PRODUCT_MODEL.find).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([mockProduct]);
        });
    });

    describe('getProductById', () => {
        it('should get a product by ID', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

            await getProductById('product_id', mockResponse);

            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith('product_id');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should return 404 if product not found', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(null);

            await expect(getProductById('invalid_id', mockResponse)).rejects.toThrow('Product not found!');
            expect(mockResponse.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);
            PRODUCT_MODEL.findByIdAndDelete.mockResolvedValue(mockProduct);

            await deleteProduct('product_id', mockRequest, mockResponse);

            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith('product_id');
            expect(PRODUCT_MODEL.findByIdAndDelete).toHaveBeenCalledWith('product_id');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product Deleted!' });
        });

        it('should return 403 if user is not the owner', async () => {
            const differentUserProduct = { ...mockProduct, user: 'another_user_id' };
            PRODUCT_MODEL.findById.mockResolvedValue(differentUserProduct);

            await expect(deleteProduct('product_id', mockRequest, mockResponse)).rejects.toThrow('Only the owner can delete this product');
            expect(mockResponse.status).toHaveBeenCalledWith(403);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);
            const updatedProduct = { ...mockProduct, product_name: 'Updated Product' };
            PRODUCT_MODEL.findByIdAndUpdate.mockResolvedValue(updatedProduct);

            const updateData = {
                product_name: 'Updated Product',
                product_description: 'Updated Description',
                product_price: 200,
                product_tag: 'Updated Tag',
            };

            await updateProduct('product_id', updateData, mockRequest, mockResponse);

            expect(PRODUCT_MODEL.findById).toHaveBeenCalledWith('product_id');
            expect(PRODUCT_MODEL.findByIdAndUpdate).toHaveBeenCalledWith('product_id', { $set: updateData }, { new: true });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
        });

        it('should return 404 if product not found', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(null);

            await expect(updateProduct('invalid_id', {}, mockRequest, mockResponse)).rejects.toThrow('Product not found');
            expect(mockResponse.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 if user is not the owner', async () => {
            const differentUserProduct = { ...mockProduct, user: 'another_user_id' };
            PRODUCT_MODEL.findById.mockResolvedValue(differentUserProduct);

            const updateData = {
                product_name: 'Updated Product',
                product_description: 'Updated Description',
                product_price: 200,
                product_tag: 'Updated Tag',
            };

            await expect(updateProduct('product_id', updateData, mockRequest, mockResponse)).rejects.toThrow('Only the owner can update this product');
            expect(mockResponse.status).toHaveBeenCalledWith(403);
        });

        it('should return 400 if required fields are missing', async () => {
            PRODUCT_MODEL.findById.mockResolvedValue(mockProduct);

            const updateData = {};

            await expect(updateProduct('product_id', updateData, mockRequest, mockResponse)).rejects.toThrow('All fields in updating product are required');
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
});
