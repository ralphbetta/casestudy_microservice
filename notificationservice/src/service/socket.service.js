class SocketService {

  static initialize(server, app) {

    const io = require('socket.io')(server, {
      cors: {
        origin: "*",
        methods: ['GET', 'POST']
      }
    });

    global.io = io;
    app.set('io', io);

    io.use(async (socket, next) => {
      if (socket.handshake.query) {
        let userId = socket.handshake.query.userId;
        socket.userId = userId;

        if (!userId) {
          next(new Error('No userId provided'));
          return;
        }

        next();
      }
    });

    io.on("connection", (socket) => {

      const connectionMessage = `connection with user Id ${socket.userId} and socket id ${socket.id} is successful`;
      const disconnectMessage = `connection with user Id ${socket.userId} and socket id ${socket.id} is lost!`;

      socket.join(socket.userId);

      /*-----------------------------------------------
      Either this can work for direct emiting
      --------------------------------------------------*/
      // socket.to(socket.userId).emit('update', connectionMessage) //not working
      io.to(socket.userId).emit('update', connectionMessage); //tell owner of id

      socket.on("disconnect", () => {
        socket.broadcast.emit('update', disconnectMessage); //all except yourself
        socket.leave(socket.userId);
        socket.userId = null;
        socket.removeAllListeners();

      });

    });

  }


}

module.exports = SocketService;