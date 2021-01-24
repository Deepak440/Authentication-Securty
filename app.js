//jshint esversion:6
require('dotenv').config();
const express  = require("express");
const bodyParser = require("body-parser");
const ejs  = require("ejs");
const mongoose  = require("mongoose");
// const { stringify } = require("querystring");
const encrypt = require("mongoose-encryption");
const { Console } = require('console');


const app  = express();

app.use(express.static("public"));
app.set("view engine" ,"ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser :true});

// Schema
// console.log(process.env.API_KEY);
const userSchema = new mongoose.Schema({
    email : String,
    password :String 
});


// Add plugin before creating the mongoose model as passing a 
userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ["password"]   }); // to specify the fields to encrypt


 const User  = new mongoose.model("User" , userSchema);

app.get("/" , function(req ,res)
{
    res.render("home");
});
app.get("/login" , function(req ,res)
{
    res.render("login");
});
app.get("/register" , function(req ,res)
{
    res.render("register");
});

app.post("/register" , function(req ,res)
{
    const newUser  = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save(function(err)
    {
        if(err)
        {
            console.log(err);

        }
        else{
            res.render("secrets");
        }
    });


});

app.post("/login", function(req , res)
{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email : username}, function(err , FoundUser)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            if(FoundUser)
            {
                if(FoundUser.password === password)
                {
                    res.render("secrets");
                }
                else
                {
                    console.log("Incorrect Password");
                }
            }
        }
    });
});



app.listen(3000, function()
{
    console.log("Server is running on port 3000");
});