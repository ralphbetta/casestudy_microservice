const controller = require("../controller/bid.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.post("/bid", TokenMiddleware.verify, controller.create);
router.get("/bid/:room_id", TokenMiddleware.verify, controller.bids);




module.exports = router;
