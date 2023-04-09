const express = require('express');
const router = express.Router();
const chaffaire = require('../models/oneclient');
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
          NBK_PS_12: data.NBK_PS_12,
          NBK_PS: data.NBK_PS,
        }
      });
      // Insert the chaffaires into the database
      await chaffaire.insertMany(chaffaires);
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
    const ones = await chaffaire.find({});
    res.send(ones);
  } catch (err){
    res.status(500).send(err);
  }
});





module.exports = router;


