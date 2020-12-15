// Routes for showing social media user information like bio, birth date, etc... to other users of this social media application

const express = require('express');
const router = express.Router();

router.get('/test', (req,res)=> res.json({msg: "Profiles Route Works"}))
;

module.exports = router;