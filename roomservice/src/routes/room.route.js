const controller = require("../controller/room.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.post("/room", TokenMiddleware.verify, controller.create);
router.put("/room/:room_id", TokenMiddleware.verify, controller.updateRoom);
router.post("/room/:room_id", TokenMiddleware.verify, controller.joinRoom);
router.get("/participants", TokenMiddleware.verify, controller.participants);



module.exports = router;
