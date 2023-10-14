const clients = {};

function setupChatSocket(io) {
   io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("message", (message) => {
         socket.broadcast.emit("message", message);
      });

      clients[socket.id] = socket;

      socket.on("disconnect", () => {
         console.log("Client disconnected");
         delete clients[socket.id];
      });
   });
}

module.exports = setupChatSocket;
