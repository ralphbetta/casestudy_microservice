const controller = require("../controller/authentication.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.get("/", controller.readAll);
router.get("/profile", TokenMiddleware.verify, controller.profile);
router.get("/validate/:account_id", controller.validate);
router.post("/register", controller.register);
router.post("/login", controller.login);
// router.post("/lunch", controller.lunchProduction);

module.exports = router;
