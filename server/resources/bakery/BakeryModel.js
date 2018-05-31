/**
 * Data Model for Bakery.
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

// define bakery schema
const bakerySchema = mongoose.Schema({
  // default values from Yote CLI
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }

  // specific values for bakery go below
  , name:                   { type: String, required: '{PATH} is required!' }
  , address:                { type: String}
  , city:                   { type: String}
  , state:                  { type: String}
  , zip:                    { type: Number}

});

// bakery instance methods go here
// bakerySchema.methods.methodName = function() {};

// bakery model static functions go here
// bakerySchema.statics.staticFunctionName = function() {};

const Bakery = mongoose.model('Bakery', bakerySchema);


// // bakery model methods
// function createDefaults() {
//   Bakery.find({}).exec(function(err, bakeries) {
//     if(bakeries.length == 0) {
//       Bakery.create({
//         name: "Sample Bakery Name!"
//       });
//       logger.info("created initial bakery defaults");
//     }
//   });
// }
//
// exports.createDefaults = createDefaults;
