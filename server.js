const express = require("express");
const serv = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
serv.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
mongoose.connect("mongodb://localhost:27017/biblio",{useNewUrlParser:true,useUnifiedTopology:true});




serv.use(express.static("public"));
serv.use(morgan("dev"));
serv.use(bodyParser.urlencoded({extended:false}));
serv.set('trust proxy',1);
serv.use((req,rep,suite) =>{
    rep.locals.message = req.session.message;
    delete req.session.message;                 //supression de la variable de session
    suite();
})
serv.use("/",router);
serv.listen(3000);

