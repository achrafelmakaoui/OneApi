const express = require('express');
const router = express.Router();
const OneData  = require('../models/onedata');
const OneClient  = require('../models/oneclient');
const AllOneData = require("../models/allonedata");
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
var upload = multer({ dest: 'uploads/' });



router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file?.filename == null || req.file?.filename == 'undefined') {
      res.status(400).json('no file');
    } else {
      var filePath = 'uploads/' + req.file.filename;
      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          '*': '{{columnHeader}}'
        }
      });
      const chaffaires = excelData.Feuil1.map(data => {
        return {
          type_usage: data.TYPE,
          groupe_str_régional: data.GRP_STR_REGIO,
          MWH_PS_12: data.MWH_PS_12,
          MWH_PS: data.MWH_PS,
          KDH_PS_12: data.KDH_PS_12,
          KDH_PS: data.KDH_PS,
     
        }
      });
      // Insert the chaffaires into the database
      await OneData.insertMany(chaffaires);
      fs.remove(filePath);
      res.status(200).json(chaffaires);
    }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
});
router.get("/", async (req, res) => {
  try {
    const ones = await OneData.find({});
    res.send(ones);
  } catch (err){
    res.status(500).send(err);
  }
});

  // the implementation of fetchTableData function
  const fetchTableData = async () => {
    try {
      const result = await OneData.aggregate([
        {
          $lookup: {
            from: "oneclients",
            let: { typeUsage: "$type_usage", groupeStr: "$groupe_str_régional" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$type_usage", "$$typeUsage"] },
                      { $eq: ["$groupe_str_régional", "$$groupeStr"] },
                    ],
                  },
                },
              },
            ],
            as: "oneClients",
          },
        },
      ]);
  
      return result.map((data) => {
        const clientData = data.oneClients[0];
        return {
          type_usage: data.type_usage,
          groupe_str_régional: data.groupe_str_régional,
          MWH_PS_12: data.MWH_PS_12,
          MWH_PS: data.MWH_PS,
          KDH_PS_12: data.KDH_PS_12,
          KDH_PS: data.KDH_PS,
          NBK_PS_12: clientData ? clientData.NBK_PS_12 : null,
          NBK_PS: clientData ? clientData.NBK_PS : null,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };
  


router.get('/my-data', async (req, res) => {
  try {
    await AllOneData.deleteMany({});
    
    const result = await fetchTableData();
    const createdRecords = await AllOneData.create(result);
    res.send(createdRecords);

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
