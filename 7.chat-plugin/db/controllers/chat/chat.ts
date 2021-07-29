const express = require('express');
const Room = require("../../models/chatModel.ts")
const router = express.Router();
const util = require('util') /**use to implement console.dir in CLI */

/**
 *
 * Create and store new academy
 * @param {string} room.name
 * @param {number} room.ID
 * @param {string} room.createdAt
 * @param {string} room.updatedAt
 * Endpoint : POST http://localhost:<port>/chat
 */

router.post("/", async (req, res) => {
  const {
    name,
    mail,
    roomID,
    accountID,
  } = req.body;


  const roomInstance = new Room({
    name,
    mail,
    roomID,
    accountID,
  });

  try{
  //step 1 - save in db
    const resp = await roomInstance.save();
    res.status(201).json(resp);

  }
  catch(err){
        res.status(400).json(err);
        console.log(err);
   }
 
});

// /**
//  * Delete a specific academy
//  * @param {objectId} id - workiz rule id
//  * @return {Notifications}
//  * Endpoint : DELETE http://localhost:<port>/academy/<id>
//  */
// router.delete("/delete/:id", async (req, res) => {
//   try{
//     const academyID = req.params.id;
//     const resp = await Academy.findById(academyID);
//     resp.Delete();
//     resp.save()

//        res.status(200).json(resp);
//     }
  
//   catch(err){
//      res.status(400).json(err.message);
//      winston.error(err);
// }
// });

/**
 * Get a specific rule
 * @param {objectId} id 
 * @return {msgs}
 * Endpoint : GET http://localhost:<port>/chat/<id>
 */
router.get("/:mail", async (req, res) => {
  try{
    const mail = req.params.mail;
    const resp = await Room.findOne({mail: mail});

    res.status(200).json(resp);
  }
  catch(err){
     res.status(400).json(err);
     console.log(err);

}
});

/**
 * Get a specific rule
 * @param {objectId} id 
 * @return {msgs}
 * Endpoint : GET http://localhost:<port>/chat/<id>
 */
 router.get("/getClientByRoom/:room", async (req, res) => {
   console.log("im hereeeeee");
  try{
    const room = req.params.room;
    console.log("the room is: ", room);
    const resp = await Room.findOne({roomID: room});

    res.status(200).json(resp);
  }
  catch(err){
     res.status(400).json(err);
     console.log(err);

}
});

/**
 * Get a specific rule
 * @param {objectId} id 
 * @return {msgs}
 * Endpoint : GET http://localhost:<port>/chat/<id>
 */
 router.get("/getAllRooms/:id", async (req, res) => {
    try{
      const id = req.params.id;
      // make the sort work
      const resp = await Room.find({accountID: parseInt(id)}, 'name mail roomID read updatedAt').sort({updatedAt: -1});
  
      res.status(200).json(resp);
    }
    catch(err){
       res.status(400).json(err);
       console.log(err);
  
  }
  });

  /**
 * Get a specific rule
 * @param {objectId} id 
 * @return {msgs}
 * Endpoint : GET http://localhost:<port>/chat/<id>
 */
 router.get("/getMsgs/:mail", async (req, res) => {
    try{
      const mail = req.params.mail;
      const resp = await Room.findOne({mail: mail}, 'msgs');
  
      res.status(200).json(resp);
    }
    catch(err){
       res.status(400).json(err);
       console.log(err);
  
  }
  });


/**
 * Update a specific rule
 * @param {Array<msg>} rooms.msgs
 * @param {boolean} rule.deleted
 * @return {Notification}
 * Endpoint : PUT http://localhost:<port>/chat/<id>
 */
router.put("/addMsg/:mail", async (req, res) => {
  try{
    const mail = req.params.mail;
    const msg = req.body;
    const resp = await Room.updateOne({ mail: mail }, { $push: {msgs: msg} });
    res.status(200).json(resp);
  }
  catch(err){
     res.status(400).json(err.message);
    console.log(err);

}
});

/**
 * Update a specific rule
 * @param {Array<msg>} rooms.msgs
 * @param {boolean} rule.deleted
 * @return {Notification}
 * Endpoint : PUT http://localhost:<port>/chat/<id>
 */
 router.put("/setRoom/:mail", async (req, res) => {
  try{
    const mail = req.params.mail;
    const msg = req.body;
    const resp = await Room.updateOne({ mail: mail }, msg );
    res.status(200).json(resp);
  }
  catch(err){
     res.status(400).json(err.message);
    console.log(err);
}
});

/**
 * Update a specific rule
 * @param {Array<msg>} rooms.msgs
 * @param {boolean} rule.deleted
 * @return {Notification}
 * Endpoint : PUT http://localhost:<port>/chat/<id>
 */
 router.put("/set/:mail", async (req, res) => {
  try{
    const mail = req.params.mail;
    const dataToSet = req.body;
    const resp = await Room.updateOne({ mail: mail }, dataToSet);
    res.status(200).json(resp);
  }
  catch(err){
     res.status(400).json(err.message);
    console.log(err);
}
});



module.exports = router
