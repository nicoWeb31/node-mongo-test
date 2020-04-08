const mongoose = require("mongoose");

const auteursShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    nom: String,
    prenom: String,
    age: Number,
    sexe: Boolean
});

auteursShema.virtual("livres",{
    ref:"Livre",
    localField:"_id",
    foreignField: "auteur"
});

module.exports = mongoose.model("Auteurs",auteursShema);
