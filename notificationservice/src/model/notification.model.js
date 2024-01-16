module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      title: {
        type: Sequelize.STRING,
      },
      details: {
        type: Sequelize.STRING,
        unique: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
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

  Notification.sync();

  return Notification;
};
