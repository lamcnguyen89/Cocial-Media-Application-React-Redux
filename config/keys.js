module.exports = {
    MONGO_URI: process.env.MONGODB_URI || process.env.DATABASE_INFO,
    JWT_SECRET: process.env.JWT_SECRET
}