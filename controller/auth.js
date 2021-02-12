// const asyncHandler = require("../middleWare/async")
const crypto = require('crypto');
const { request } = require('http');
const path = require('path');
const Admin = require("../Model/admin")
const User = require("../Model/user")
const sendEmail = require('../utils/sendEmail')





exports.getUsers= async (req,res,next)=>{
 
  const user= await User.find()
  console.log("userde",user)
if(!user) return res.status(400).json({success:false,msg:"user not found"})
  //If the user is not an admin, they can only add one bootcamp
  if( req.user.role !== "admin"){ return res.status(400).json({success:false,msg:"You are not An Administrator"})}
// console.log(user)
    
  return res.status(200).json({success:true,msg:user})
  next()
}


exports.getSingleUser= async (req,res,next)=>{
 
  const user= await User.findById(req.params.id)

  console.log("userde",user)
if(!user) return res.status(400).json({success:false,msg:"user not found"})
  //If the user is not an admin, they can only add one bootcamp
  if( req.user.role !== "admin"){ return res.status(400).json({success:false,msg:"You are not An Administrator"})}
// console.log(user)
    
  return res.status(200).json({success:true,msg:user})
  next()
}


//@desc    Register user
//@route   POST /api/v1/auth/users
//@access  Private/admin
exports.register= async (req, res) => {
 
  console.log(req.body)
    const user = await  User.create(req.body)   
     sendTokenResponse(user,200,res)
  } 
 
//@desc    Login user
//@route   POST /api/v1/auth/users
//@access  Private/admin 
exports.login= async (req, res) => {
 console.log(req.body)
  const {password,email} = req.body
  console.log('user')
  // Validate email and padssword
  if(!email || !password){
    res.status(400).json({success:false,msg:"Please provide email and password"})
  }
 
  const user = await User.findOne({email}).select("+password")
  console.log(user)
  if(!user) return res.status(400).json({success:false,msg:"Incorrect credentials"})

  const isMatch = await user.comparePassword(password)
  console.log(isMatch)

  if(!isMatch) return res.status(400).json({success:false,msg:"Incorrect Password"})
   sendTokenResponse(user,200,res)
}


async function sendTokenResponse(user,statusCode,res){

  const token = await user.getsignedinToken()

  const options ={
    expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly:true
}
if(process.env.NODE_ENV === 'production'){
    options.secure = true
}
console.log(user)
return res.status(statusCode)
.cookie("token",token,options)
.json({success:true,token,user})


}

//@desc    Get currently login user
//@route   Get /api/v1/auth/getme
//@access  Private

exports.getMe=async (req,res,next)=>{
  // console.log(req.user)
  
let user= await User.findById(req.user._id)


if(!user) return res.status(400).json({success:false,msg:"user not found"})
    
  res.status(200).json({success:true,msg:user})
  next()
}


//@desc    Logout user    
//@route   Get /api/v1/auth/logout
//@access  Private
exports.logout= async(req,res,next)=>{

  return res.status(200)
  .cookie("token","none",{
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly:true})
   .json({success:true,msg:{}})
    next()
  }


//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private
exports.updateAccount= async (req,res,next)=>{

  let text;
  const user= await User.findById(req.params.id)  

  if(!user) return res.status(400).json({success:false,msg:"user not found"})

    //If the user is not an admin, they can only add one bootcamp
    if( user._id.toString() !== req.params.id){ return res.status(400).json({success:false,msg:"You are not Authorized to perform this action"})}
 
    if(req.files !== null) {
      console.log(req.files)
      const file = req.files.photo;         
    
      //Chech file size
    if(file.size > process.env.MAX_FILE_UPLOAD && file.size > process.env.MAX_FILE_UPLOAD) return res.status(400).json({success:false,msg:`Max image size required is 20mb`})
   
    //Create a customer file name
    file.name = `profile_${user._id}${path.parse(file.name).ext}`
     text= JSON.parse(req.body.text)
     
   text["picture"]=file.name
   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
    if(err){
        console.error(err)     
        return res.status(500).json({success:false,msg:`problem uploading file`})
          
    }  
     
  })
  const result= await User.findByIdAndUpdate(req.params.id, text,{new:true, runValidators:true})
  if(!result) return res.status(400).json({msg:"user not found"})
  console.log(result)
  return res.status(200).json({success:true,result})
 
    }      
    text= JSON.parse(req.body.text)

  //  console.log("ok",text)
  const result= await User.findByIdAndUpdate(req.params.id, text,{new:true, runValidators:true})
  if(!result) return res.status(400).json({msg:"user not found"})
  console.log(result)
  res.status(200).json({success:true,result})
  next() 
}


//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private
exports.updateUserDetails= async (req,res,next)=>{

  console.log(req.params.id,req.body)
  const user= await User.findById(req.params.id)  

  if(!user) return res.status(400).json({success:false,msg:"user not found"})

  const result = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
  })
    
  if(!result) return res.status(400).json({msg:"user not found"})
  res.status(200).json({success:true,result})
  next() 
}

  //@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private

