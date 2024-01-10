const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./src/config/site");

// const appRouther = require("./routes/app.routes");

const Connection = require("./src/model/database");
const Config = require("./src/config/site");
// const SocketService = require("./service/socket.service");

class Server {
  static boot() {
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      preflightContinue: false,
      transports: ['websocket'],
    };

    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    /*----------------------< DEFAULT ROUTE >----------------*/

    app.use(express.static(path.join(__dirname, "/public")));
    app.get("/", (req, res) => { res.json(`Bidding Service running....`)});

    const PORT = config.site.PORT;
    const DBPORT = Config.site.DBPORT;
    const IP = config.site.HOST;

    Connection.sync()
      .then((result) => {
        console.log("Database connected! Running Server");

        const server = app.listen(PORT, () => {
          console.log(`Server is running http://${IP}:${PORT} PSQL:${DBPORT}`);
        });

      })
      .catch((err) => console.log("Connection Error", err));
  }
}

Server.boot();
