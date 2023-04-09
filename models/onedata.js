const mongoose = require("mongoose");

const oneSchema = new mongoose.Schema({
  type_usage: String,
  groupe_str_régional: String,
  MWH_PS_12: { type: Number, default: 0},
  MWH_PS: { type: Number, default: 0},
  KDH_PS_12:{ type: Number, default: 0},
  KDH_PS:{ type: Number, default: 0},

},
  { timestamps: true }
);

module.exports = mongoose.model("onedata", oneSchema);

