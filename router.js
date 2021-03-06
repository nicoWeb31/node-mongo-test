let express = require("express");
let router = express.Router();
const twig = require("twig");
const multer = require("multer");
const livresController = require("./Controllers/livre.controller")




router.get("/test", (req, rep) => {

    console.log("demande recu avec le methode get sur l'url /test");
    rep.end('message recue');
});



// =============================================================================
// param de multer Ajouter l'image sur le server
// =============================================================================
const storage = multer.diskStorage({ //voir doc de multer
    destination: (req, file, cb) => {
        cb(null, "./public/images/")
    },
    filename: (req, file, cb) => {
        var date = new Date().toLocaleDateString();
        cb(null, date + '-' + Math.round(Math.random() * 10000) + "-" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error('format de l\'image ne correspond pad'), false)
    }
};



const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});



router.get("/", (req, rep) => {
    console.log("demande recu avec la methode get sur l'url /");
    rep.render("accueil.html.twig");
});


router.get("/livres",livresController.livresShowList);
router.get("/livres/:id",livresController.livreShowOne);
router.get("/livres/modif/:id",livresController.ModifLivreForm);
router.post("/livres/modifServ",livresController.modiLivre );
router.post("/lives/delete/:id",livresController.supprLivre);
router.post("/livres/updateImg",upload.single("image"),livresController.modfImg);
router.post("/livres", upload.single("image"),livresController.recupForm);


//gerer l'erruer 404
router.use((req, rep, suite) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
});

//gerer les autres erreurs
router.use((error, req, rep) => {

    rep.status(error.status || 500);
    rep.end(error.message);
});

module.exports = router;