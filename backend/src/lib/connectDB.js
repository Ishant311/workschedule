const mongoose = require('mongoose');

const connectDB = async (dbURI) => {
  try {
    await mongoose.connect(dbURI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); 
  }
}
module.exports = connectDB;