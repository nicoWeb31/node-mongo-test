const express = require("express");
const serv = express();
const morgan = require("morgan"); //donne des infos sur les req 
const routerGlobal = require("./routeurs/global.routeur");
const routerLivres = require("./routeurs/livres.routeur");
const routerAuteurs = require("./routeurs/auteurs.routeur");


const mongoose = require("mongoose"); //pour mongoodb
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer"); //module de gestion des upload

const storage = multer.diskStorage({ //voir doc de multer
    destination: (req, file, cb) => {
        cb(nul, "./public/images/")
    },
    filename: (req, file, cb) => {
        var date = new Date().toLocaleDateString();
        cb(null, date + '-' + Math.round(Math.random() * 10000) + "-" + file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/jpeg" ||file.mimetype === "image/png" ){
        cb(null,true);
    }else{
        cb(new Error('format de l\'image ne correspond pad'),false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter

})

serv.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))
mongoose.connect("mongodb://localhost:27017/biblio", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


serv.use(express.static("public"));
serv.use(morgan("dev"));
serv.use(bodyParser.urlencoded({
    extended: false
}));
serv.set('trust proxy', 1);
serv.use((req, rep, suite) => {
    rep.locals.message = req.session.message;
    delete req.session.message; //supression de la variable de session
    suite();
})
serv.use("/livres/", routerLivres);
serv.use("/auteur/",routerAuteurs);
serv.use("/", routerGlobal);

serv.listen(3000);