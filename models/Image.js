const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: {
            data: Buffer,
            contentType: String
    },
    user: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Image', imageSchema);