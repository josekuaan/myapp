  
const express = require("express")
console.log("hello")

const {getAllUserWithdraw,getSingleUserWithdraw,submit } = require("../controller/withdraw")
// const { protect,authorize } = require("../middleWare/auth")

const Router = express.Router()

Router.route("/action").get(getAllUserWithdraw)
Router.route("/:id").get(getSingleUserWithdraw)
Router.put("/create/:id",submit)
  
  
module.exports = Router