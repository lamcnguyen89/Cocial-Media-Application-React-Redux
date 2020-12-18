// Routes for user login authentication
const express = require('express');
const router = express.Router();

// Module for processing an email:
const gravatar = require('gravatar');

//Module to encrypt the password so it doesn't just show up in the database in plain form:
const bcrypt = require('bcryptjs');

// Load user Model:
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation:
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


//@route GET api/auth/test
//@desc Tests authentication route
//@access Public
router.get('/test', (req,res)=> res.json({msg: "Authentication Route Works"}))
;

//@route GET api/auth/register
//@desc registers user
//@access Public
router.post('/register', (req,res)=> {
    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors)
            } else {

                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'r', // Rating
                    d: 'mm' //Default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                // BCrypt used to encrypt the password text as it is entered into the user database so that it isn't plainly visible to anyone who has access to the database.
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        });
});

//@route GET api/auth/login
//@desc Logs in the User / Returns JWT Token
//@access Public
router.post('/login', (req,res)=>{
    const {errors, isValid} = validateLoginInput(req.body);

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email:
    User.findOne({email})
        .then(user =>{
            // Check for user:
            if(!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            // Check Password:
            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // User is matched:
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        // Sign Token:
                        jwt.sign(
                            payload, 
                            keys.JWT_SECRET, 
                            {expiresIn: 3600}, 
                            (err, token) => {
                                if(err) throw err
                                res.json({
                                    success: true,
                                    token: 'Bearer' + token
                                })
                        });
                    } else {
                        errors.password = 'Incorrect Password'
                        return res.status(400).json(errors)
                    }
                })

        })
})

//@route GET api/auth/current
//@desc Return current user
//@access Private
router.get('/current', passport.authenticate('jwt', {session:false}), (req, res) =>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;