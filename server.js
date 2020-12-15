require("dotenv").config();
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");


const app = express()

//DB Config
const db = require('./config/keys').MONGO_URI;
// Connect to MongoDB database through Mongoose
mongoose
    .connect(db)
    .then(()=>console.log("mongoDB successfully connected!"))
    .catch(err => console.log(err));
app.get('/', (req, res) => res.send('Death!!!!!'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));