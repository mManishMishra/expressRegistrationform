
const express =  require("express");
const path = require("path");
const hbs =  require("hbs");

const app = express();
require("./db/conn");
const Register = require("./models/registers");

const port =  process.env.PORT ||3001;

// Joining Path
const static_path = path.join(__dirname , "../public");
const views_path =path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname ,"../templates/partials");


// using express to convert json response of server

app.use(express.json());
   app.use(express.urlencoded({extended:false}));

// setting hbs as our static page serve
 app.set('view engine', 'hbs');
 app.set('views', views_path);
 hbs.registerPartials(partials_path);
 app.use(express.static(static_path));

 

// Rendering Pages 
app.get("/", (req, res)=>{
    res.render('index');
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
             const registered = await  registerEmployee.save();
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

app.get("/terms", (req, res)=>{
    res.render('terms');
});
app.get("/content", (req, res)=>{
    res.render('content');
});
app.get("*", (req, res)=>{
    res.render('error');
});



// Login Check for valid login
app.post("/login",  async(req,res)=>{
     
    try{
     const email = req.body.email;
     const password = req.body.password;

     const useremail = await Register.findOne({email:email});

     if(useremail.password===password){
           res.status(201).render("content")
     }else{
        res.render("error");
     }

    }catch(err){
        res.status(500).send(err);
    }

})




// connecting to host site

app.listen(port,()=>{
    console.log(`server is running at :${port}`);
});