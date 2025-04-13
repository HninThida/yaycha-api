// // wsRouter.js
const express = require("express");
const expressWs = require("express-ws");
const jwt = require("jsonwebtoken");

const router = express.Router();
expressWs(router); // 👈 this is key

const secret = process.env.JWT_SECRET;
let clients = [];

router.ws("/subscribe", (ws, req) => {
  console.log("WS: New connection received");

  ws.on("message", (msg) => {
    try {
      const { token } = JSON.parse(msg);
      console.log("WS: token received");

      jwt.verify(token, secret, (err, user) => {
        if (err) {
          console.error("WS: Invalid token");
          return;
        }

        clients.push({ userId: user.id, ws });
        console.log(`WS: Client added: ${user.id}`);
      });
    } catch (e) {
      console.error("WS: Error parsing message", e);
    }
  });

  ws.on("close", () => {
    clients = clients.filter((c) => c.ws !== ws);
    console.log("WS: Connection closed, client removed");
  });
});

module.exports = { clients, wsRouter: router };
// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET;

// let clients = [];
// router.ws("/subscribe", (ws, req) => {
//   console.log("WS: New connection received");
//   ws.on("message", (msg) => {
//     const { token } = JSON.parse(msg);
//     console.log("WS: token received");
//     jwt.verify(token, secret, (err, user) => {
//       if (err) return false;
//       clients.push({ userId: user.id, ws });
//       console.log(WS: Client added: ${user.id});
//     });
//   });
// });
// module.exports = { clients, wsRouter: router };
