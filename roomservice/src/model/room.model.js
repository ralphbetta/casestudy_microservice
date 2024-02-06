module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define(
    "Room",
    {
      name: {
        type: Sequelize.STRING,
      },
      auction: {
        type: Sequelize.STRING,
        unique: false,
      },
      category: {
        type: Sequelize.STRING,
        unique: false,
      },
      description: {
        type: Sequelize.STRING,
        unique: false,
      },
      min_auction: {
        type: Sequelize.STRING,
        unique: false,
      },
      u_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        unique: false,
        defaultValue: 'waiting',

      },
  
      //participants
      //bids - another service
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

  // Room.sync();

  return Room;
};
