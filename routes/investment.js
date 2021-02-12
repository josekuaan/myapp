  
const express = require("express")


const {Settled, updateWallet,deleteInvestment,saveWallet,updateUser,
    SingleUserInvest,getAllUserInvest,getSingleUserInvest,submit,
    getAllSingleUserInvest,uploadUserPayment} = require("../controller/investment")
const { protect,authorize } = require("../middleWare/auth")

const Router = express.Router()

Router.route("/users-investment").get(protect,getAllUserInvest)
Router.route("/users-investment/:id").get(getAllSingleUserInvest)
Router.route("/get-single-user-investment/:id").get(getSingleUserInvest)
Router.route("/single-users-investment/:id").get(SingleUserInvest)
Router.route("/settled-users-investment/:id").get(Settled)   
Router.post("/create/:id",protect,submit)         
Router.post("/save-user-wallet/:id",protect, saveWallet )
Router.put("/update-user-wallet/:id", protect,updateWallet )
Router.put("/update-user-account/:id",protect, updateUser )
Router.delete("/delete-user-investment/:id",protect, deleteInvestment )
Router.put("/uploadUserPayment/:id", protect,uploadUserPayment )

  
module.exports = Router