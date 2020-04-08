const mongoose = require("mongoose");

const livresShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom: String,
    auteur: {                       // objet complexe fesant reference a la collection auteurs
        type : mongoose.Schema.Types.ObjectId,
        ref: "Auteurs",
        required:true
    },
    nbrPages: Number,
    description: String,
    image:String
});
module.exports = mongoose.model("Livre",livresShema);
