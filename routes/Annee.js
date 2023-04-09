const router = require("express").Router();
const Annee = require("../models/Annee");


router.post("/",  async (req, res) => {
    const newAnnee = new Annee(req.body);
    try {
      const savedAnnee = await newAnnee.save();
      res.status(200).json(savedAnnee);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //UPDATE
  router.put("/:id", async (req, res) => {
    try {
      const updatedAnnee = await Annee.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedAnnee);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //DELETE
  router.delete("/:id",  async (req, res) => {
    try {
      await Annee.findByIdAndDelete(req.params.id);
      res.status(200).json("Annee has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //GET ANNEE
   router.get("/find", async (req, res) => {
    try {
      const Anneed = await Annee.findOne();
      res.status(200).json(Anneed);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET ANONCE
  router.get("/find/:id", async (req, res) => {
    try {
      const Anneed = await Annee.findById(req.params.id);
      res.status(200).json(Anneed);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
