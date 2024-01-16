const {Account} = require("../model/database")
const TokenMiddleware = require("../middleware/token.middleware");
const ResponseMessage = require("../config/response");
// const SyncDB = require("../model/syncDatabase");
class Authentication {
  static async login(req, res) {
    try {
      const userInstance = await Account.findOne({
        where: { email: req.body.email },
      });

      if (!userInstance) {
        return res.status(404).json({ error: true, message: "Not Found" });
      }

      const isValidPassword = await userInstance.comparePassword(
        req.body.password
      );

      if (!isValidPassword) {
        return res
          .status(ResponseMessage.code.not_found)
          .json({ error: true, message: ResponseMessage.fail.login });
      }

      const generatedToken = TokenMiddleware.generate({
        name: userInstance.name,
        email: userInstance.email,
        id: userInstance.id,
      });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
        token: generatedToken,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async register(req, res) {
    try {
      const userInstance = await Account.create(req.body);

      const generatedToken = TokenMiddleware.generate({
        name: userInstance.name,
        email: userInstance.email,
        id: userInstance.id,
      });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
        token: generatedToken,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async profile(req, res) {
    const { id } = req.userData;

    const account =
      req.query.account_id !== undefined
        ? req.query.account_id
        : req.userData.id;

    try {
      const userInstance = await Account.findByPk(account);

      const generatedToken = TokenMiddleware.generate({
        name: userInstance.name,
        email: userInstance.email,
        id: userInstance.id,
      });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
        token: generatedToken,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async validate(req, res) {

    const { account_id } = req.params;

    try {
      const userInstance = await Account.findByPk(account_id);

      const generatedToken = TokenMiddleware.generate({
        name: userInstance.name,
        email: userInstance.email,
        id: userInstance.id,
      });

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
        token: generatedToken,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async readAll(req, res) {
    try {
      const userInstance = await Account.findAll();

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
      });
    } catch (error) {
      res.status(500).json({ error: "server error", extra: error.message });
    }
  }

  static async read() {
    try {
      const userInstance = await Account.findAll();

      return res.status(200).json({
        error: false,
        message: "Succesfull",
        data: userInstance,
      });
    } catch (error) {
      return {};
    }
  }

  static async create() {
    try {
    } catch (error) {
      return {};
    }
  }

//   static async lunchProduction(req, res) {


//     try {

//         const response = await SyncDB.run();

//        if(response){

//         const a =  await Account.create({ email: "usera@gmail.com", name: "User A", password: "1234",});
//         const b = await Account.create({ email: "userb@gmail.com", name: "User B", password: "1234", });
//         const c = await Account.create({ email: "userc@gmail.com", name: "User C", password: "1234", });
//         const d = await Account.create({ email: "userd@gmail.com", name: "User D", password: "1234", });
//         return res.status(ResponseMessage.code.success).json({ error: false, message: 'Production Lunched' });

//        }
//         return res.status(ResponseMessage.code.success).json({ error: true, message: 'Something went wrong' });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'server error', extra: error.message });
//     };

// };
}

module.exports = Authentication;
