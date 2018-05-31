/**
 * Sever-side controllers for Bakery.
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add fields to the Bakery
 * model, the create and update controllers below will respect
 * the new schema.
 *
 * NOTE: HOWEVER, you still need to make sure to account for
 * any model changes on the client
 */

let Bakery = require('mongoose').model('Bakery');

exports.list = (req, res) => {
  if(req.query.page) {
    // paginate on the server
    var page = req.query.page || 1;
    var per = req.query.per || 20;
    Bakery.find({}).skip((page-1)*per).limit(per).exec((err, bakeries) => {
      if(err || !bakeries) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({success: false, message: err});
      } else {
        res.send({
          success: true
          , bakeries: bakeries
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    // list all bakeries
    Bakery.find({}).exec((err, bakeries) => {
      if(err || !bakeries) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, bakeries: bakeries });
      }
    });
  }
}

exports.listByValues = (req, res) => {
  /**
   * returns list of bakeries queried from the array of _id's passed in the query param
   *
   * NOTES:
   * node default max request headers + uri size is 80kb.
   */

  if(!req.query[req.params.refKey]) {
    // make sure the correct query params are included
    res.send({success: false, message: `Missing query param(s) specified by the ref: ${req.params.refKey}`});
  } else {
    Bakery.find({[req.params.refKey]: {$in: [].concat(req.query[req.params.refKey]) }}, (err, bakeries) => {
        if(err || !bakeries) {
          res.send({success: false, message: `Error querying for bakeries by ${[req.params.refKey]} list`, err});
        } else  {
          res.send({success: true, bakeries});
        }
    })
  }
}

exports.listByRefs = (req, res) => {
  /**
   * NOTE: This let's us query by ANY string or pointer key by passing in a refKey and refId
   */

   // build query
  let query = {
    [req.params.refKey]: req.params.refId === 'null' ? null : req.params.refId
  }
  // test for optional additional parameters
  const nextParams = req.params['0'];
  if(nextParams.split("/").length % 2 == 0) {
    // can't have length be uneven, throw error
    res.send({success: false, message: "Invalid parameter length"});
  } else {
    if(nextParams.length !== 0) {
      for(let i = 1; i < nextParams.split("/").length; i+= 2) {
        query[nextParams.split("/")[i]] = nextParams.split("/")[i+1] === 'null' ? null : nextParams.split("/")[i+1]
      }
    }
    Bakery.find(query, (err, bakeries) => {
      if(err || !bakeries) {
        res.send({success: false, message: `Error retrieving bakeries by ${req.params.refKey}: ${req.params.refId}`});
      } else {
        res.send({success: true, bakeries})
      }
    })
  }
}

exports.search = (req, res) => {
  // search by query parameters
  // NOTE: It's up to the front end to make sure the params match the model
  let mongoQuery = {};
  let page, per;

  for(key in req.query) {
    if(req.query.hasOwnProperty(key)) {
      if(key == "page") {
        page = parseInt(req.query.page);
      } else if(key == "per") {
        per = parseInt(req.query.per);
      } else {
        logger.debug("found search query param: " + key);
        mongoQuery[key] = req.query[key];
      }
    }
  }

  logger.info(mongoQuery);
  if(page || per) {
    page = page || 1;
    per = per || 20;
    Bakery.find(mongoQuery).skip((page-1)*per).limit(per).exec((err, bakeries) => {
      if(err || !bakeries) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true
          , bakeries: bakeries
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    Bakery.find(mongoQuery).exec((err, bakeries) => {
      if(err || !bakeries) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, bakeries: bakeries });
      }
    });
  }
}

exports.getById = (req, res) => {
  logger.info('get bakery by id');
  Bakery.findById(req.params.id).exec((err, bakery) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if (!bakery) {
      logger.error("ERROR: Bakery not found.");
      res.send({ success: false, message: "Bakery not found." });
    } else {
      res.send({ success: true, bakery: bakery });
    }
  });
}

exports.create = (req, res) => {
  logger.info('creating new bakery');
  let bakery = new Bakery({});

  // run through and create all fields on the model
  for(var k in req.body) {
    if(req.body.hasOwnProperty(k)) {
      bakery[k] = req.body[k];
    }
  }

  bakery.save((err, bakery) => {
    if (err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!bakery) {
      logger.error("ERROR: Could not create Bakery.");
      res.send({ success: false, message: "Could not create Bakery." });
    } else {
      logger.info("created new bakery");
      res.send({ success: true, bakery: bakery });
    }
  });
}

exports.update = (req, res) => {
  logger.info('updating bakery');
  Bakery.findById(req.params.id).exec((err, bakery) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!bakery) {
      logger.error("ERROR: Bakery not found.");
      res.send({ success: false, message: "Bakery not found." });
    } else {
      // run through and update all fields on the model
      for(var k in req.body) {
        if(req.body.hasOwnProperty(k)) {
          bakery[k] = req.body[k];
        }
      }
      // now edit the 'updated' date
      bakery.updated = new Date();
      bakery.save((err, bakery) => {
        if(err) {
          logger.error("ERROR:");
          logger.info(err);
          res.send({ success: false, message: err });
        } else if(!bakery) {
          logger.error("ERROR: Could not save bakery.");
          res.send({ success: false, message: "Could not save bakery."});
        } else {
          res.send({ success: true, bakery: bakery });
        }
      });
    }
  });
}

exports.delete = (req, res) => {
  logger.warn("deleting bakery");
  Bakery.findById(req.params.id).remove((err) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted bakery" });
    }
  });
}
