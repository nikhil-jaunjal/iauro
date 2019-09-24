const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/UserModel');
const {
    validationResult
} = require('express-validator');
const config = require('../config.json');

exports.signup = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }
    user.find({
            email: req.body.email
        })
        .exec()
        .then(response => {
            if (response.length > 0) {
                res.status(409).json({
                    errorMessage: 'email already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const User = new user({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        });
                        User.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "user created",
                                    firstName: result.firstName,
                                    lastName: result.lastName,
                                    email: result.email
                                });
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.login = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }

    var token;
    user.find({
            email: req.body.email
        })
        .exec()
        .then(result => {
            if (result.length != 1) {
                res.status(401).json({
                    errorMessage: 'Auth failed, please check your email and password'
                });
            }
            bcrypt.compare(req.body.password, result[0].password, (err, success) => {
                if (!success) {
                    res.status(401).json({
                        errorMessage: 'Auth failed, please check your email and password'
                    });
                }
                if (success) {
                    token = jwt.sign({
                            email: result[0].email,
                            userId: result[0]._id
                        },
                        config.env.JWT_KEY, {
                            expiresIn: "10h"
                        }
                    );
                    res.status(200).json({
                        message: 'login success',
                        _id: result[0]._id,
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        email: result[0].email,
                        jwt: token
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                errorMessage: 'Auth failed, please check your email and password'
            });
        });
}

exports.showAllUsers = (req, res) => {

    user.find()
        .exec()
        .then(result => {
            res.status(200).json({
                users: result
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unable to fetch user data",
                error: err
            });
        });
}

exports.updateUser = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }
    const updatedUser = req.body;
    user.update({
            _id: req.params.id
        }, updatedUser)
        .then(result => {
            res.status(200).json({
                message: "user data updated successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unale to update user data",
                error: err
            })
        });
}

exports.deleteUser = (req, res) => {

    user.findOneAndDelete({
            _id: req.params.id
        })
        .then(result => {
            (result == null ? res.status(403).json({
                message: "user not exists in database",
            }) : res.status(202).json({
                message: "user data deleted",
            }));
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: err
            })
        });
}