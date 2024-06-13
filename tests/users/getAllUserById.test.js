import USER_MODEL  from "../../model/USER_MODEL.js";
import { getUserById } from '../../services/userServices.js';

jest.mock('../../model/USER_MODEL.js');

describe('getUserById function', () => {
    let res;
    let mockUsers;
    let req
    beforeEach(() => {
        res = {
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        },

        mockUsers = { 
            _id: 'userId123', 
            email: 'jane@example.com'
        }
    })
    req = {
        user: { id: 'loggedInUserId123' } 
    };

    it('Shoud send status code 403 if userId is not uqual to the id of login user', async() => {
        const id = 'differentUserId';

        try {
            await getUserById(id, req, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe('You dont have permission to fetch other user details!');
        }
    });


    it('Should return user data if userId is equal to the id of logged-in user', async() => {
        const id = 'loggedInUserId123';

        USER_MODEL.findById.mockResolvedValue(mockUsers);

        await getUserById(id, req, res)

        expect(USER_MODEL.findById).toHaveBeenCalledWith(id)
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    })
})