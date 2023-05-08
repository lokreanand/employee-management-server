const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("emp")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("emp")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

//this will give manager's username and password
recordRoutes.route("/manager/").get(function (req, res) {
  let db_connect = dbo.getDb();
  
  db_connect
      .collection("manager")
      .find({})
      .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });

});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  console.log("25")
  console.log(req.body.tasks.length);
  
  let myobj = {
    emp_id: req.body.emp_id,
    name: req.body.name,
    position: req.body.position,
    department: req.body.department,
    level: req.body.level,
    tasks: []
  };
  console.log(myobj)
  db_connect.collection("emp").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();  
  let myquery = { _id: ObjectId( req.params.id )};  
  let newvalues = {    
    $set: {      
      name: req.body.name,     
      position: req.body.position,      
      level: req.body.level,    
  }};
 console.log(newvalues);

  db_connect.collection("emp").updateOne(myquery, newvalues, function(err,res){
    if (err) throw err;
    console.log("1 document updated"); 
    response.json(res);
  });
});
recordRoutes.route("/addtask/:id").post(function (req, response) {
  console.log("add")
  let db_connect = dbo.getDb();  
  let myquery = { _id: ObjectId( req.params.id )};  
  let newvalues = {    
    $push: {      
      tasks: 
        {
          task_name:req.body.task_name,
          task_details:req.body.task_details
        }       
  }};
 console.log(newvalues);

  db_connect.collection("emp").updateOne(myquery, newvalues, function(err,res){
    if (err) throw err;
    console.log("1 document updated"); 
    response.json(res);
  });
});
// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("emp").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;