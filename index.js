// Load environment variables
require("dotenv").config();

// Core modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PostgreSQL
require("./Model/postgressdb");

// -------------------- CORS CONFIG -------------------- //
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://talent-frontend-design.vercel.app",
  "https://talent-admin-beta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------------------- BODY PARSERS -------------------- //
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// -------------------- 🔥 STATIC UPLOADS (IMPORTANT) -------------------- //
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// -------------------- ROUTES -------------------- //
app.use("/api/auth", require("./Route/authRoutes"));
app.use("/api/organizations", require("./Route/organizationroutes"));
app.use("/api/testtakerdemo", require("./Route/testtaker"));
app.use("/api/demotest", require("./Route/demo"));
app.use("/api/demo-submit", require("./Route/demosubmit"));
app.use("/api", require("./Route/examRoutes"));
app.use("/api", require("./Route/scheduledExamRoutes"));
app.use("/api", require("./Route/candidateRoutes"));
app.use("/api", require("./Route/examLinkRoutes"));
app.use("/api", require("./Route/examLinkvalidationcheck"));
app.use("/api", require("./Route/examSubmitRoutes"));
app.use("/api", require("./Route/attendanceRoutes"));


app.get("/", (req, res) => {
  res.send("🚀 Server Running Successfully");
});

// -------------------- SOCKET.IO -------------------- //
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join_admin", ({ examCode }) => {
    if (!examCode) return;
    socket.join(`admin_${examCode}`);
  });

  socket.on("join_exam", ({ examCode, userId }) => {
    if (!examCode || !userId) return;
    socket.join(`exam_${examCode}`);
  });

  socket.on("exam_event", (data) => {
    if (!data.examCode) return;
    io.to(`admin_${data.examCode}`).emit("admin_event", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// -------------------- START SERVER -------------------- //
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
