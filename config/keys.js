// module.exports = {
//     MONGO_URI: 'mongodb://localhost/socialmedia',
//     secretOrKey: 'secret'
//   };
module.exports = {
    MONGO_URI: process.env.MONGODB_URI || process.env.DATABASE_INFO,
    secretOrKey: process.env.JWT_SECRET
}