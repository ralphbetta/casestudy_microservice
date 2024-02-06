module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      invoice_id: {
        type: Sequelize.STRING,
      },
      auction_id: {
        type: Sequelize.STRING,
      },
      vendor: {
        type: Sequelize.STRING,
        unique: false,
      },
      auction: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Pending",
      },
      auction_date:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      auction_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bidder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bidder_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bidder_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      vendor_id: {
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

  // Invoice.sync();

  return Invoice;
};
