module.exports = (sequelize, Sequelize) => {
  const Participant = sequelize.define(
    "Participant",
    {
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: false,
      },
      u_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

  Participant.sync();

  return Participant;
};
