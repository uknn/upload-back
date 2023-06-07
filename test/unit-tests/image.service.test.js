const mockingoose = require('mockingoose');
const Image = require('../../models/Image');
const {
    saveImage,
    fetchImages,
    deleteById
} = require('../../services/image.service');

describe('Image service', () => {
    const id = '507f191e810c19729de860ea';
    const name = '1';
    const desc = '1';
    const contentType = 'content';
    const errorTest = 'test';

    beforeEach(() => {
        mockingoose.resetAll();
    });

    describe('fetchImages', () => {
        it ('should return the list of Images', async () => {
            const expectedData =  [
                {
                    name: name,
                    desc: desc,
                    _id: id,
                    img:
                        {
                            data: Buffer.alloc(100, '0'),
                            contentType: contentType
                        }
                }
            ]
            mockingoose(Image).toReturn(expectedData, 'find');
            const result = await fetchImages();
            expect(result[0]._doc.name).toEqual(name);
            expect(result[0]._doc.desc).toEqual(desc);
            expect(result[0]._doc.img.contentType).toEqual(contentType);
        });

        it ('should return an error', async () => {
            mockingoose(Image).toReturn(new Error(errorTest), 'find');
            const result = await fetchImages();
            expect(result).toEqual(errorTest);
        });
    });

    describe('saveImage', () => {
        const image = new Image({
            name: name,
            desc: desc,
            img:
                {
                    data: Buffer.alloc(100, '0'),
                    contentType: contentType
                }
        })

        it ('should save the image', async () => {
            mockingoose(Image).toReturn(image, 'save');
            const result = await saveImage(image);
            expect(result._doc.name).toEqual(name);
            expect(result._doc.desc).toEqual(desc);
            expect(result._doc.img.contentType).toEqual(contentType);
            expect(result._doc._id).not.toBeNull();
        });

        // Create does not throw the error withj mockingoose
       it ('should return an error', async () => {
            mockingoose(Image).toReturn(new Error(errorTest), 'save');
            const result = await saveImage(image);
            expect(result).toEqual(errorTest);
        });
    });

    describe('deleteById', () => {
        it ('should return the deleted item', async () => {
            const expectedData =  [
                {
                    name: name,
                    desc: desc,
                    _id: id,
                    img:
                        {
                            data: Buffer.alloc(100, '0'),
                            contentType: contentType
                        }
                }
            ]
            mockingoose(Image).toReturn(expectedData, 'findOneAndRemove');
            const result = await deleteById(id);
            expect(result[0]._doc.name).toEqual(name);
            expect(result[0]._doc.desc).toEqual(desc);
            expect(result[0]._doc.img.contentType).toEqual(contentType);
        });

        it ('should return an error', async () => {
            mockingoose(Image).toReturn(new Error('test'), 'findOneAndRemove');
            const result = await deleteById(id);
            expect(result).toEqual(errorTest);
        });
    });
});