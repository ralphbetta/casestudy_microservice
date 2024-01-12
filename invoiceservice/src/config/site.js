const dotenv = require('dotenv');
dotenv.config();

class Config {
  static site = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.PORT,
    DBPORT: process.env.DB_PORT,
    DB: process.env.DB_NAME,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}


module.exports = Config;