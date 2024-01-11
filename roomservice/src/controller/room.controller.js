const { Room, Participant } = require("../model/database");
const TokenMiddleware = require("../middleware/token.middleware");
const ResponseMessage = require("../config/response");
const RabbitMQ = require("../service/rabbitmq.service");
const AppService = require("../config/service");

class RoomController {

  static async create(req, res) {
    try {

      const body = {name: req.userData.name, u_id: req.userData.id, auction: req.body.auction};

      const roomInstance = await Room.create(body);

      console.log(req.userData);

      const ParticipantInstance = await Participant.create({
        name: req.userData.name,
        email: req.userData.email,
        u_id: req.userData.id,
        room_id: roomInstance.id,
      });

      RabbitMQ.sendToQueue(AppService.NOTIFICATION, {type: "ROOMCREATE", data: roomInstance });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: roomInstance,
      });
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async joinRoom(req, res) {

    const { id } = req.userData;
    const { room_id } = req.params;

    try {
      const roomInstance = await Room.findByPk(room_id);

      if (!roomInstance) {
        return res
          .status(ResponseMessage.code.not_found)
          .json({ error: true, message: "Room Not Found" });
      }

      if (roomInstance.status == "closed") {
        return res
          .status(ResponseMessage.code.not_found)
          .json({ error: true, message: "Room Closed" });
      }

      const existingParticipant = await Participant.findOne({
        where: { email: req.userData.email, room_id: room_id },
      });


      if (existingParticipant) {
        return res.status(200).json({
          error: true,
          message: "Succesfull - Already Joined",
          data: existingParticipant,
        });
      }

      const ParticipantInstance = await Participant.create({
        name: req.userData.name,
        email: req.userData.email,
        u_id: req.userData.id,
        room_id: room_id,
      });

      RabbitMQ.sendToQueue(AppService.NOTIFICATION, {type: "ROOMJOIN", data: roomInstance });

      //socket notification

      return res.status(200).json({
        error: false,
        message: "Succesfull - Joined",
        data: ParticipantInstance,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async participants(req, res) {

    const { room_id } = req.params;

    try {
      const participantInstance = await Participant.findAll({where: {room_id}});

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: participantInstance,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async rooms(req, res) {

    try {
      const roomInstances = await Room.findAll({
        order: [['createdAt', 'DESC']] // Order by createdAt in descending order
    });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: roomInstances,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async updateRoom(req, res) {

    const { id } = req.userData;
    const { room_id } = req.params;

    try {
      const roomInstance = await Room.findByPk(room_id);

      if (!roomInstance) {
        return res
          .status(ResponseMessage.code.not_found)
          .json({ error: true, message: "Room Not Found" });
      }

      if (roomInstance.status == "closed") {
        return res
          .status(ResponseMessage.code.not_found)
          .json({ error: true, message: "Room Closed" });
      }

      if (roomInstance.u_id != req.userData.id) {
        return res
          .status(ResponseMessage.code.unauthorized)
          .json({ error: true, message: "Unauthorized Action" });
      }

      RabbitMQ.sendToQueue(AppService.NOTIFICATION, {type: "ROOMUPDATE", data: roomInstance });

      const response = await roomInstance.update({status: req.body.status});

      //socket notification

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: response,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

}

module.exports = RoomController;
