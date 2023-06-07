const config = require('../../config/auth.config.js');
const verifyTokenMiddleware = require('../../middlewares/auth');
const jwt = require('jsonwebtoken');

describe('Auth middleware', () => {
    let res = {};
    const req = {
        file: {
            filename: 'filename',
            originalname: 'originalname'
        },
        params: {
            id: '5aa06bb80738152cfd536fdc'
        },
        query: {
            userId: '5aa06bb80738152cfd536fdc'
        },
        session: {
            token: 'token'
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


    describe('verifyToken', () => {
        it ('should return a 401 when the token is invalid', async () => {
            const resSpy = jest.spyOn(res, 'status');
            const result = verifyTokenMiddleware.verifyToken(req, res, next);
            expect(resSpy).toHaveBeenCalledWith(401);
        });


        it ('should update the request userId', async () => {
            token = jwt.sign({ id: '5aa06bb80738152cfd536fdc' }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
            req.session.token = token;
            const result = verifyTokenMiddleware.verifyToken(req, res, next);
            expect(req.userId).toEqual('5aa06bb80738152cfd536fdc')
        });

        it ('should return a 403 when the token is null', async () => {
            const resSpy = jest.spyOn(res, 'status');
            req.session.token = null;
            const result = verifyTokenMiddleware.verifyToken(req, res, next);
            expect(resSpy).toHaveBeenCalledWith(403);
        });
    });
});