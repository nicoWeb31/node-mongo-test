const express = require("express");
const serv = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/biblio",{useNewUrlParser:true,useUnifiedTopology:true});




serv.use(express.static("public"));
serv.use(morgan("dev"));
serv.use(bodyParser.urlencoded({extended:false}));
serv.use("/",router);
serv.listen(3000);

