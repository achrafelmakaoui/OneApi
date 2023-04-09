const mongoose = require("mongoose");

const AnneeSchema = new mongoose.Schema(
  {
    Annee_Analyse: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Annee", AnneeSchema);


