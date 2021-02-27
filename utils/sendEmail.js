  
// process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const nodemailer = require("nodemailer");

const sendEmail = async (options) =>{

  // console.log(options)
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
        from: "<josekuaan@zohomail.com>",  // sender address  
        to:options.email, 
        subject:options.subject,
        text: "",
        html: options.message
        };
        console.log(mailData)

  return transporter.verify(async function(error, success) {
 
    if (error) {
      console.log(error);
    } else {
       await transporter.sendMail(mailData, function(err,info){
        if(err){ return err
      }else {
        console.log('Message sent %s', info)
        return info
      
    }
      })
   }}); 
   
   
    
}

module.exports = sendEmail;