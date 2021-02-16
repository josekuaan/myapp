const express = require('express')
const path = require("path");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
var helmet = require('helmet');
const cors = require("cors");

const app = express()
 
app.use(helmet());


const DBConnect = require("./DB/ConnectDb");
const investment = require("./routes/investment");
const auth = require("./routes/auth");
const mailer = require("./routes/mailer");
const withdraw = require('./routes/withdraw');

// Load Env Vars
dotenv.config({ path: "./config/config.env" });

// Initialize DB
DBConnect() 

app.use(express.json());
app.use(fileupload());
app.options('*', cors())
app.get('/', (req,res) =>{
   return res.send('welcome');
  }); 

app.use("/api/investment", investment);
app.use("/api/user/withdraw", withdraw);
app.use("/api/user/auth", auth);
app.use("/api/user/", mailer);
  
   
// if (process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(__dirname,'/clients/build')));
// }
//  app.get('/*', (req,res) =>{
//  return res.sendFile(path.join(__dirname+"/clients","build", "index.html" ));
// }); 

    
const port= process.env.PORT || 5000  
    
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})