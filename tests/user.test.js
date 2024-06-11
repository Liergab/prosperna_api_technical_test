/*There is a error in my unit test but i guaranteedi will re study the jest again this
 is the second time i doing unit test with jest*/
import { register, login, getAllUser, getUserById, deleteUser, updateUser } from '../services/userServices.js'; 
import USER_MODEL from '../model/USER_MODEL.js'; 
import * as bcrypt from '../config/bcrypt.js';
import GenerateToken from '../util/GenerateToken.js';
import 'dotenv/config';

jest.mock('../util/GenerateToken.js', () => jest.fn());

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  end: jest.fn()
};

const mockRequest = {
  user: {
    id: 'user_id',
    isAdmin: true 
  }
};

const mockBody = {
  email: 'test@example.com',
  password: 'password',
  password_confirmation: 'password'
};

const mockUser = {
  _id: 'user_id',
  email: 'test@example.com',
  password: 'hashed_password',
  isAdmin: true,
  createdAt: new Date()
};

const mockUsers = [mockUser];

USER_MODEL.findOne = jest.fn();
USER_MODEL.findById = jest.fn();
USER_MODEL.create = jest.fn();
USER_MODEL.findByIdAndDelete = jest.fn();
USER_MODEL.findByIdAndUpdate = jest.fn();
USER_MODEL.find = jest.fn();

bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
bcrypt.compare = jest.fn().mockResolvedValue(true);

describe('register function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    USER_MODEL.findOne.mockResolvedValue(null);

    USER_MODEL.create.mockResolvedValueOnce({
      _id: 'user_id',
      email: mockBody.email,
      password: 'hashed_password'
    });

    await register(mockBody, mockResponse);

    expect(USER_MODEL.findOne).toHaveBeenCalledWith({ email: mockBody.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockBody.password, 10);
    expect(USER_MODEL.create).toHaveBeenCalledWith({
      email: mockBody.email,
      password: 'hashed_password'
    });
    expect(GenerateToken).toHaveBeenCalledWith(mockResponse, 'user_id');
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      _id: 'user_id',
      email: mockBody.email
    });
  });

  it('should return 400 if missing fields', async () => {
    const invalidBody = { email: 'test@example.com' };
    
    await register(invalidBody, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'All fields required!' });
  });

  it('should return 400 if user already exists', async () => {
    USER_MODEL.findOne.mockResolvedValue(mockUser);
    
    await register(mockBody, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User already exists!' });
  });
});

describe('login function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a user', async () => {
    USER_MODEL.findOne.mockResolvedValue(mockUser);

    await login(mockBody, mockResponse);

    expect(USER_MODEL.findOne).toHaveBeenCalledWith({ email: mockBody.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockBody.password, mockUser.password);
    expect(GenerateToken).toHaveBeenCalledWith(mockResponse, 'user_id');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: mockUser._id,
      email: mockUser.email,
      createdAt: mockUser.createdAt,
      isAdmin: mockUser.isAdmin
    });
  });

  it('should return 400 if missing fields', async () => {
    const invalidBody = { email: 'test@example.com' };

    await login(invalidBody, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'All fields required!' });
  });

  it('should return 400 if invalid credentials', async () => {
    USER_MODEL.findOne.mockResolvedValue(null);

    await login(mockBody, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
  });
});

describe('getAllUser function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all users', async () => {
    USER_MODEL.find.mockResolvedValue(mockUsers);

    await getAllUser(mockResponse);

    expect(USER_MODEL.find).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  });
});

describe('getUserById function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a user by ID', async () => {
    USER_MODEL.findById.mockResolvedValue(mockUser);

    await getUserById('user_id', mockRequest, mockResponse);

    expect(USER_MODEL.findById).toHaveBeenCalledWith('user_id');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 403 if user does not have permission', async () => {
    await getUserById('another_user_id', mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'You dont have permission to fetch other user details!' });
  });
});

describe('deleteUser function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user as admin', async () => {
    USER_MODEL.findByIdAndDelete.mockResolvedValue(mockUser);

    await deleteUser('user_id', mockRequest, mockResponse);

    expect(USER_MODEL.findByIdAndDelete).toHaveBeenCalledWith('user_id');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Successfully Deleted' });
  });

  it('should delete own user', async () => {
    mockRequest.user._id = 'user_id';

    await deleteUser('user_id', mockRequest, mockResponse);

    expect(USER_MODEL.findByIdAndDelete).toHaveBeenCalledWith('user_id');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Successfully Deleted' });
  });

  it('should return 403 if user does not have permission', async () => {
    await deleteUser('another_user_id', mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "You can't delete another user!" });
  });
});

describe('updateUser function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a user', async () => {
        USER_MODEL.findByIdAndUpdate.mockResolvedValue(mockUser);

        await updateUser('user_id', { email: 'updated@example.com' }, mockRequest, mockResponse);

        expect(USER_MODEL.findByIdAndUpdate).toHaveBeenCalledWith('user_id', { $set: { email: 'updated@example.com' } }, { new: true });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            _id: 'user_id',
            email: 'updated@example.com',
            isAdmin: mockUser.isAdmin,
            createdAt: mockUser.createdAt,
            updatedAt: undefined
        });
    });

    it('should return 403 if user does not have permission', async () => {
        mockRequest.user._id = 'another_user_id';

        await updateUser('user_id', { email: 'updated@example.com' }, mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "You don't have permission to update other user details!" });
    });

    it('should return 400 if no fields to update', async () => {
        await updateUser('user_id', {}, mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No fields to update!' });
    });

    it('should return 400 if password and password confirmation do not match', async () => {
        await updateUser('user_id', { password: 'password', password_confirmation: 'different_password' }, mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password and password confirmation do not match!' });
    });
});