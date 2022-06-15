require("dotenv").config();
const express =  require("express");
const app = express();
const path = require("path");
const hbs =  require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

// console.log(process.env);

require("./db/conn");
const Register = require("./models/registers");

const port =  process.env.PORT ||3001;

// Joining Path
const static_path = path.join(__dirname , "../public");
const views_path =path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname ,"../templates/partials");


// using express to convert json response of server

app.use(express.json());
// converting server response
app.use(express.urlencoded({extended:false}));

// using cookie parser
app.use(cookieParser());

// setting hbs as our static page serve
 app.set('view engine', 'hbs');
 app.set('views', views_path);
 hbs.registerPartials(partials_path);
 app.use(express.static(static_path));

 

// Rendering Pages 
app.get("/", (req, res)=>{
    res.render("index");
});
app.get("/register", (req, res)=>{
    res.render('register');
});

// Creating new user in database 
app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const conmpassword = req.body.confirmpassword ;
        if(password === conmpassword){
            const registerEmployee = new Register({
                name : req.body.name,
                email : req.body.email,
                password:password,
                confirmpassword:conmpassword
            })


            // Generating jwt token for users registeration 


            const token = await registerEmployee.generateAuthToken();

            // Creating cookie for every user registration

            res.cookie("jwt", token, {
                expires: new Date(Date.now()+30000), httpOnly:true
            });
            console.log(cookie);

            // middleware pre and post concept
             const registered = await  registerEmployee.save();
             console.log(registered);
             res.status(201).render("login");
        }else{
            res.status(404).send("Password Not Matching");
        }
    }catch(err){
        res.status(500).send(err);
    }
})
app.get("/login", (req, res)=>{
    res.render('login');
});

app.get("/ofuser", auth,(req, res)=>{
    // console.log(`this is cookie from login ${req.cookies.jwt}`);
    res.render('ofuser');
});
app.get("/content",auth,(req, res)=>{
    res.render('content');
});

// Logout using cookies
app.get("/logout",auth , async(req,res)=>{
    try{
        console.log(req.user);
    //  using filter method to clear single cookie-token from database aka ogout from a single device
    //   req.user.tokens = req.user.tokens.filter((currToken)=>{
    //     return currToken.token !== req.token ; 
    //   })
        





    // Logout from all devices
        req.user.tokens = [];
     // Clearing current cookie from user login 
       res.clearCookie("jwt");
       console.log("User Logout");  


    //    Saving after user logout
       await req.user.save();

       res.render("index");
      }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

 
// Login Check for valid login
app.post("/login",  async(req,res)=>{
     
    try{
     const email = req.body.email;
     const password = req.body.password;

     const userEmail = await Register.findOne({email:email});

     const isMatch =await bcrypt.compare(password , userEmail.password);

     const token = await userEmail.generateAuthToken();
        // adding cookie at every user login 
        res.cookie("jwt", token, {
            expires: new Date(Date.now()+300000), httpOnly:true 
            // , secure :true
        });

        //  Getting cookie 
     if(isMatch){
        
     console.log(`the jwt for current user login is ${token}`);
           res.status(201).render("content")
     }else{
        res.render("error");
     }

    }catch(err){
        res.status(500).send(err);
    }

})


app.get("*", (req, res)=>{
    res.render('error');
});

// Learning jwt 
// const jwt = require("jsonwebtoken");

// const createToken = async()=>{
//     const token = await jwt.sign({_id:"62a76a9b0b243c7676b770df"},"thisisrandomtextforgeneratingjwttoken");
//     console.log(token);

//     const userVerify = await jwt.verify(token,"thisisrandomtextforgeneratingjwttoken");
//     console.log(userVerify );
// }

// createToken();



// connecting to host site

app.listen(port,()=>{
    console.log(`server is running at :${port}`);
});