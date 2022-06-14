const mongoose = require("mongoose");
const validators= require("validators");
const passwordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




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
    },
    tokens:  [{
         token:{
                type:String ,
                required :true
         }
    }]
})

// generating jwt for user login 
employeeSchema.methods.generateAuthToken= async function(){
        try{
           const token = jwt.sign({_id:this._id}, "thisisarandomtextandthistextistogeneratetoken",{expiresIn:"3000s"});
           this.tokens = this.tokens.concat({token});
           await this.save();
           console.log(token);
           return token ; 
        }catch(err){
              res.send(err);
        }
};



// Before making collection generating hash bcrypt password
employeeSchema.pre("save" , async function(next) {
     if(this.isModified("password")){
        
        this.password =  await bcrypt.hash(this.password, 10); 
        console.log(`the current hashpassword is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password ,10)
     }
        next();
})



// Creating collection 

const Register = new mongoose.model("Register" , employeeSchema);

module.exports = Register;