import { register } from '../../services/userServices.js';
import USER_MODEL from '../../model/USER_MODEL.js';
import { hashPassword } from '../../config/bcrypt.js';
import GenerateToken from '../../util/GenerateToken.js';

jest.mock('../../model/USER_MODEL.js');
jest.mock('../../config/bcrypt.js');
jest.mock('../../util/GenerateToken.js');

describe('register function', () => {

    let res;
    let body;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        body = {
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123'
        };
    });

    it('Should send status code 400 when email, password, or password_confirmation does not have value', async () => {
        const testCases = [
            { email: '', password: 'password123', password_confirmation: 'password123' },
            { email: 'test@example.com', password: '', password_confirmation: 'password123' },
            { email: 'test@example.com', password: 'password123', password_confirmation: '' },
            { email: '', password: '', password_confirmation: '' },
        ];

        for (const testCase of testCases) {
            try {
                await register(testCase, res);
            } catch (e) {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(e.message).toBe("All fields required!");
            }
        }
    });

    it('Should send status code 400 when password and password_confirmation do not match', async () => {

        body.password_confirmation = 'password456';

        try {
            await register(body, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(e.message).toBe('Password, Password_confirmation Does not Match');
        }
    });

    it('Should send status code 400 when email exist', async () => {
       
        USER_MODEL.findOne.mockResolvedValueOnce(true);

        try {
            await register(body, res);
        } catch (e) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(e.message).toBe("Email already used!");
        }
    });

    it('Should return data when register is successful', async () => {
      

        USER_MODEL.findOne.mockResolvedValueOnce(null);
        USER_MODEL.create.mockResolvedValueOnce({ _id: 'userId123', email: 'test@example.com' });
        hashPassword.mockResolvedValueOnce('hashedPassword123');

        await register(body, res);

        expect(USER_MODEL.create).toHaveBeenCalledWith({
            email: body.email,
            password: 'hashedPassword123'
        });

        expect(GenerateToken).toHaveBeenCalledWith(res, 'userId123');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: 'userId123', email: 'test@example.com' });
    });
});
