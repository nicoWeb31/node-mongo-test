const mongoose = require("mongoose");

const livresShema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom: String,
    auteur: String,
    nbrPages: Number,
    description: String
});
module.exports = mongoose.model("Livre",livresShema);
