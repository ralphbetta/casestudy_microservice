const { Bid } = require("../model/database");
const ResponseMessage = require("../config/response");

class Controller {

  static async notifications(req, res) {
    const { room_id } = req.params;

    try {

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: [],
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }


}

module.exports = Controller;
