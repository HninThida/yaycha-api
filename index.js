const express = require("express");
const app = express();
require("express-ws")(app);
const cors = require("cors");
const prisma = require("./prismaClient");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const { contentRouter } = require("./routers/content");
const { userRouter } = require("./routers/user");
const { wsRouter } = require("./routers/ws");
app.use("/content", contentRouter);
app.use("/", userRouter);
app.use("/", wsRouter);

app.get("/info", (req, res) => {
  res.json({ msg: "Yaycha API" });
});

app.listen(8000, () => {
  console.log("Yaycha API started at 8000...");
});

// const server = app.listen(8000, () => {
//   console.log("Yaycha API started at 8000...");
// });

// const gracefulShutdown = async () => {
//   await prisma.$disconnect();
//   server.close(() => {
//     console.log("Yaycha API closed.");
//     process.exit(0);
//   });
// };
// process.on("SIGTERM", gracefulShutdown);
// process.on("SIGINT", gracefulShutdown);
