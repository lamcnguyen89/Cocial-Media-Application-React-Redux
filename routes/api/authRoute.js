// Routes for user login authentication
const express = require('express');
const router = express.Router();

//@route GET api/auth/test
//@desc Tests authentication route
//@access Public
router.get('/test', (req,res)=> res.json({msg: "Authentication Route Works"}))
;

module.exports = router;