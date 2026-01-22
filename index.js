// Load environment variables
require("dotenv").config();

// Core modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http"); // ✅ IMPORTANT
const { Server } = require("socket.io"); // ✅ IMPORTANT

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PostgreSQL
require("./Model/postgressdb");

// Routes
const organizationroutes = require("./Route/organizationroutes");
const testtakerroute = require("./Route/testtaker");
const demoRoutes = require("./Route/demo");
const submitdemo = require("./Route/demosubmit");
const authRoutes = require("./Route/authRoutes");
const examRoute = require("./Route/examRoutes");
const scheduledRoute = require("./Route/scheduledExamRoutes");
const candidates = require("./Route/candidateRoutes")
const sendexamlink = require("./Route/examLinkRoutes")
const examvalidate = require("./Route/examLinkvalidationcheck")
const examsubmit  = require('./Route/examSubmitRoutes')

// -------------------- MIDDLEWARES -------------------- //

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://talent-frontend-design.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// -------------------- ROUTES -------------------- //

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationroutes);
app.use("/api/testtakerdemo", testtakerroute);
app.use("/api/demotest", demoRoutes);
app.use("/api/demo-submit", submitdemo);
app.use("/api", examRoute);
app.use("/api", scheduledRoute);
app.use("/api/",candidates)
app.use("/api",sendexamlink)
app.use("/api",examvalidate)
app.use("/api",examsubmit)


app.get("/", (req, res) => {
  res.send("🚀 Server Running Successfully");
});

// -------------------- SOCKET.IO SETUP -------------------- //

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ Socket events
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // ADMIN JOIN
  socket.on("join_admin", ({ examCode }) => {
    if (!examCode) {
      console.log("❌ Admin joined without examCode");
      return;
    }

    socket.join(`admin_${examCode}`);
    console.log("🛡 Admin joined exam:", examCode);
  });

  // STUDENT JOIN
  socket.on("join_exam", ({ examCode, userId }) => {
    if (!examCode || !userId) return;

    socket.join(`exam_${examCode}`);
    console.log(`👨‍🎓 Student ${userId} joined ${examCode}`);
  });

  socket.on("exam_event", (data) => {
    if (!data.examCode) return;

    // send to admin room
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
