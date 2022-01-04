const express = require("express");
const app = express();
const connectDB = require("./config/db");
connectDB();
const PORT = 3000;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/authentication" , require("./Routes/authentication"))
app.use("/events" , require("./Routes/crud_events"))
app.listen(PORT , ()=>{
    console.log(`server running at http://localhost:${PORT}`)
});
