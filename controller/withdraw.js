const Withdraw = require("../Model/withdraw")
const User = require("../Model/user")


//@desc    Get single user
//@route   GET /api/v1/auth/singleUsersInvest/:id
//@access  Private/admin
exports.getSingleUserWithdraw= async  (req, res) => {
     console.log("okay")
    const withdraw = await Withdraw.find({userId:req.params.id})
    console.log(withdraw)  
    res.status(200).json({ success:true, withdraw})
  }  
    

  //@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllUserWithdraw= async (req, res) => {  
  console.log("hellooooo")   
    const withdraw = await Withdraw.find()
    console.log(withdraw)
    res.status(200).json({ success:true, withdraw})
  }


  //@desc   Submit investment
//@route   POST /api/auth/:id/invest
//@access  Private/admin
exports.submit= async (req, res) => {

  console.log(req.params.id)
    const user = await User.findById(req.params.id)  
    
      if(!user) return res.status(401).json({success:false,msg:`user with id of ${req.params.id} not found`})
      
      
      
      console.log(req.body.interest)

      let wallet= Number(req.body.withdraw) + Number(req.body.interest)
      let withdrawable= Number(req.body.withdrawable)
   
      const data={     
        wallet,     
        interest:Number(req.body.interest),
        withdrawable,
        status:req.body.status,
        userId:req.params.id
      }
      console.log(data)  
        
       let withdraw = await Withdraw.create(data)  
      
      console.log(withdraw)     
      res.status(200).json({ success:true, withdraw})   
     
    }