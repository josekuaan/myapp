const Invest = require("../Model/investment")
const Wallet = require("../Model/withdraw")
const User = require("../Model/user")
const path=require("path") 
const fetch = require('node-fetch');


//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllUserInvest= async (req, res) => {


    const invest = await Invest.find()
    // console.log("user",invest)
    if(!invest) return res.status(401).json({success:false,msg:`No record Found`})
    res.status(200).json({ success:true, invest})
  } 

//@desc    Get single user
//@route   GET /api/v1/auth/getSingleUserInvest/:id
//@access  Private/admin
exports.getSingleUserInvest= async  (req, res) => {
    const invest = await Invest.findById(req.params.id)
    if(!invest) return res.status(401).json({success:false,msg:`No record`})
    res.status(200).json({ success:true, invest})
  }   

//@desc    Get single user
//@route   GET /api/v1/auth/singleUsersInvest/:id
//@access  Private/admin
exports.getAllSingleUserInvest= async  (req, res) => {
  
    const invest = await Invest.find({userId:req.params.id})
    
    if(!invest) return res.status(401).json({success:false,msg:`No record`})
    res.status(200).json({ success:true, invest})
  }  

  //@desc    Get single user
//@route   GET /api/v1/auth/singleUsersInvest/:id
//@access  Private/admin
exports.SingleUserInvest= async  (req, res) => { 
  
    const invest = await Invest.find({userId:req.params.id}).sort({_id:-1}).limit(1)
   
    if(!invest) return res.status(401).json({success:false,msg:`No record`})
    res.status(200).json({ success:true, invest})
  }  

    //@desc    Get single user
//@route   GET /api/v1/auth/singleUsersInvest/:id
//@access  Private/admin
exports.Settled= async  (req, res) => { 
 
    const invest = await Wallet.find({userId:req.params.id})
   
    if(!invest) return res.status(401).json({success:false,msg:`No record`})
    res.status(200).json({ success:true, invest})
  } 

//@desc   Submit investment
//@route   POST /api/auth/:id/invest  
//@access  Private/admin
exports.submit= async (req, res) => {

  const user = await User.findById(req.params.id)  

  if(!user) return res.status(401).json({success:false,msg:`Could not find user`})


 let currentbtcPrice;
 let dollarWorthInBitcoin; 

   currentbtcPrice= await fetch(`https://blockchain.info/tobtc?currency=USD&value=${req.body.amount}`)
    .then(res => res.text())
    .then(text =>  text)
  
    if(!currentbtcPrice) return res.status(401).json({ success:false, msg:"Error with server, Try again"})     
        
    
    const amt = req.body.amount  
    const type = req.body.type
    
    
    if(type === "deposit"){
      // Convert doller to bitcoin      
    dollarWorthInBitcoin = currentbtcPrice   
       
    }else if(type === "withdraw"){
      console.log("okok")
      dollarWorthInBitcoin= req.body.amount
    }
  
   const details ={  
    amount:amt, 
    method:req.body.method,
    type:type,   
    bitCoinValue:dollarWorthInBitcoin,
    txn_id:req.body.txn.split("-")[0],
    userId:req.params.id, 
    name:req.user.fullName,
    email:req.user.email,
    acct_details:req.body.details   
   }       
   console.log(details)
   const invest = await Invest.create(details)   
   res.status(200).json({ 
      
      success:true,
      invest:{
        amount:invest.amount,
        method:invest.method,
        type:invest.type,
        bitCoinValue:invest.bitCoinValue,
        txn:invest.txn_id,
        userId:invest.userId,
        email:user.email,
        fullName:user.fullName
      }
  })   
  

  
}
//@desc    Get update user
//@route   GET /api/auth/updateUserInvest/:id
//@access  Private/admin
exports.updateWallet= async  (req, res) => {

  // const invest = await Invest.findById(req.params.id)  


  // const {withdraw,interest,withdrawable,status}=req.body
  // invest.status =req.body.stat
  // if(!user) return res.status(401).json({success:false,msg:`Could not find user`})

    let wallet = await Wallet.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
  
    
    if(!wallet) return res.status(401).json({success:false,msg:`Could not update account`})

      
    res.status(200).json({ success:true, wallet})
  }

  exports.saveWallet= async  (req, res) => {

    // const invest = await Invest.findById(req.params.id)  
  
    // const {withdraw,interest,withdrawable,status}=req.body
    // invest.status =req.body.stat
    // if(!user) return res.status(401).json({success:false,msg:`Could not find user`})
  
      let wallet = await Wallet.create(req.body)
     
      
      if(!wallet) return res.status(401).json({success:false,msg:`Could not update account`})
  
        //  invest=Invest.find()
   
      res.status(200).json({ success:true, wallet})
    }



