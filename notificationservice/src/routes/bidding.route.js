const controller = require("../controller/notification.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.get("/notifications", TokenMiddleware.verify, controller.notifications);


module.exports = router;
