import { login } from '../../services/userServices.js';
import USER_MODEL from '../../model/USER_MODEL.js';
import { comparedPassword } from '../../config/bcrypt.js';
import GenerateToken from '../../util/GenerateToken.js';

jest.mock('../../model/USER_MODEL.js');
jest.mock('../../config/bcrypt.js');
jest.mock('../../util/GenerateToken.js');

describe('login function' , () => {
    let res;
    let body;
    let mockUser
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        body = {
            email: 'test@example.com',
            password: 'password123',
        };

        const mockUser = {
            id: 'userId123',
            email: 'test@example.com',
            createdAt: new Date(),
            isAdmin: false
        };

    });

    it('Should send status code 400 when email and password  does not have value', async() => {

        const testCases = [
            {email:"", password:""},
            {email:"test@example.com", password:""},
            {email:"", password:"test123"}
        ]

        for(const testCase of testCases){
            try {
                await login(testCase, res)
            } catch (e) {
                expect(res.status).toHaveBeenCalledWith(400)
                expect(e.message).toBe('All fields required!')
            }
        }

    });

    it('Should return data when email and password is valid', async() => {

        comparedPassword.mockResolvedValueOnce(true)

        try {
            await login(body, res)
            USER_MODEL.findOnemockResolvedValueOnce({email:body.email});
            expect(comparedPassword).toHaveBeenCalledWith(body.password,  mockUser.password)
            expect(GenerateToken).toHaveBeenCalledWith(res, mockUser.id)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: mockUser.id,
                email: mockUser.email,
                createdAt: mockUser.createdAt,
                isAdmin: false
            }));
            

        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(e.message).toBe("Invalid Credentials");
        }
    });


})