//@desc    Get update user
//@route   GET /api/auth/updateUserInvest/:id
//@access  Private/admin
exports.updateUser= async  (req, res) => {

  // const invest = await Invest.findById(req.params.id)  

  // if(!user) return res.status(401).json({success:false,msg:`Could not find user`})
  if( req.user.role !== "admin"){ return res.status(400).json({success:false,msg:"You are not An Administrator"})}
  
    let invest = await Invest.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    
    if(!invest) return res.status(401).json({success:false,msg:`Could not update account`})

     
    res.status(200).json({ success:true, invest})
  }

//@desc    Upload bootcamp photo
//@route   PUT /api/auth/user/:id
//@access  Private
exports.uploadUserPayment = async (req,res,next) =>{
   

  const user = await User.findById(req.user.id) 

  if(!user) return res.status(401).json({success:false,msg:`user with id of ${req.params.id} not found`})

  // Make sure the owner of bootcamp id the only person to update bootcamp
  if(user._id.toString() !== req.user.id){
      return res.status(401).json({success:false,msg:`This user is not authorize to modify this account`})
      
  }
 if(!req.files) return res.status(400).json({success:false,msg:`please upload a file`})
       
 const file = req.files.frontView;            
 const file2 = req.files.backView; 
        
    
 if(!file.mimetype.startsWith('image') && !file2.mimetype.startsWith('image'))  return res.status(400).json({success:false,msg:`please upload an image file`})
 
 //Chech file size    
 if(file.size > process.env.MAX_FILE_UPLOAD && file2.size > process.env.MAX_FILE_UPLOAD) return res.status(400).json({success:false,msg:`Upload image less than ${process.env.MAX_FILE_UPLOAD}`})


//Create a customer file name
file.name = `photo_${req.params.id}${path.parse(file.name).ext}`


file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
  if(err){
      console.error(err)     
      return res.status(401).json({success:false,msg:`problem uploading file`})
  
        
  }  
  
    return await Invest.findByIdAndUpdate(req.params.id, {photo:[file.name]},{new:true,runValidators:true})
       
})  

file2.name = `photo_2${req.params.id}${path.parse(file.name).ext}`

file2.mv(`${process.env.FILE_UPLOAD_PATH}/${file2.name}`, async err =>{
  if(err){
      console.error(err)             
      return res.status(401).json({success:false,msg:`problem uploading file`})
    
  } 
  let invest = await Invest.findById(req.params.id)  

   invest=invest.photo.concat(file2.name)
   
   await Invest.findByIdAndUpdate(req.params.id,{photo:invest},{new:true,runValidators:true})
    
        
})

res.status(200).json({ success:true, photo:[file.name,file2.name]})
}

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteInvestment = async(req,res,next) =>{
  
   let invest = await Invest.findById(req.params.id)
   
   if(!invest) return res.status(200).json({success:true,msg:`user with id of ${req.params.id} not found`})
   invest = await invest.remove(); 
   invest={
    withdrawable:invest.withdrawable,
    status:invest.status,
    wallet:invest.wallet,
    interest:invest.interest,
    method:invest.method,
    type:invest.type,
    amount:invest.amount,
    bitCoinValue:invest.bitCoinValue,
    txn_id:invest.txn_id,
    userId:invest.userId,
    name:invest.name,
    email:invest.email,
    createdAt:invest.createdAt,

   }
    await Wallet.create(invest)
   return res.status(200).json({success:true,msg:{}});
 
 }