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
  host: "127.0.0.1",
  user: "root",
  password: "123",
  port: "3306",
  database: "nodejs_DB",
};

let SMS = new session_mysql_save(dbInfo);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.listen(3001);
