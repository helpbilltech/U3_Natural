require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/u3db',
  JWT_SECRET: process.env.JWT_SECRET || 'u3_natural_products_secret_key_2025',
  PORT: process.env.PORT || 5000
};