require("dotenv").config();
const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const auth = require('./routes/api/authRoute');
const profile = require('./routes/api/profilesRoute');
const posts = require('./routes/api/postsRoute');

const app = express()

//DB Config
const db = require('./config/keys').MONGO_URI;
// Connect to MongoDB database through Mongoose
mongoose
    .connect(db)
    .then(()=>console.log("mongoDB successfully connected!"))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Death!!!!!'));

// Use Routes:
app.use('/api/auth', auth); // Route for login authentication 
app.use('/api/profile', profile); // Route to display Social Media User Profiles
app.use('/api/posts', posts); // Route for letting users post information


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));