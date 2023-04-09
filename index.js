const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth");
const oneRoute = require("./routes/one");
const oneclientRoute = require("./routes/oneclient");
const allonedataRoute = require("./routes/AllOneData");
const anneeRoute = require("./routes/Annee");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const cors = require("cors");

app.get('/',(req,res)=>{
  res.send("let's the party begin");
});

mongoose.set('strictQuery', false)
  .connect(process.env.MONGO_URL,{ 
    useNewUrlParser: true,
     useUnifiedTopology: true 
    })
  .then(() => {
    console.log("DB Connection Successfull!");
    })
  .catch((err) => {
    console.log(err);
  });
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/one", oneRoute);
app.use("/api/oneclient", oneclientRoute);
app.use("/api/allonedata", allonedataRoute);
app.use("/api/annee", anneeRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
