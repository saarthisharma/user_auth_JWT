const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const res = require("express/lib/response");
const router = express.Router();

// for auth we need to require a user
const User = require("../Models/User");

// register route
router.post("/register" , async(req ,res) =>{
    const{username , email , password } = req.body;
    console.log(req.body);

    try {
        // check if user already have an account or not
        // checking from our User model we define in user schema
        let user = await User.findOne({email});

        // if user already have an account then
        if(user)
        {
            return res.send.status(400).json( { error : "user already exists in the database"});
        }
        // else he has to register for a new account
        else
        {
            const hashedpwd = await bcrypt.hash(password , 12);
            user = new User({
                username,
                email,
                password :hashedpwd
            }); // new user is created
            const newUser = await user.save(); // mongoose function to save user data to the database 

            // once the user is successfully created , we as a server sent response to the
            // browser that now user is created he can now authorize to use our application with tokens

            //creating jwt tokens for auth and authorization
            // payload contains the user data i.e user id
            const payload = {
                user : {
                    _id : newUser._id
                },
            }
            // jwt need payload and a secret or private key
            // (this sercet key will be used by our server to ensure that the token is valid)

            const token = jwt.sign(payload , config.get("JWT_secret") ,{expiresIn : '1hr'});
            //once this token is generated , we as a server are responding to the client 
            res.status(201).json( {token} );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "server error"});
    }
})

// login route
router.post("/login" , async(req ,res) =>{
    const {email , password} = req.body; //extracting email and pwd from request body
    try {
        // check if user is already registered or not , find email it has just received from the request body
        let user = await User.findOne( {email});
        if(!user)
        {
            return res.status(400).json({error : "Register yourself first"});
        }
        // comparing password from previously saved while registering
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch)
        {
            return res.status(400).json({error : "Invalid credentials"});
        }// if the password is matched successfully we authenticated the user successfully

        const payload = {
            user : {
                _id : user._id
            },
        };
        const token = jwt.sign(payload , config.get("JWT_secret") ,{expiresIn : '1hr'});
        res.status(201).json( {token} );
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "server error"}); 
    }
});

module.exports = router;