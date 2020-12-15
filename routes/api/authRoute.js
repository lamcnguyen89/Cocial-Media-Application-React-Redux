// Routes for user login authentication
const express = require('express');
const router = express.Router();

// Module for processing an email:
const gravatar = require('gravatar');

//Module to encrypt the password so it doesn't just show up in the database in plain form:
const bcrypt = require('bcryptjs');

// Load user Model:
const User = require('../../models/User');


//@route GET api/auth/test
//@desc Tests authentication route
//@access Public
router.get('/test', (req,res)=> res.json({msg: "Authentication Route Works"}))
;

//@route GET api/auth/register
//@desc registers user
//@access Public
router.post('/register', (req,res)=> {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({message: 'Email already exists!'})
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


module.exports = router;