const jwt = require("jsonwebtoken");
const Register = require("../models/registers");



const auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt ;
        const verifyUser = jwt.verify(token, process.env.SECRET_Key);
        console.log(verifyUser);

        // Getting all the user info from jwt cookie token 
        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user);

          req.token = token ;
          req.user = user;

        next();
      }catch(err){
        res.status(404).render(err);
    }
}


module.exports= auth ;