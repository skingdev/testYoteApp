/**
 * Data Model for Shirt.
 *
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add properties to the
 * productSchema below, the create and update controllers
 * will respect the updated model.
 *
 * NOTE: make sure to account for any model changes on the client
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.SchemaTypes.ObjectId;

// define shirt schema
const shirtSchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }

  // specific values for shirt go below
  , name:                   { type: String, required: '{PATH} is required!' }
  , color:                  { type: String }
  , size:                   { type: String, enum: ['s', 'm','l'], default: 's' }

});

// shirt instance methods go here
// shirtSchema.methods.methodName = function() {};

// shirt model static functions go here
// shirtSchema.statics.staticFunctionName = function() {};

const Shirt = mongoose.model('Shirt', shirtSchema);


// // shirt model methods
// function createDefaults() {
//   Shirt.find({}).exec(function(err, shirts) {
//     if(shirts.length == 0) {
//       Shirt.create({
//         name: "Sample Shirt Name!"
//       });
//       logger.info("created initial shirt defaults");
//     }
//   });
// }
//
// exports.createDefaults = createDefaults;
