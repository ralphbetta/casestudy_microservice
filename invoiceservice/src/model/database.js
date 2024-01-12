const Sequelize = require("sequelize");
const CONFIG = require("../config/site");

const sequelize = new Sequelize(
  CONFIG.site.DB,
  CONFIG.site.USER,
  CONFIG.site.PASSWORD,
  {
    host: CONFIG.site.HOST,
    port: CONFIG.site.DBPORT,
    dialect: CONFIG.site.dialect,
    operatorsAliases: 0,
    pool: {
      max: CONFIG.site.pool.max,
      min: CONFIG.site.pool.min,
      acquire: CONFIG.site.pool.acquire,
      idle: CONFIG.site.pool.idle,
    },
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Invoice = db.invoices = require('./invoice.model')(sequelize, Sequelize);


module.exports = {db, Invoice};
