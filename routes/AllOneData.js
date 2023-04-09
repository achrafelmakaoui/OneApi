const router = require("express").Router();
const AllOneData = require("../models/allonedata");
const OneData  = require('../models/onedata');
const OneClient  = require('../models/oneclient');

//GET
router.get("/filter", async (req, res) => {
  const qGRPSTR = req.query.grp_str_input;
  const qTypeUsage = req.query.type_usage;

  const filter = {};

  if (qGRPSTR && Array.isArray(qGRPSTR)) {
    filter.groupe_str_régional = { $in: qGRPSTR };
  } else if (qGRPSTR) {
    filter.groupe_str_régional = qGRPSTR;
  }

  if (qTypeUsage && Array.isArray(qTypeUsage)) {
    filter.type_usage = { $in: qTypeUsage };
  } else if (qTypeUsage) {
    filter.type_usage = qTypeUsage;
  }

  try {
    const list = await AllOneData.find(filter);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/Delete", async (req, res) => {
  try {
    // Delete all documents from AllOneData collection
    await AllOneData.deleteMany({});

    // Delete all documents from OneData collection
    await OneData.deleteMany({});

    // Delete all documents from OneClient collection
    await OneClient.deleteMany({});

    res.send("All documents deleted from all collections");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
