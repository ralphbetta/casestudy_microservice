const controller = require("../controller/invoice.controller");
const TokenMiddleware = require('../middleware/token.middleware');

const router = require("express").Router();

router.get("/invoice/", TokenMiddleware.verify, controller.invoices);




module.exports = router;
