const { default: mongoose } = require("mongoose")
require("dotenv").config();


mongoose.connect(process.env.DB_localhost, {useNewUrlParser:true,
        useUnifiedTopology:true}).then(()=>{
            console.log("connected to mongodb Database");
        }).catch((err)=>{
            console.log(err);
        })

