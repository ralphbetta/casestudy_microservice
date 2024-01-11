const controller = require("../controller/room.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.post("/room", TokenMiddleware.verify, controller.create);
router.put("/room/:room_id", TokenMiddleware.verify, controller.updateRoom);
router.post("/room/:room_id", TokenMiddleware.verify, controller.joinRoom);
router.get("/room/:room_id/participants", TokenMiddleware.verify, controller.participants);
router.get("/rooms", TokenMiddleware.verify, controller.rooms);




module.exports = router;
