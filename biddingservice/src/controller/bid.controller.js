const { Bid } = require("../model/database");
const TokenMiddleware = require("../middleware/token.middleware");
const ResponseMessage = require("../config/response");

class BidController {

  static async create(req, res) {
    try {
      
      const body = {
        name: req.userData.name,
        email: req.userData.email,
        u_id: req.userData.id,
        amount: req.body.amount,
        room_id: req.body.room_id
      };

      const existingBid = await Bid.findOne({where: {room_id: body.room_id, email: body.email}});

      const maxBidForRoom = await Bid.max('amount', { where: { room_id: body.room_id } });

      if (maxBidForRoom && body.amount <= maxBidForRoom) {
        return res.status(400).json({
          error: true,
          message: "Bid amount should be greater than the existing maximum bid amount for the room",
        });
      }

      if(existingBid){

        existingBid.amount = body.amount;
        const response = await existingBid.save(); 

        return res.status(200).json({
          error: false,
          message: "Updated Succesfull",
          data: response,
        });

      }

      const bidInstance = await Bid.create(body);

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: bidInstance,
      });

      // stream to notification service

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }


  static async bids(req, res) {
    const { room_id } = req.params;

    try {

      const maxBidForRoom = await Bid.max('amount', { where: { room_id: room_id } });

      const bidInstances = await Bid.findAll({
        where: { room_id },
      });

      const response = {
        maxBid: maxBidForRoom,
        bids: bidInstances
      }

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: response,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }


}

module.exports = BidController;
