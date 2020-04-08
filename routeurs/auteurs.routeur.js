let express = require("express");
let router = express.Router();
const twig = require("twig");
const auteursController = require("../Controllers/auteurs.controller");


router.get("/:id",auteursController.auteurShowOne);
router.get("/",auteursController.auteursList);
router.post("/",auteursController.auteursCreate);
router.post("/delete/:id",auteursController.auteursSuppr);
router.get("/modif/:id",auteursController.auteursModif);
router.post("/modifValid",auteursController.auteursModifValid);










module.exports = router;