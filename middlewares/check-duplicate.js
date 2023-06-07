const User = require('../models/User');

checkDuplicate = async (req, res, next) => {
    await User.findOne({
        username: req.body.username
    }).then((user) => {
        if (user) {
            return res.status(400).send('Failed! Username is already in use!');
        }
        next();
    }).catch(e => {
        return res.status(500).send(e);
    })
};

checkEmailDuplicate = async (req, res, next) => {
    await User.findOne({
        email: req.body.email
    }).then((user, err) => {
        if (user) {
            return res.status(400).send('Failed! Email is already in use!');
        }
        next();
    }).catch(e => {
        return res.status(500).send(e);
    });
}

module.exports = { checkDuplicate, checkEmailDuplicate };