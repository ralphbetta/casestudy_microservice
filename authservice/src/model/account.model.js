const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("./database");

const Account = db.define("account", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
});

Account.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

Account.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Account.prototype.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

Account.beforeBulkCreate(async (users, options) => {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

Account.sync();

module.exports = Account;
