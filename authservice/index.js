const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./src/config/site");
const User = require("./src/model/account.model");
const amqp = require("amqplib");

const {db} = require("./src/model/database");
const CONFIG = require("./src/config/site");
const router = require("./src/routes/authentication.route");
const RabbitMQ = require("./src/service/rabbitmq.service");
const AppService = require("./src/config/service");

class Server {
  static boot() {
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      preflightContinue: false,
      transports: ["websocket"],
    };

    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    RabbitMQ.connect(AppService.AUTHENTICATION);

    /*----------------------< DEFAULT ROUTE >----------------*/

    app.use(express.static(path.join(__dirname, "/public")));

    app.get("/", (req, res) => {

      const data = {name: "Xena", userEmail: "xena@gmail.com"};
      RabbitMQ.sendToQueue("AUTHENTICATION", data);

      res.json(`Authentication Service Running....`);

    });

    app.use("/api", router);

    /*----------------------< HANDLING ERROR >----------------*/

    app.use((error, req, res, next) => {
      console.log(error);
      const status = error.statusCode || 500;
      const message = error.message;
      res.status(status).json({ message: message });
    });

    const PORT = config.site.PORT;
    const DBPORT = CONFIG.site.DBPORT;
    const IP = config.site.HOST;

    db.sequelize.sync()
      .then((result) => {
        console.log("Authentication Database connected!");

        const server = app.listen(PORT, () => {
          console.log(`Server running @ http://${IP}:${PORT} PSQL:${DBPORT}`);
        });
      })
      .catch((err) => console.log("Connection Error", err));
  }
}

Server.boot();
