// our events like get , post , put , delete
const express = require("express");
const router = express.Router();

const Event = require("../Models/Event_schema"); // requiring event schema for the below operations
const isAuth = require("../middleware/is_auth"); // applying isauth middleware to check the authorization before every request

// we passed the middleware in all the routes below
// now all these routes should have token in its header before they access

// getting all events
router.get("/" ,isAuth ,async(req , res)=>{
    try {
        const event = await Event.find();
        res.status(200).json({event});
    } catch (err) {
        console.log(error);
        res.status(500).json({error : "server error"});
    }
});

// creating an event
router.post("/" , isAuth,async(req , res)=>{
    const { title , description ,date} = req.body;
    try {
        const event = new Event({
            title,
            description,
            date
        });
        const new_Event = await event.save(); 
        res.status(201).json({event : new_Event}); // 201 status code - created
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "server error"});        
    }
});

// udpating an event 
router.put("/:id" , isAuth,async(req , res)=>{
    const eventID = req.params.id;
    try {
        //for updating we need to require the title and other things
        const {title , description , date} = req.body;
        const updatedevent = {};
        if (title) updatedevent.title = title;
        if (description) updatedevent.description = description;
        if (date) updatedevent.date= date;

        const event = await Event.findByIdAndUpdate(eventID , { $set : updatedevent} , {new : true});
        res.status(201).json({event});
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "server error"});
    }

});

// deleting an event
router.delete("/:id" , isAuth,async(req , res)=>{
    const eventID = req.params.id;
    try {
      await Event.findByIdAndRemove(eventID);
      res.status(200).json({ msg: "Event Removed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

module.exports = router;