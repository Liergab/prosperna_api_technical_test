import { getAllUser } from '../../services/userServices.js';
import USER_MODEL from '../../model/USER_MODEL.js';

jest.mock('../../model/USER_MODEL.js');

describe('getAllUser function', () => {
    let res;
    let mockUsers;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockUsers = [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
            { _id: '2', name: 'Jane Doe', email: 'jane@example.com' }
        ];
    });

    it('Should return all User data', async () => {
        USER_MODEL.find.mockResolvedValue(mockUsers);

        await getAllUser(res);

        expect(USER_MODEL.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
});
