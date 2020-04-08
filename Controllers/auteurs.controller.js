const auteursSchema = require("../models/auteurs.modele");
const livresSchema = require("../models/livres.modele");
const mongoose = require("mongoose");

const fs = require("fs");

exports.auteurShowOne = (req,rep)=>{
    auteursSchema.findById(req.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        
        rep.render("auteurs/auteur.html.twig",{auteur : auteur,ismodif:false});
    })
    .catch(error => {
        console.log(error);
    })
}

exports.auteursList = (req,rep) =>{
    auteursSchema.find()
    .populate("livres")
    .exec()
    .then(aut =>{
        
        rep.render("auteurs/auteurList.html.twig",{auteurs:aut});
    })
    .catch(error => {
        console.log(error);
    })


}

exports.auteursCreate = (req,rep)=>{
    const auteur = new auteursSchema({
        _id : new mongoose.Types.ObjectId,

        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        sexe: (req.body.sexe) ? true : false   // test checkbox renvoie on
    })
    auteur.save()
    .then(resultat =>{
        rep.redirect("/auteur")
    })
    .catch(error =>{
        console.log(error);
    });
}


exports.auteursSuppr = (req,rep)=>{
    auteursSchema.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(aut => {
        //console.log(auteurs)
        livresSchema.updateMany({"auteur":req.params.id},{"$set":{"auteur":aut[0]._id}},{"multi":true})
        .exec()
        .then(
            auteursSchema.remove({_id:req.params.id})
            .where("nom").ne("anonyme")
            .exec()
            .then(rep.redirect("/auteur"))
            .catch(error =>{
                console.log(error);
            })
        )
    })

}

exports.auteursModif = (req,rep)=>{

    auteursSchema.findById(req.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        
        rep.render("auteurs/auteur.html.twig",{auteur : auteur,ismodif:true});
    })
    .catch(error => {
        console.log(error);
    })

}

exports.auteursModifValid =(req,rep)=>{

    const auteurUp = {

        nom: req.body.nom,
        prenom: req.body.prenom,
        age: req.body.age,
        sexe: (req.body.sexe) ? true : false   // test checkbox renvoie on
    };
    auteursSchema.update({_id:req.body.identifiant},auteurUp)

    .exec()
    .then(resultat =>{
        rep.redirect("/auteur")
    })
    .catch(error =>{
        console.log(error);
    });
}