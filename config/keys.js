module.exports = {
  MONGO_URI: process.env.PRODUCTION || process.env.DEVELOPMENT,
  secretOrKey: process.env.JWT_SECRET
};
