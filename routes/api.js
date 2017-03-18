var express = require('express');
var router = express.Router();
var validate = require('../functions/validate.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var jwtsecret = "yUXyxqvH21vMIaWQJMkMxqdERi2kwEpzdIkAxLgmzrHWphCPPDryTfkwbgUa0E1";
// Include Schema
var Game = require('../mongodb/game-schema');
var User = require('../mongodb/user-schema');


// Middleware function to handle headers
router.use(function(req, res, next) {
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('access-control-allow-methods', 'GET, POST, PUT');
    res.header('access-control-allow-origin', '*');
    res.header('expires', new Date(Date.now()).toUTCString());
    next();
});

router.get('/', function (req, res, next) {
    res.send('API for Capillary Hiring challenge.');
});


router.get('/games', function (req, res, next) {
    Game.find({}, '', function (err, games) {
        if(err) return handleError(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
    });
});

router.post('/login', function(req, res, next) {
    // Validate the data
    var email = validate.clean(req.body.email),
        password = validate.clean(req.body.password);
    message = {};
    success = true;
    message.errorFields = [];
    message.errors = [];

    //email validation
    if (!validate.isEmail(email)) {
        success = false;
        message.errorFields.push('email');
        message.errors.push('Email is not Valid');
    }

    //password validation
    validatePassword = validate.password(password);
    if (!validatePassword.success) {
        success = false;
        message.errorFields.push('password');
        message.errors.push(validatePassword.message);
    }
    if (success === false) {
        res.json({message:message, success:success});
    }else{
        // Validate credentials and generate token
        User.findOne({ 'email': email}, 'password', function (err, person) {
            var result = {};
            if (err) {
                result.success = false;
                result.message = "An internal error occured!";
                res.json({success: false, message:result.message});
            }else if(person) {
                // User exits
                bcrypt.compare(password, person.password, function(err, compareSuccess) {
                    if (err) {
                        console.log(err);
                        result.success = false;
                        result.message = "An internal error occured!";
                        res.json({success: false, message:result.message});
                    }else if(compareSuccess){
                        result.success = true;
                        // Generate token and send to user

                        var token = jwt.sign({email: email}, jwtsecret,{
                            expiresIn: 24 * 60 * 60// expires in 24 hours
                        });
                        res.json({success: true, token:token});
                    }else{
                        result.success = false;
                        result.message = "Incorrect Password";
                        res.json({success: false, message:result.message});
                    }
                });
            }else{
                // No user found
                result.success = false;
                result.message = "User does not exists";
                res.json({success: false, message:result.message});
            }
        });
    }
});

router.post('/register', function(req, res, next) {
    console.log(req.body);
    // Validate the data
    var name = validate.clean(req.body.name),
        email = validate.clean(req.body.email),
        password = validate.clean(req.body.password);
    message = {};
    success = true;
    message.errorFields = [];
    message.errors = [];

    // name validation
    if(name.length < 1){
        success = false;
        message.errorFields.push('name');
        message.errors.push('Name is not Valid');
    }

    //email validation
    if (!validate.isEmail(email) || email.length < 5) {
        success = false;
        message.errorFields.push('email');
        message.errors.push('Email is not Valid');
    }else if (!validate.userAlreadyRegistered(email)) {
        message.errorFields.push('email');
        message.errors.push('Email is already registered');

    }
    //password validation
    validatePassword = validate.password(password);
    if (!validatePassword.success) {
        success = false;
        message.errorFields.push('password');
        message.errors.push(validatePassword.message);
    }
    if (success === false) {
        res.json({message:message, success:success});
    }else{
        // Inserting the data in the database
        User.create({
            name:name,
            email: email,
            password: password,
            added_on: validate.getCurrentTime(),
            updated_on:validate.getCurrentTime()
        }, function(err, small){
            if(err) {
                message.errorFields.push('internal error');
                message.errors.push(err);
            }
            // Successfully inserted in the database
            res.json({message:'You have registered Successfully', success:true});
        });
    }
});

module.exports = router;
