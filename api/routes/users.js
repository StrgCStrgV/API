const express = require('express');
const mongoose = require('mongoose');
const { response } = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', (req, res, next) => { 
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log("hash error");
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "user created"
                        });
                    })
                    .catch( err => {
                        console.log("user not created :",err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
    .catch( err => {
        console.log("Fuk");
        res.status(500).json({
            error: err
        })
    })
});

router.post('/login',(req, res, next) => {
    User.findOne({ email: req.body.email}).exec()
        .then(user =>{
            if(user.length < 1){
                console.log("auth failed, user not found");
                return res.status(500).json({
                    message: 'auth failed'
                });
            }else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if(!result){
                        console.log('auth failed, password failed');
                        return res.status(500).json({
                            message: 'auth failed'
                        });
                    }else {
                        console.log('auth suceeded, password correct');
                        const token = jwt.sign(
                        { 
                            userId: user._id,
                            email: user.email
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        user.token = token;
                        return res.status(200).json({
                            message: 'auth success, token delivered',
                            token: token
                        })

                    }
                })
            }
        })
        .catch( err => {
            console.log("login failed, mail not found");
            res.status(500).json({
                message:"auth failed, mail not found",
                error: err
            })
        })
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    user.deleteOne({id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "user deleted"
        })
    })
    .catch( err =>{
        console.log("deleted failed"),
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;