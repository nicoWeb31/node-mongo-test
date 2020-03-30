const express = require("express");
const serv = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/biblio",{useNewUrlParser:true,useUnifiedTopology:true});
const livresShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    titre:String,
    autheur:String,
    nbrePages:Number
});
const livresModel = mongoose.model("livre",livresShema);
livresModel.find()
    .exec()
    .then(livres => 
        console.log(livres)
        )
    .catch();    


serv.use(express.static("public"));
serv.use(morgan("dev"));
serv.use("/",router);
serv.listen(3000);

