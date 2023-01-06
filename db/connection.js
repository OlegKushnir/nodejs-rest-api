const mongoose = require("mongoose");
require('dotenv').config();

const connectMongo = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(
      process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connection successful');
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = {
    connectMongo
}
