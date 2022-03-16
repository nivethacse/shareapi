
const nodemailer = require("nodemailer")
const crypto = require ("crypto")
const db = require("./mongo")


const mail = {
    async resetmailer(value){
        crypto.randomBytes(32, async(err , buffer)=>{
            if(err){
                console.log(err)
            }
            const emailToken = buffer.toString("hex")
            const userEmail = await db.userData.findOne({email:value.email})
            if(userEmail){
                db.userData.updateOne({email:value.email},{$set:{verifyToken: emailToken}})
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth:{
                        user: process.env.email,
                        pass: process.env.password
                    }
                });

                let mailOption={
                    from: "kolhapurkar131297@gmail.com",
                    to: value.email,
                    subject:"reset your password",
                    html: `
                    <p>click the <a href="http://localhost:3000/resetMail/${emailToken}">link</a> to reset password</p>
                    <p> valid for 24 hrs only </p>
                    `
                };

                transporter.sendMail(mailOption, function(error , info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("email sent:" + info.response)
                        resizeTo.send({message:"check your mail"})
                    }
                });
            }else{
                resizeTo.send({message : "Enter valid mail"})
            }
        })
    },

    async verifymailer (value){
        crypto.randomBytes(32 ,async(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const emailToken = buffer.toString("hex")
            const userEmail = await db.userData.findOne({email : value.email})
            if(userEmail){
               db.userData.updateOne({email : value.email},{$set:{verifyToken : emailToken }})
               //mail id from where the mail will be send to the user
               let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                   auth:{
                       user: process.env.email,
                       pass: process.env.password
                   }
               });
               //body to be present in the mail
               let mailOptions ={
                   from : "kolhapurkar131297@gmail.com",
                   to:value.email,
                   subject : "verify your mail",
                   html : `
                   <p>click the <a href="http://localhost:3000/verify/${emailToken}">link</a> to verify account</p>
                   <p>valid for 24 hrs only</p>
                   `
    
               };

               //sending back response to check mail to the user
               transporter.sendMail(mailOptions , function(error , info){
                   if(error){
                       console.log(error);
                   }else{
                       console.log("email sent :" + info.response)
                       res.send({message :"check your mail"})
                   }
               });
            }else{
                res.send({message : "Enter valid mail"})
            }
        })
    }
}

module.exports = mail