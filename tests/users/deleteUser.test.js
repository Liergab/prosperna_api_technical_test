import USER_MODEL  from "../../model/USER_MODEL.js";
import { deleteUser } from '../../services/userServices.js';

jest.mock('../../model/USER_MODEL.js');


describe('deleteUser function', () => {
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
        user: { 
            id: 'loggedInUserId123' ,
            isAdmin: false
        } 
    };


    it('Should send status code 200 if login user is admin he/she can delete other userInfo', async() => {
        req.user.isAdmin = true
        const id  = 'userId123'

        USER_MODEL.findByIdAndDelete.mockResolvedValue({});
        try {
            await deleteUser(id, req, res)

            expect(USER_MODEL.findByIdAndDelete).toHaveBeenCalledWith(id)
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "User Deleted!" });
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe('You dont have permission to delete this user!');
        }
       
    })


    it('Should send status code 200 if the logged-in user is deleting their own account', async () => {
        const id = 'loggedInUserId123';

        USER_MODEL.findByIdAndDelete.mockResolvedValue({});


        try {

            await deleteUser(id, req, res);

            expect(USER_MODEL.findByIdAndDelete).toHaveBeenCalledWith(id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "User Deleted!" });
            
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe('You dont have permission to delete this user!');
        }
      
    });

  
})