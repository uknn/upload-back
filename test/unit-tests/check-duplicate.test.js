const User = require('../../models/User');
const mockingoose = require("mockingoose");
const checkDuplicateMiddleware = require('../../middlewares/check-duplicate');

describe('CheckDuplicate middleware', () => {
    let res = {};
    const req = {
        params: {
            id: '5aa06bb80738152cfd536fdc'
        },
        query: {
            userId: '5aa06bb80738152cfd536fdc'
        },
        session: {
            token: 'token'
        },
        body: {
            username: 'username'
        }
    }

    const next = function () {
    };

    beforeEach(() => {
        res = {
            json: jest.fn(),
            send: jest.fn().mockImplementation(() => {}),
            status: jest.fn().mockImplementation(() => res)
        };
    });


    describe('checkDuplicate', () => {
        it ('should return a 400 if a user is found', async () => {
            const expectedData =  {
                email: 'email',
                username: 'username',
                password: 'password'
            };
            mockingoose(User).toReturn(expectedData, 'findOne');
            await checkDuplicateMiddleware.checkDuplicate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400)
        });

        it ('should return a 500', async () => {
            mockingoose(User).toReturn(new Error('test'), 'findOne');
            await checkDuplicateMiddleware.checkDuplicate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500)
        });

        it ('should next', async () => {
            mockingoose(User).toReturn(null, 'findOne');
            const nextSpy = jest.fn();
            await checkDuplicateMiddleware.checkDuplicate(req, res, nextSpy);
            expect(nextSpy).toHaveBeenCalled();
        });
    });

    describe('checkEmailDuplicate', () => {
        it ('should return a 400 if a user is found', async () => {
            const expectedData =  {
                email: 'email',
                username: 'username',
                password: 'password'
            };
            mockingoose(User).toReturn(expectedData, 'findOne');
            await checkDuplicateMiddleware.checkEmailDuplicate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400)
        });

        it ('should return a 500', async () => {
            mockingoose(User).toReturn(new Error('test'), 'findOne');
            await checkDuplicateMiddleware.checkEmailDuplicate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(500)
        });

        it ('should next', async () => {
            mockingoose(User).toReturn(null, 'findOne');
            const nextSpy = jest.fn();
            await checkDuplicateMiddleware.checkEmailDuplicate(req, res, nextSpy);
            expect(nextSpy).toHaveBeenCalled();
        });
    });
});