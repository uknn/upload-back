const Image = require('../models/Image');

exports.fetchImages = (userId) => Image.find({ user: userId })
    .then((data)=>{
        return data;
    }).catch(err => {
        return err.message;
    });

exports.saveImage = async (image) => {
    return await image.save(image)
        .then((value) => {
            return value;
        }).catch(err => {
        return err.message;
    });
}

exports.deleteById = (id) => Image.findOneAndRemove({ _id: id })
    .then((data)=>{
        return data;
    }).catch(err => {
        return err.message;
    });
