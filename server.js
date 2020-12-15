require("dotenv").config();
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const db = require('./config/keys').MONGO_URI;
const auth = require('./routes/api/authRoute');
const profile = require('./routes/api/profilesRoute');
const posts = require('./routes/api/postsRoute');

const app = express()

// Connect to MongoDB database through Mongoose
mongoose
    .connect(db)
    .then(()=>console.log("mongoDB successfully connected!"))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Death!!!!!'));

// Use Routes:
app.use('/api/auth', auth); 
app.use('/api/profiles', profile); 
app.use('/api/posts', posts); 


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));