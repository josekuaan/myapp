  
const express = require("express")


const {send} = require("../controller/mailer")
// const { protect,authorize } = require("../middleWare/auth")


const Router = express.Router()


Router.route("/mailer/:id").post(send)


module.exports = Router