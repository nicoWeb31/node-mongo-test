const livresSchema = require("../models/livres.modele");
const auteursSchema = require("../models/auteurs.modele");
const mongoose = require("mongoose");
const fs = require("fs");


// =============================================================================
// find all
// =============================================================================
exports.livresShowList =(req, rep) => {
    auteursSchema.find()    //on recupere la listes des auteurs
    .exec()
    .then(auteurs =>{

        livresSchema.find()
            .populate("auteur")
            .exec()
            .then(livres => {
                rep.render("livres/list.html.twig", {
                    books: livres, 
                    auteurs:auteurs,
                    message: rep.locals.message
                });
            })
            .catch();

    })
    .catch(error =>{
        console.log(error);
    })
};

// =============================================================================
// find by id
// =============================================================================
exports.livreShowOne = (req, rep) => {
    livresSchema.findById(req.params.id)
        .populate("auteur")
        .exec()
        .then(livres => {

            rep.render("livres/OneLivre.html.twig", {
                book: livres,
                isModif: false
            });
        })
        .catch(error => {
            console.log('error')
        });
    };

// =============================================================================
// modification d'un livre (formulaire)
// =============================================================================
exports.ModifLivreForm = (req, rep) => {
    auteursSchema.find()
    .exec()
    .then(auteurs => {

        
        livresSchema.findById(req.params.id)
            .populate("auteur")
            .exec()
            .then(livres => {
    
                rep.render("livres/OneLivre.html.twig", {
                    book: livres,
                    auteurs : auteurs,
                    isModif: true
                })
                
            })
            .catch(error => {
                console.log('error')
            });
        
    })
    .catch(error => {
        console.log('error')
    });

    
};
// =============================================================================
// modification d'un livre (soumition du formulaire)
// =============================================================================
exports.modiLivre = (req, rep) => {
    console.log(req.body)
    const livreUpdate = {
        nom: req.body.nom,
        auteur: req.body.auteur,
        nbrPages: req.body.nbrPages,
        description: req.body.description
    };
    livresSchema.update({
            _id: req.body.identifiant
        }, livreUpdate)
        .exec()
        .then(resultat => { //traite la reponse
            if (resultat.nModified < 1) { //si nModifie < 1 ont leve une erreur 
                throw new Error("requete de modification échoué");
            }
            req.session.message = {
                type: "success",
                message: "modifier avec succes "
            }
            rep.redirect("/livres"); //redirection
        })
        .catch(error => {
            console.log(error); //traitement des erreurs
            req.session.message = {
                type: 'danger',
                message: error.message
            }
            rep.redirect("/livres");
        });
};

// =============================================================================
// modif de l'image
// =============================================================================
exports.modfImg = (req, rep) => {

    let livre = livresSchema.findById(req.body.identifiant)
        .exec()
        .then(livre => {
            fs.unlink("./public/images/"+livre.image, error => {
                console.log("error");
            });

            const livreUpdate = {
                image: req.file.path.substring(14)
            }
            livresSchema.updateOne({_id: req.body.identifiant},livreUpdate)
                .exec()
                .then(resultat => {
                    rep.redirect("/livres/modif/" + req.body.identifiant)
                        .catch(error => {
                            console.log(error);
                        })
                })

        })

    }



// =============================================================================
// supprimer livre
// =============================================================================
exports.supprLivre = (req, rep) => {
    let livre = livresSchema.findById(req.params.id)
        .select("image")
        .exec()
        .then(livre => {
            fs.unlink("./public/images" + livre.image, error => {
                console.log("error");
            });

            livresSchema.remove({
                    _id: req.params.id
                })
                .exec() //execute la requete
                .then(resultat => { //traite la reponse
                    req.session.message = {
                        type: "success",
                        message: "supprimer avec succes "
                    }
                    rep.redirect("/livres"); //redirection
                })
                .catch(error => {
                    console.log(error); //traitement des erreurs
                });
        })
        .catch(error => {
            console.log(error); //traitement des erreurs
        });
};

// =============================================================================
// recup donner post creation de livre
// =============================================================================

exports.recupForm = (req, rep) => {
    const livre = new livresSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: req.body.nom,
        auteur: req.body.auteur,
        nbrPages: req.body.nbrPages,
        description: req.body.description,
        image: req.file.path.substring(14) //supprime les 14 premier caractere 
    });
    livre.save()
        .then(resultat => {

            console.log(resultat);
            rep.redirect("/livres");
        })
        .catch(error => {
            console.log(error);
        })
    };
