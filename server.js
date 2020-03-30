let express = require("express");
let serv = express();
let morgan = require("morgan");
let router = require("./router");

serv.use(express.static("public"));
serv.use(morgan("dev"));
serv.use("/",router);
serv.listen(3000);

