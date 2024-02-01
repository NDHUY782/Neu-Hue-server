
const UserModel = require('../../models/user_model');
const bcrypt = require('bcrypt');
const config = require('../../configs/config');
const jwt    = require('jsonwebtoken')
const randormString = require("randomstring")
const nodemailer = require('nodemailer')
const ContactModel = require(`${__path_models}contact_model`)
const passport = require('passport')

//tạo token
const create_token = async (id) => {
    try {
        
        const token = await jwt.sign({ _id:id }, config.secret_jwt)
        return token;


    } catch (error) {
        res.status(400).send(error.message)
    }
}
//mã hóa password
const securePassword = async (password) => {
    try {
    //    if(this.authType !== 'local') next()
       const passwordHash = await  bcrypt.hash(password,10)
       return passwordHash
    } catch (error) {
        res.status(400).send(error.message)
    }
}
//đăng ký user
const register_user = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password)

         const user = new UserModel({
            password : spassword,
            email    : req.body.email,
            diachi   : req.body.diachi,
            mobile   : req.body.mobile,
            hoten    : req.body.hoten,
        })

        const userData = await UserModel.findOne({email: req.body.email});
        if (userData) {
            res.status(400).send({success: false,msg:" Email đã được sử dụng"})
        } else {
            const user_data = await user.save();
            res.status(200).send({success: true,data: user_data})
        }


    } catch (error) {
        res.status(400).send(error.message)
    }
};
//đăng nhập user
const user_login = async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await UserModel.findOne({email: email});

        if (userData) {
            const password_Login =  await bcrypt.compare(password, userData.password)

            if (password_Login) {

                const tokenData = await create_token(userData._id)
                const userResult = {
                    _id      :    userData._id,
                    password :    userData.password,
                    email    :    userData.email,
                    hoten    :    userData.hoten,
                    mobile   :    userData.mobile,
                    diachi   :    userData.diachi,
                    token    :    tokenData,
 
                }
                const response = {
                    success  :      true,
                    data     :      userResult,
                }
                res.status(200).send(response)

            } else {
                res.status(400).send({success: false,msg:"Tài Khoản Hoặc Mật Khẩu Không Chính Xác"})
            }
        } else {
            res.status(400).send({success: false,msg:"Tài Khoản Hoặc Mật Khẩu Không Chính Xác_1"})
        }

    } catch (error) {
        res.status(400).send(error)
    }
}

//quên password
const forget_password = async (req,res) => {
    try {
        const email = req.body.email;
        const userData = await UserModel.findOne({ email : email }) 

        if (userData) {

            const randomString = randormString.generate();
            const data = await UserModel.updateOne({email:email},{$set:{ token:randomString}})
            sendResetPasswordMail(userData.hoten,userData.email,randomString);
            res.status(200).send({success: true,msg:"Please Check Your Mail"})


        } else {
            res.status(400).send({success: false,msg:"Tài Khoản Email Không Chính Xác"})
        } 
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
const reset_password = async (req,res) => {
    try {
        const token = req.query.token;
        const tokenData = await UserModel.findOne({token:token})
        if (tokenData) {

            const password = req.body.password;
            const newPassword = await securePassword(password);
            const userData = await UserModel.findByIdAndUpdate({_id:tokenData._id},{$set:{ password: newPassword, token:''}},{new:true})
            res.status(200).send({success: true,msg:"Password Đã Được Thay Đổi",data:userData})

        } else {
            res.status(400).send({success: false,msg:"Đường Dẫn Không Tồn Tại"})
        }
    } catch (error) {
        res.status(400).send({success: false,msg:error.message})
    }
}
//gửi mail resetpass
const sendResetPasswordMail = async(hoten,email,token) => {
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
            subject: "For reset passsword", // Subject line
            text: "Xin Cảm Ơn - Chúc Bạn Có 1 Ngày Tốt Lành", // plain text body
            html: '<p>Xin Chào '+ hoten +',Hãy Bấm Vào Đây <a href="https://dd-eshop.vercel.app/reset-password/'+ token + '"> Để Thay Đổi Password </a> Của Bạn.</p>'
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

    register_user,
    user_login,
    forget_password,
    reset_password,
    contact,
}
