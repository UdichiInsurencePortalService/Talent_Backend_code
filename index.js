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
    "http://localhost:5175",
  "https://talent-frontend-design.vercel.app",
  "https://talent-admin-beta.vercel.app",
  "https://talent-admin-p317od7vx-udichiinsurenceportalservices-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// -------------------- BODY PARSERS -------------------- //
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// -------------------- STATIC -------------------- //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api", require("./Route/liveSessionroutes"));
app.use("/api", require("./Route/examsubmitroute"));


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

// ✅ LOAD SOCKET HANDLER HERE (AFTER io EXISTS)
require("./socket/socket")(io);

// -------------------- START SERVER -------------------- //
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
