const {
    logout,
    login,
    register
} = require('../../controllers/login.controller');
const loginService = require('../../services/login.service');

describe('Login controller', () => {
    let res = {};

    const req = {
        body: {
            username: 'username',
            password: 'password',
            email: 'email'
        },
        session: {
            token: 'token'
        }
    }

    beforeEach(() => {
        res = {
            json: jest.fn(),
            send: jest.fn().mockImplementation(() => {}),
            status: jest.fn().mockImplementation(() => res)
        };
    });

    describe('login', () => {
        it ('should call login and return a 200', async () => {
            const expectedValue = {
                email: 'email',
                username: 'username',
                password: 'password',
                id: 'id'
            };
            jest.spyOn(loginService, 'login').mockReturnValue(Promise.resolve({ user: expectedValue, status: 200 }));
            await login(req, res);
            expect(loginService.login).toHaveBeenCalledWith('username', 'password');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it ('should return a 401', async () => {
            const expectedValue = {
                email: 'email',
                username: 'username',
                password: 'password',
                id: 'id'
            };
            jest.spyOn(loginService, 'login').mockReturnValue(Promise.resolve({ user: expectedValue, status: 401 }));
            await login(req, res);
            expect(loginService.login).toHaveBeenCalledWith('username', 'password');
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it ('should return a 404', async () => {
            const expectedValue = {
                email: 'email',
                username: 'username',
                password: 'password',
                id: 'id'
            };
            jest.spyOn(loginService, 'login').mockReturnValue(Promise.resolve({ user: expectedValue, status: 404 }));
            await login(req, res);
            expect(loginService.login).toHaveBeenCalledWith('username', 'password');
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it ('should return a 500', async () => {
            jest.spyOn(loginService, 'login').mockRejectedValue(new Error('error'));
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('register', () => {
        it ('should call register', async () => {
            const registerSpy = jest.spyOn(loginService, 'register').mockResolvedValue(true);
            await register(req, res);
            expect(registerSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it ('should return a 500', async () => {
            jest.spyOn(loginService, 'register').mockRejectedValue(new Error('error'));
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('logout', () => {
        it ('should reset the request session and return a 200', async () => {
            await logout(req, res);
            expect(req.session).toBeNull();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});