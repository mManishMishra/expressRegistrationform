const mongoose = require("mongoose");
const validators= require("validators");
const passwordValidator = require("password-validator");





const employeeSchema = new mongoose.Schema({
    name:{
           type:String,
           required:true
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
    },
    password:{
            type:String,
            required:true
    },
    confirmpassword : {
          type:String,
          required:true
    }
})

// Creating collection 

const Register = new mongoose.model("Register" , employeeSchema);

module.exports = Register;