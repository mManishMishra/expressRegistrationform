const { default: mongoose } = require("mongoose")

mongoose.connect("mongodb://localhost:27017/registrationform", {useNewUrlParser:true,
        useUnifiedTopology:true}).then(()=>{
            console.log("connected to mongodb Database");
        }).catch((err)=>{
            console.log(err);
        })

