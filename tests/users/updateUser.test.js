import { updateUser } from '../../services/userServices.js';
import USER_MODEL from '../../model/USER_MODEL.js';
import { hashPassword } from "../../config/bcrypt.js"; 

jest.mock('../../model/USER_MODEL.js');
jest.mock("../../config/bcrypt.js"); 

describe('updateUser function', () => {
    let res;
    let req;
    let body;
    let mockUser;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        req = {
            user: {
                id: 'loggedInUserId123'
            }
        };

        body = {
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123'
        };

        mockUser = {
            _id: "loggedInUserId123",
            email: "test@example.com",
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    it('Should send status code 403 when user logged in is not equal to id', async () => {
        const id = "differentId";

        try {
            await updateUser(id, body, req, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(403);
            expect(e.message).toBe("You dont have permission to update other user details!");
        }
    });

    it('Should send status code 400 when no fields to update are provided', async () => {
        const id = 'loggedInUserId123';
        const emptyBody = { email: '', password: '', password_confirmation: '' };

        try {
            await updateUser(id, emptyBody, req, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(e.message).toBe("No fields to update!");
        }
    });

    it('Should send status code 400 when password and password_confirmation do not match', async () => {
        const id = 'loggedInUserId123';
        const mismatchedPasswordsBody = { email: 'test@example.com', password: 'password123', password_confirmation: 'password456' };

        try {
            await updateUser(id, mismatchedPasswordsBody, req, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(e.message).toBe("Password and password confirmation do not match!");
        }
    });

    it('Should update user email and send status code 200', async () => {
        const id = 'loggedInUserId123';
        const updatedEmailBody = { email: 'newemail@example.com' };

        USER_MODEL.findByIdAndUpdate.mockResolvedValue({ ...mockUser, email: 'newemail@example.com' });

        await updateUser(id, updatedEmailBody, req, res);

        expect(USER_MODEL.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: { email: 'newemail@example.com' } }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            _id: mockUser.id,
            email:'newemail@example.com',
            isAdmin: mockUser.isAdmin,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt
        });
    });

    it('Should update user password and send status code 200', async () => {
        const id = 'loggedInUserId123';
        const updatedPasswordBody = { password: 'newpassword123', password_confirmation: 'newpassword123' };
        const hashedPassword = 'hashedNewPassword123';

        hashPassword.mockResolvedValue(hashedPassword);
        USER_MODEL.findByIdAndUpdate.mockResolvedValue({ ...mockUser, password: hashedPassword });

        await updateUser(id, updatedPasswordBody, req, res);

        expect(hashPassword).toHaveBeenCalledWith('newpassword123');
        expect(USER_MODEL.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: { password: hashedPassword } }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            _id: mockUser.id,
            email: mockUser.email,
            isAdmin: mockUser.isAdmin,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt
        });
    });
});
