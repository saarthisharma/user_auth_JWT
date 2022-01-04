const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventschema = new Schema(
    {
        title: {
            type:String,
            required:true,
        },
        description: {
            type:String,
            required:true,
        },
        date: {
            type:String,
            required:true,
        },
    },
    {timestamps : true}
);
// we will create a collection(i.e table) = Event
const Event = new mongoose.model("Event" , eventschema);
module.exports = Event;