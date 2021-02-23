const jwt = require("jsonwebtoken")
const User=require("../Model/user")


exports.protect = async (req,res,next )=>{
    

    let token;
    if(req.headers.authorization !== undefined && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }else{
        return res.json({success:false,msg:"Please login"})
    }
    // if(!req.headers.cookie ){
       
    // }
    // if(req.headers.cookie === undefined ){
    //     return res.json({success:undefined,msg:"Please login"})
    // }

    // token= req.headers.cookie.split('=')[1]
       
    try {
        //Make sure token exist
    if(!token){
        return res.json({success:false,msg:"invalid token"})      
    }


    const decoded = jwt.verify(token,process.env.JWT_SECRETE)
   
     req.user = await User.findById( decoded.id )                  
    
    next()  
          
    } catch (error) {
        return res.status(401).json({success:false,msg:'Not authorized to access this route'})
    }
              
}
   

//Grant access to specific role
exports.authorize = (...roles) => { 
    
    return (req,res,next) =>{
      
        if(!roles.includes(req.user.role)){
           
            return res.status(401).json({success:false,msg:`A ${req.user.role} is not authorized to use this route`})
        }
        next()
    }
}  