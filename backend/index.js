const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const mongoose = require("mongoose");
// const { signUp } = require("./controller/user.controller");
const { requireSignIn } = require("./middleware");
const {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
} = require("./controller/task.controller");
const {
  signIn,
  signUp,
  getUserDetails,
} = require("./controller/user.controller");
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.r48my.mongodb.net/Auth?retryWrites=true&w=majority",
    { maxPoolSize: 10 }
  )
  .then(() => {
    console.log("Database connected");
  });

const app = express();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/v1/task", requireSignIn, getTasks);
app.post("/v1/task", requireSignIn, addTask);
app.delete("/v1/task", requireSignIn, deleteTask);
app.put("/v1/task", requireSignIn, updateTask);

app.post("/v1/signIn", signIn);
app.post("/v1/signup", signUp);
app.get("/v1/user", requireSignIn, getUserDetails);

app.listen(4001, () => {
  // we can change the port
  console.log("Server started");
});