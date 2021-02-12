
const mongoose= require("mongoose")

const WithdrawSchema= new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
        trim:true
    },
    bitCoinValue:{
        type:Number,
        required:true,
        trim:true
    },
    method:{
        type:String,
        required:true,
        trim:true
    }, 
    type:{
        type:String,
        required:true,
        trim:true
    }, 

    status:{
        type:Boolean,
        required:true,
        default:false
    },
    txn_id:{
        type:String,
        required:true,
        trim:true
    },
    wallet:{
        type:Number,
        required:true,
        trim:true,
        default:0.000
    },
    interest:{
        type:Number,
        required:true,
        trim:true,
        default:0.000
    },
    withdrawable:{
        type:Number,
        required:true,
        trim:true,
        default:0.000
    },  
    userId:{
        type:String,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

})
       

module.exports=mongoose.model("withdraw", WithdrawSchema)

       