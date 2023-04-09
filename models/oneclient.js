const mongoose = require("mongoose");

const oneclientSchema = new mongoose.Schema({
  type_usage: String,
  groupe_str_régional: String,
  NBK_PS_12: { type: Number, default: 0},
  NBK_PS: { type: Number, default: 0},
},
  { timestamps: true }
);

module.exports = mongoose.model("oneclient", oneclientSchema);

