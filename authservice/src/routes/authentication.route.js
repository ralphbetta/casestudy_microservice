const controller = require("../controller/authentication.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.get("/", controller.readAll);
router.get("/profile", TokenMiddleware.verify, controller.profile);
router.post("/register", controller.register);
router.post("/login", controller.login);

// // router.get('/:userId', controller.getUser);
// // router.post('/', controller.createUser);
// // router.put('/:userId', controller.updateUser);
// // router.delete('/:userId', controller.deleteUser);

module.exports = router;
