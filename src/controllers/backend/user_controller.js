const config = require('../../configs/config');
const nodemailer = require('nodemailer')
const ContactModel = require(`${__path_models}contact_model`)



//gửi mail
const sendContactMail = async(firstname,lastname,email,token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS:true,
            auth: {
            user:config.emailUser, // generated ethereal user
            pass:config.emailPassword , // generated ethereal password
            },
        });

        
        const mailOption = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: "Thanks For Contact", // Subject line
            text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
            html: '<p>Xin Chào '+ firstname +' '+ lastname +',' + 'Cảm ơn bạn để liên hệ với chúng tôi </a>.</p>'
        } 
        transporter.sendMail(mailOption,function (error,info) {
            if (error) {
                console.log(error)
            } else {
                console.log("email has been sent",info.response)
            }
        })
        

    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}

const contact = async (req , res , next) => {
    try {

        const contact = new ContactModel({
            email       : req.body.email,
            firstname   : req.body.firstname,
            lastname    : req.body.lastname,
            mobile      : req.body.mobile,
            content     : req.body.content
        })

        const user_data = await contact.save();
        sendContactMail(user_data.firstname,user_data.lastname,user_data.email)
        res.status(200).send({success: true,data: user_data})
    }
    catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}

module.exports = {
    contact,
    
}
