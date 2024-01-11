const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
  const Bid = sequelize.define(
    "Bid",
    {
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      u_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
    },
    {
      timestamps: true,
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"],
        },
      },
    }
  );

  Bid.sync();

  return Bid;
};
