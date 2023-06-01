import betterLogging from "better-logging";
import express from "express";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import fs from "fs";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { resolvePath } from "./util.js";
import { router } from "./controllers/user.controller.js";
import chat from "./controllers/chat.controller.js";
import psychologist from "./controllers/psychologist.controller.js";
import model from "./model.js";
import db from "./db.js";

dotenv.config({ path: resolvePath("server", ".env") });

const { devMode } = process.env;

let port = 443;
if (devMode === "true") {
  port = 8080;
}

const app = express();

let server;
if (devMode === "false") {
  const { caPath } = process.env;
  const options = {
    key: fs.readFileSync(path.join(caPath, "privkey.pem")),
    cert: fs.readFileSync(path.join(caPath, "cert.pem")),
  };

  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const io = new Server(server);

model.init(io);

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

// Enable debug output
console.logLevel = 4;

// Register a custom middleware for logging incoming requests
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  })
);

// Configure session management
const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});

app.use(sessionConf);
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
    saveUninitialized: true,
  })
);

// Serve static files
app.use(express.static(resolvePath("client", "dist")));

// Catch-all route that redirects all requests to the Vue.js application
app.get("*", (req, res) => {
  res.sendFile(resolvePath("client", "dist", "index.html"));
});

// Register middlewares that parse the body of the request, available under req.body property
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Bind REST controllers to /api/*
app.use("/api", router);
app.use("/api", chat.router);
app.use("/api", psychologist.router);
app.use(helmet()); // Helmet helps you secure your Express apps. Cleans the http headers

async function loadActiveUsers() {
  const dbQuery = "SELECT * FROM activeSessions";

  await db.each(dbQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    model.addUser(row.sessionUUID, row.userId);
    model.addAuthCookie(row.sessionUUID);
  });
}

loadActiveUsers();

io.on("connection", (socket) => {
  const { session } = socket.handshake;
  session.socketID = socket.id;
  session.save((err) => {
    if (err) console.error(err);
    else console.debug(`Saved socketID: ${session.socketID}`);
  });
});

if (devMode === "true") {
  server.listen(port, () => {
    console.log("Server started, not using HTTPS");
    console.log(`Listening on http://localhost:${port}/`);
  });
} else {
  server.listen(port, () => {
    console.log("Server started, using HTTPS");
    console.log(`Listening on https://localhost:${port}/`);
  });
}
