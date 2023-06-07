const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


exports.login = (username, password) => User.findOne({ username: username })
    .then((data)=>{
        let status = 200;

        let passwordIsValid = false;
        let token = '';

        if (!data) {
            status = 404;
        } else {
            passwordIsValid = bcrypt.compareSync(
                password,
                data.password
            );

            if (!passwordIsValid) {
                status = 401
            }

            token = jwt.sign({ id: data.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });
        }

        return {
            token,
            status,
            user: {
                id: data?._id || '',
                username: data?.username || '',
                email: data?.email || '',
            }
        }
    }).catch(err => {
        return err.message;
    });

exports.register = async (user) => {
    return await user.save()
        .then((data)=>{
            return data;
        }).catch(err => {
            return err.message;
    });
}

exports.findUser = () => User.find({})
    .then((data, err)=>{
        return data;
    }).catch(err => {
        return err.message;
    });

