const model = require("../Model/liveSession.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket:", socket.id);

    socket.on("join_exam", ({ examCode, userId }) => {
      socket.join(`exam_${examCode}`);
    });

    socket.on("join_admin", ({ examCode }) => {
      socket.join(`admin_${examCode}`);
    });

    socket.on("exam_event", async ({ examCode, userId, type, reason }) => {
      await model.upsertSession(examCode, userId, type);

      io.to(`admin_${examCode}`).emit("admin_event", {
        userId,
        type,
        reason,
      });
    });
  });
};
