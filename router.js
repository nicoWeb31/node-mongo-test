let express = require("express");
let router = express.Router();
const twig = require("twig");
const livresSchema = require("./models/livres.modele");
const mongoose = require("mongoose");


router.get("/test",(req,rep)=>{

    console.log("demande recu avec le methode get sur l'url /test");
    rep.end('message recue');
});


// =============================================================================
// find all
// =============================================================================
router.get("/livres",(req,rep)=>{

    livresSchema.find()
    .exec()
    .then(livres => {
        rep.render("livres/list.html.twig",{books : livres, message : rep.locals.message});
    })
    .catch();    
});


        
    
// =============================================================================
// find by id
// =============================================================================
router.get("/livres/:id",(req,rep)=>{
    livresSchema.findById(req.params.id)
    .exec()
    .then(livres =>{
        
        rep.render("livres/OneLivre.html.twig",{book:livres, isModif : false});
    })
    .catch(error => {
        console.log('error')
    });

    
});

// =============================================================================
// modification d'un livre (formulaire)
// =============================================================================

router.get("/livres/modif/:id",(req,rep)=>{
    livresSchema.findById(req.params.id)
    .exec()
    .then(livres =>{
        
        rep.render("livres/OneLivre.html.twig",{book:livres,isModif : true})
    })
    .catch(error => {
        console.log('error')
    });
})

// =============================================================================
// modification d'un livre (soumition du formulaire)
// =============================================================================
router.post("/livres/modifServ",(req,rep)=>{
console.log(req.body)
const livreUpdate = {
    nom : req.body.nom,
    auteur: req.body.auteur,
    nbrPages : req.body.nbrPages,
    description: req.body.description
};
livresSchema.update({_id : req.body.identifiant},livreUpdate)
.exec()
.then(resultat =>{                            //traite la reponse
    req.session.message = {
        type : "success",
        message :"modifier avec succes "
    }                            
    rep.redirect("/livres");                   //redirection
})
.catch(error =>{
    console.log(error);                       //traitement des erreurs
});
})

// =============================================================================
// supprimer livre
// =============================================================================
router.post("/lives/delete/:id",(req,rep)=>{
    //console.log(req.params.id);
    livresSchema.remove({_id : req.params.id})
    .exec()                                       //execute la requete
    .then(resultat =>{                            //traite la reponse
        req.session.message = {
            type : "success",
            message :"supprimer avec succes "
        }                            
        rep.redirect("/livres");                   //redirection
    })
    .catch(error =>{
        console.log(error);                       //traitement des erreurs
    });
});

// =============================================================================
// recup donner post
// =============================================================================
router.post("/livres",(req,rep)=>{
    const livre = new livresSchema({
        _id : new mongoose.Types.ObjectId(),
        nom : req.body.nom,
        auteur: req.body.auteur,
        nbrPages : req.body.nbrPages,
        description : req.body.description
    });
    livre.save()
    .then(resultat => {
        
        console.log(resultat);
        rep.redirect("/livres");
    })
    .catch(error =>{
        console.log(error);
    })
    
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
