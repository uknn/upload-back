const mockingoose = require('mockingoose');
const User = require('../../models/User');
const {
    register,
    login,
    findUser
} = require('../../services/login.service');
const bcrypt = require("bcryptjs");

describe('Login service', () => {
    const errorTest = 'test';

    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('findUser', () => {
        it ('should return the user', async () => {
            const expectedData =  {
                email: 'email',
                username: 'username',
                password: 'password'
            };
            mockingoose(User).toReturn(expectedData, 'find');
            const result = await findUser();
            expect(result._doc.email).toEqual(expectedData.email);
            expect(result._doc.username).toEqual(expectedData.username);
            expect(result._doc.password).toEqual(expectedData.password);
        });

        it ('should return an error', async () => {
            mockingoose(User).toReturn(new Error(errorTest), 'find');
            const result = await findUser();
            expect(result).toEqual(errorTest);
        });
    });

    describe('register', () => {
        const expectedData =  {
            email: 'email',
            username: 'username',
            password: 'password'
        };
        const user = new User({
            username: expectedData.username,
            email: expectedData.email,
            password: expectedData.password,
        });

        it ('should return the user', async () => {
            mockingoose(User).toReturn(expectedData, 'save');
            const result = await register(user);
            expect(result._doc.email).toEqual(expectedData.email);
            expect(result._doc.username).toEqual(expectedData.username);
            expect(result._doc.password).toEqual(expectedData.password);
        });

        it ('should return an error', async () => {
            mockingoose(User).toReturn(new Error(errorTest), 'save');
            const result = await register(user);
            expect(result).toEqual(errorTest);
        });
    });

    describe('login', () => {
        it ('should return the user', async () => {
            const expectedData =  {
                email: 'email',
                username: 'username',
                password: 'password'
            };
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
            mockingoose(User).toReturn(expectedData, 'findOne');
            const result = await login('username', 'password');
            expect(result.user.email).toEqual(expectedData.email);
            expect(result.user.username).toEqual(expectedData.username);
            expect(result.token).not.toBeNull();
            expect(result.status).toEqual(200);
        });

        it ('should return a 404', async () => {
            mockingoose(User).toReturn(null, 'findOne');
            const result = await login('username', 'password');
            expect(result.status).toEqual(404);
        });

        it ('should return a 201', async () => {
            const expectedData =  {
                email: 'email',
                username: 'username',
                password: 'password'
            };
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
            mockingoose(User).toReturn(expectedData, 'findOne');
            const result = await login('username', 'password');
            expect(result.status).toEqual(401);
        });

        it ('should return an error', async () => {
            mockingoose(User).toReturn(new Error(errorTest), 'findOne');
            const result = await login('username', 'password');
            expect(result).toEqual(errorTest);
        });
    });
});