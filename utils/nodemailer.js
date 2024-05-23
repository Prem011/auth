const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pcwanjari11@gmail.com",
        pass: "vthfygpwiauamxud",
    },
});

//midddleware function to send email
const sendEmail = (req, res, next) => {
    const {to, subject, text, html} = req.body;

    let mailOptions = {
        from : '"ConnectSphere" <pcwanjari11@gmail.com>',
        to : email,
        subject,
        text,
        html, 
    };

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            return res.status(500).send("Error sending email");
        }
        console.log("Message sent : %s", info.messageId);
        next();
    });

};

module.exports = sendEmail;