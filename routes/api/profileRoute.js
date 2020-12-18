// Routes for showing social media user information like bio, birth date, etc... to other users of this social media application

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model:
const Profile = require('../../models/Profile');
// Load User Model:
const User = require('../../models/User');

//@route GET api/profiles/test
//@desc Tests profiles route
//@access Public
router.get('/test', (req,res)=> res.json({msg: "Profiles Route Works"}));

//@route GET api/profiles
//@desc Get current logged in user's profile
//@access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err=>res.status(404).json(err))
});

module.exports = router;