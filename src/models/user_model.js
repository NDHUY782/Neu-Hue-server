const { Schema , model } = require("mongoose")

const bcrypt = require('bcrypt')

const UserModel = new Schema({
    hoten: {
        type : String,
    },
    password : {
        type: String,
        require: true
    },
    diachi : {
        type : String,
    },
    email: {
        type: String,
        require:true,
    },
    mobile: {
        type: String,
    },
    created: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date,
    },
    token: {
        type:String,
        default: '',
    },

}, {
    timestamps : true
}) 

// userModel.pre("save" , async function(next) {
//          if(!this.isModified('password')) {
//             return(next)
//          }
//          const hash = await  bcrypt.genSalt(10)
//          .then((salt => bcrypt.hash(this.password, salt)));
//          this.password = hash;
//          next()

//     })

module.exports = model('users' , UserModel)
