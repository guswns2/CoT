const express = require("express");
const app = express();
const router = require("./src/router/router");
const bodyParser = require("body-parser");
const session = require("express-session");
const session_mysql_save = require("express-mysql-session");

const path = require("path");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "build")));

app.use(express.json());
app.use(cors());

let dbInfo = {
  host: "project-db-stu.ddns.net",
  user: "cot",
  password: "sion1234",
  port: "3307",
  database: "cot",
};

let SMS = new session_mysql_save(dbInfo);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.listen(3001, () => {
  console.log("Server is running. Port: 3001")
});
