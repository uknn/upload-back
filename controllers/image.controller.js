const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const imageService = require('../services/image.service');
const Image = require('../models/Image');

exports.load = asyncHandler(async (req, res) => {
    await imageService.fetchImages(req.query.userId).then((data) => {
        res.status(200).json({ data });
    }).catch(e => {
        res.status(500).send(e);
    });
});

exports.create = asyncHandler(async (req, res) => {
    const image  = new Image({
        name: req.file.filename,
        desc: req.file.originalname,
        img: {
            data: fs.readFileSync(path.join('D:/dev/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        user: req.query.userId
    })
    await imageService.saveImage(image).then((result) => {
        res.status(201).send(result);
    }).catch(e => {
        res.status(500).send(e);
    })
});

exports.deleteImage = asyncHandler(async (req, res) => {
    await imageService.deleteById(req.params.id).then((data) => {
        res.status(204).json({ data });
    }).catch(e => {
        res.status(500).send(e);
    });
});