const loginService = require('../services/login.service');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


exports.login = (async (req, res) => {
    await loginService.login(req.body.username, req.body.password).then((result) => {
        if (result.status === 200) {
            req.session.token = result.token;
            res.status(result.status).send({
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
            });
        } else {
            res.status(result.status).send('Wrong credentials');
        }
    }).catch((e) => {
        res.status(500).send(e);
    });
});

exports.register = (async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    await loginService.register(user).then(() => {
        return  res.status(201).send({ message: 'User was registered successfully!' });
    }).catch(e => {
        return  res.status(500).send(e);
    });
});

exports.logout = async (req, res) => {
    req.session = null;
    return res.status(200).send({ message: 'You\'ve been signed out!' });
};