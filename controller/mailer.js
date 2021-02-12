
const nodemailer=require("nodemailer")

const User = require("../Model/user")


exports.send= async (req, res) => {

      const user = await User.findById(req.params.id)  
    
      if(!user) return res.status(401).json({success:false,msg:`user with id of ${req.params.id} not found`})
  
      const email = user.email

       const {subject,message} = req.body
       console.log(email,subject,message)
       if(!subject && !message) return res.status(401).json({success:false,msg:`Something went wrong`})

    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.zoho.com",
           auth: {
                user: 'josekuaan@zohomail.com',
                pass: 'anyibaba2017',
             },
        secure: true,
        });
      

        const mailData = {
            from: "no-reply <josekuaan@zohomail.com>",  // sender address  
              to: email,   // list of receivers
              subject:  subject,
              text:'',
              html: `<p>${message}</p>`
            };
       
            transporter.sendMail(mailData, function (err, info) {
                if(err)
               return  res.status(400).json({ success:false, msg:"something went wrong"})
                else
               return  res.status(200).json({ success:true, msg:"Message Sent",msg_id:info.messageId})
             });
      
    }