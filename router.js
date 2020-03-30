let express = require("express");
let router = express.Router();
const twig = require("twig");


router.get("/test",(req,rep)=>{

    console.log("demande recu avec le methode get sur l'url /test");
    rep.end('message recue');
});

router.get("/livres",(req,rep)=>{

    rep.render("livres/list.html.twig");
    
});

router.get("/livres/:nom",(req,rep)=>{

    rep.render("livres/OneLivre.html.twig",{ 'nom':req.params.nom});
    
});


router.get("/",(req,rep)=>{
    console.log("demande recu avec la methode get sur l'url /");
    rep.render("accueil.html.twig");
});


//gerer l'erruer 404
router.use((req,rep,suite)=>{
    const error = new Error("Page non trouvée");
    error.status = 404; 
    suite(error);
});

//gerer les autres erreurs
router.use((error,req,rep) => {

    rep.status(error.status || 500);
    rep.end(error.message);
});

module.exports =router;
