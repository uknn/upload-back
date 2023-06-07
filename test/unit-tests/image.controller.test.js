const {
    create,
    load,
    deleteImage
} = require('../../controllers/image.controller')
const imageService = require('../../services/image.service');
const fs = require('fs');

describe('Image controller', () => {
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
        }
    }

    beforeEach(() => {
        res = {
            json: jest.fn(),
            send: jest.fn().mockImplementation(() => {}),
            status: jest.fn().mockImplementation(() => res)
        };
    });

    describe('load', () => {
        it ('should call fetchImage', async () => {
            const expectedValue = { test: 'test' };
            jest.spyOn(imageService, 'fetchImages').mockReturnValue(Promise.resolve(expectedValue));
            await load(req, res);
            expect(imageService.fetchImages).toHaveBeenCalledWith(req.query.userId)
            expect(res.json).toHaveBeenCalledWith({data: expectedValue});
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it ('should return a 500', async () => {
            jest.spyOn(imageService, 'fetchImages').mockRejectedValue(new Error('error'));
            await load(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteImage', () => {
        it ('should call deleteById', async () => {
            const expectedValue = { test: 'test' };
            jest.spyOn(imageService, 'deleteById').mockReturnValue(Promise.resolve(expectedValue));
            await deleteImage(req, res);
            expect(imageService.deleteById).toHaveBeenCalledWith('5aa06bb80738152cfd536fdc')
            expect(res.json).toHaveBeenCalledWith({data: expectedValue});
            expect(res.status).toHaveBeenCalledWith(204);
        });

        it ('should return a 500', async () => {
            jest.spyOn(imageService, 'deleteById').mockRejectedValue(new Error('error'));
            await deleteImage(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create', () => {
        let parameter;
        beforeEach(() => {
            parameter = {
                name: 'filename',
                desc: 'originalname',
                img: {
                    data: undefined,
                    contentType: 'image/png'
                },
                user: '5aa06bb80738152cfd536fdc'
            }
            jest.mock('fs');
            jest.spyOn(fs, 'readFileSync').mockImplementation(function () {});
        })

        it ('should call saveImage', async () => {
            const expectedValue = { test: 'test' };
            jest.spyOn(imageService, 'saveImage').mockReturnValue(Promise.resolve(expectedValue));
            await create(req, res);
            expect(imageService.saveImage).toHaveBeenCalled()
            expect(res.send).toHaveBeenCalledWith(expectedValue);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it ('should return a 500', async () => {
            jest.spyOn(imageService, 'saveImage').mockRejectedValue(new Error('error'));
            await create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});