// Routes for user login authentication
const express = require('express');
const router = express.Router();

router.get('/test', (req,res)=> res.json({msg: "Authentication Route Works"}))
;

module.exports = router;