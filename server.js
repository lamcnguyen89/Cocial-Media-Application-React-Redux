require("dotenv").config();
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const passport = require('passport');
const bodyParser = require('body-parser');
const db = require('./config/keys').MONGO_URI;
const auth = require('./routes/api/authRoute');
const profile = require('./routes/api/profileRoute');
const posts = require('./routes/api/postsRoute');

const app = express()

// Body-Parser middleware. This middleware will allow the application to pick up text inputs from the web browser and translate them to serverside requests:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

// Connect to MongoDB database through Mongoose
mongoose
    .connect(db,
        { useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true, 
            useFindAndModify: true })
    .then(()=>console.log("mongoDB successfully connected!"))
    .catch(err => console.log(err));


// Passport Middleware:
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport)

// Use Routes:
app.use('/api/auth', auth); 
app.use('/api/profiles', profile); 
app.use('/api/posts', posts); 


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));