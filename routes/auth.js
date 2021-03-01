  
const express = require("express")


const { getUsers,updateAccount,getSingleUser,login,register,getMe,uploadUserPhoto,logout,updateUserDetails,resetPassword,forgotPassword, deleteUser} = require("../controller/auth")
const { protect,authorize } = require("../middleWare/auth")


const Router = express.Router()



 //Route for photo upload
Router.route("/:id/photo").put(
    protect,
    uploadUserPhoto
  );
  console.log("req.headers.authorization")
Router.route("/register").post(register)   
Router.route("/login").post(login)
Router.route("/forgot-password").post(forgotPassword) 
Router.get("/logout",protect,logout)
Router.get("/get-users",protect,getUsers) 
Router.get("/get-user/:id",protect,getSingleUser) 
Router.get("/getMe/:id",protect,getMe) 
Router.put("/update-account/:id",protect,updateAccount)
Router.put("/update/:id",protect,authorize('admin'),updateUserDetails)
Router.delete("/delete/:id",protect,authorize('admin'),deleteUser)
Router.put("/reset-password/:id",protect, resetPassword ) 
Router.put("/photo/:id",protect,uploadUserPhoto ) 
 

module.exports= Router   