exports.updateUserDetails= async (req,res,next)=>{

  console.log(req.params.id,req.body)
  const user= await User.findById(req.params.id)  

  if(!user) return res.status(400).json({success:false,msg:"user not found"})
    //If the user is not an admin, they can only add one bootcamp
    if( req.user.role !== "admin"){ return res.status(400).json({success:false,msg:"You are not An Administrator"})}
  // console.log(user)
  const result = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
  })
    
  if(!result) return res.status(400).json({msg:"user not found"})
  res.status(200).json({success:true,result})
  next() 
}

//@desc    Delete a user
//@route   DELETE /api/v1/bootcamp/:id
//@access  Private
exports.deleteUser = async(req,res,next) =>{
 console.log("jlhnkj")
  const user = await User.findById(req.params.id)
  
  if(!user) return res.status(200).json({success:true,msg:`user with id of ${req.params.id} not found`})
  user.remove(); 
  return res.status(200).json({success:true,msg:{}});

}

//@desc    Reset password 
//@route   PUT /api/auth/resetPassword/:resettoken
//@access  Public

exports.resetPassword= async(req,res,next)=>{
 
  let resetPasswordToken= await crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
  console.log(resetPasswordToken)
  let user =await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}   
        })

        if(!user) return res.status(400).json({success:false,msg:'Invalid Token'})

        //Set new password
    user.password = req.body.password
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

      //save user new password
       user.save({validateBeforeSave:false})
      sendTokenResponse(user,200,res)
}

//@desc    Post forgot password
//@route   POST /api/v1/auth/forgotpassword
//@access  Private
exports.forgotPassword = async (req, res, next) =>{

  console.log(req.body.email)
    const user= await  User.findOne({email:req.body.email}).select("+password")
    if(!user) return res.status(401).json({success:false,msg:"user not found"})

    // console.log(user)
    //Get reset token
    const getResetToken = await user.getResetPasswordToken()
    // console.log(getResetToken)
     user.save({validateBeforeSave:false})
    console.log(user)
    console.log(getResetToken)
    //Create reset url
    
  
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${getResetToken}`
    const message = `You are recieving this email because you (or someone else) has requested for a change of password.
    Please click the url to reset your password \n\n ${resetUrl}`
    console.log(message) 

    try {  
       reqult=sendEmail({
          email:user.email,
          subject:'Password reset token',
         message:message
      })
console.log(result)

      return res.status(200).json({success:true,data:'Email sent',msg_id:result.messageId})
  } catch (err) {
      console.log("hytr",err)
      user.resetPasswordToken=undefined
      user.resetPasswordExpire=undefined

       user.save({validateBeforeSave:false})
      
      return res.status(500).json({success:true,data:'Email could not be sent'})
  }
}
//@desc    Upload bootcamp photo
//@route   PUT /api/auth/user/:id
//@access  Private
exports.uploadUserPhoto = async(req,res,next) =>{
    
   
  const user = await User.findById(req.params.id,) 
  
  if(!user) return res.status(401).json({success:false,msg:`user with id of ${req.params.id} not found`})

  // Make sure the owner of bootcamp id the only person to update bootcamp
  if(user._id.toString() === req.user._id){
      return res.status().json({success:false,msg:`This user is not authorize to modify this course`})
      
  }  
 if(!req.files) return res.status(400).json({success:false,msg:`please upload a file`})
            
 const file = req.files.photo[0];         
 const file2 = req.files.photo[1];     
    
  
    
 
 
 //Chech file size
 if(file.size > process.env.MAX_FILE_UPLOAD && file.size > process.env.MAX_FILE_UPLOAD) return res.status(400).json({success:false,msg:`Max image size required is 20mb`})


//Create a customer file name
file.name = `photo_${user._id}${path.parse(file.name).ext}`
file2.name = `photo2_${user._id}${path.parse(file2.name).ext}`

const text= JSON.parse(req.body.text)

const updates={   
    IdentificationCard:text.ID,   
            IdNumber:text.number,
            dateIssued:text.dob,     
            photo:[file.name,file2.name]     
  }   

         console.log("rre",updates)
file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
  if(err){
      console.error(err)     
      return res.status(500).json({success:false,msg:`problem uploading file`})
        
  }  
   
})
file2.mv(`${process.env.FILE_UPLOAD_PATH}/${file2.name}`, async err =>{
  if(err){
      console.error(err)     
      return res.status(500).json({success:false,msg:`problem uploading file`})
        
  }            
   
})

 const uploadedFiles= await User.findByIdAndUpdate(req.params.id, updates,{new:true, runValidators:true})
 return  res.status(200).json({ success:true, msg:uploadedFiles})            
} 