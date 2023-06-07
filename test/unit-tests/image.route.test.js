jest.mock('../../middlewares/auth', () => ({
        verifyToken: jest.fn((req, res, next) => next())
    })
);
jest.mock('../../middlewares/check-duplicate', () => ({
        checkDuplicate: jest.fn((req, res, next) => next()),
        checkEmailDuplicate: jest.fn((req, res, next) => next())
    })
);
const request = require('supertest');
const app = require('../../app');
const imageService = require('../../services/image.service');
const loginService = require('../../services/login.service');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


describe('endpoints', () => {
    beforeAll((done) => {
        if(!mongoose.connection.db){
            mongoose.connection.on('connected', done)
        } else {
            done();
        }
    }, 20000);

    afterEach(() => {
        mongoose.connection.close();
    })

    it('should call fetchImages', async () => {
        jest.spyOn(imageService, 'fetchImages');
        await request(app).get('/api/load');
        expect(imageService.fetchImages).toHaveBeenCalled();
    })

    it('should call saveImage', async () => {
        jest.mock('fs');
        const spy = jest.spyOn(fs, 'readFileSync').mockImplementation(function () {});
        jest.spyOn(imageService, 'saveImage');
        const res = await request(app).post('/api/create').attach('file', `${__dirname}/test.jpg`);
        expect(imageService.saveImage).toHaveBeenCalled();
        expect(res.statusCode).toEqual(201);
        spy.mockReset();
    })

    it('should call login', async () => {
        jest.mock('fs');
        jest.spyOn(loginService, 'login');
        const res = await request(app).post('/api/auth/login');
        expect(loginService.login).toHaveBeenCalled();
    })

    it('should call register', async () => {
        const spy = jest.spyOn(bcrypt, 'hashSync').mockImplementation(function () {});
        jest.spyOn(loginService, 'register');
        const res = await request(app).post('/api/auth/register');
        expect(loginService.register).toHaveBeenCalled();
        expect(res.statusCode).toEqual(201);
        spy.mockReset();
    })

    it('should call logout', async () => {
        const res = await request(app).post('/api/auth/logout');
        expect(res.statusCode).toEqual(200);
    })

    it('should call deleteById', async () => {
        jest.spyOn(imageService, 'deleteById');
        const res = await request(app).delete('/api/delete/1');
        expect(imageService.deleteById).toHaveBeenCalled();
        expect(res.statusCode).toEqual(204);
    })
})