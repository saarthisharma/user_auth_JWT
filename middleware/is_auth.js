// creating a middleware to send token on every request received on the server
const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = (req , res , next)=>{
    // checking token in the header
    const authHeader = req.header('Authorization'); //authorization is the key we save our token to
    // in this authorization key we received our token
     
    if(!authHeader){ //checking if empty or not true
        return res.status(401).json({error :"unauthorized access"});
    }
    try {
        //verify the token that is received in authheader and compare with the secret key
        const decode_token = jwt.verify(authHeader , config.get("JWT_secret")); //decode the token if it is valid
        // saving decoded token 
        req.userID = decode_token.user._id;
        console.log(req.userID);
        console.log(decode_token);

        next();
    } catch (err) {
        return res.status(401).json({error :"unauthorized access"});
    }
};