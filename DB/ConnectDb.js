const  mongoose = require("mongoose")
const dotenv = require("dotenv");

// Load Env Vars
dotenv.config({ path: "./config/config.env" });

const connection = async () =>{
    const conn = await mongoose.connect(process.env.URI, 
    {
        useNewUrlParser: true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    
    });

    console.log(`db connected to ${conn.connection.host}`);
}

module.exports = connection