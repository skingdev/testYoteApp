/**
 * Sever-side controllers for Shirt.
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add fields to the Shirt
 * model, the create and update controllers below will respect
 * the new schema.
 *
 * NOTE: HOWEVER, you still need to make sure to account for
 * any model changes on the client
 */

let Shirt = require('mongoose').model('Shirt');

exports.list = (req, res) => {
  if(req.query.page) {
    // paginate on the server
    var page = req.query.page || 1;
    var per = req.query.per || 20;
    Shirt.find({}).skip((page-1)*per).limit(per).exec((err, shirts) => {
      if(err || !shirts) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({success: false, message: err});
      } else {
        res.send({
          success: true
          , shirts: shirts
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    // list all shirts
    Shirt.find({}).exec((err, shirts) => {
      if(err || !shirts) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, shirts: shirts });
      }
    });
  }
}

exports.listByValues = (req, res) => {
  /**
   * returns list of shirts queried from the array of _id's passed in the query param
   *
   * NOTES:
   * node default max request headers + uri size is 80kb.
   */

  if(!req.query[req.params.refKey]) {
    // make sure the correct query params are included
    res.send({success: false, message: `Missing query param(s) specified by the ref: ${req.params.refKey}`});
  } else {
    Shirt.find({[req.params.refKey]: {$in: [].concat(req.query[req.params.refKey]) }}, (err, shirts) => {
        if(err || !shirts) {
          res.send({success: false, message: `Error querying for shirts by ${[req.params.refKey]} list`, err});
        } else  {
          res.send({success: true, shirts});
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
    Shirt.find(query, (err, shirts) => {
      if(err || !shirts) {
        res.send({success: false, message: `Error retrieving shirts by ${req.params.refKey}: ${req.params.refId}`});
      } else {
        res.send({success: true, shirts})
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
    Shirt.find(mongoQuery).skip((page-1)*per).limit(per).exec((err, shirts) => {
      if(err || !shirts) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true
          , shirts: shirts
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    Shirt.find(mongoQuery).exec((err, shirts) => {
      if(err || !shirts) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, shirts: shirts });
      }
    });
  }
}

exports.getById = (req, res) => {
  logger.info('get shirt by id');
  Shirt.findById(req.params.id).exec((err, shirt) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if (!shirt) {
      logger.error("ERROR: Shirt not found.");
      res.send({ success: false, message: "Shirt not found." });
    } else {
      res.send({ success: true, shirt: shirt });
    }
  });
}

exports.create = (req, res) => {
  logger.info('creating new shirt');
  let shirt = new Shirt({});

  // run through and create all fields on the model
  for(var k in req.body) {
    if(req.body.hasOwnProperty(k)) {
      shirt[k] = req.body[k];
    }
  }

  shirt.save((err, shirt) => {
    if (err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!shirt) {
      logger.error("ERROR: Could not create Shirt.");
      res.send({ success: false, message: "Could not create Shirt." });
    } else {
      logger.info("created new shirt");
      res.send({ success: true, shirt: shirt });
    }
  });
}

exports.update = (req, res) => {
  logger.info('updating shirt');
  Shirt.findById(req.params.id).exec((err, shirt) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!shirt) {
      logger.error("ERROR: Shirt not found.");
      res.send({ success: false, message: "Shirt not found." });
    } else {
      // run through and update all fields on the model
      for(var k in req.body) {
        if(req.body.hasOwnProperty(k)) {
          shirt[k] = req.body[k];
        }
      }
      // now edit the 'updated' date
      shirt.updated = new Date();
      shirt.save((err, shirt) => {
        if(err) {
          logger.error("ERROR:");
          logger.info(err);
          res.send({ success: false, message: err });
        } else if(!shirt) {
          logger.error("ERROR: Could not save shirt.");
          res.send({ success: false, message: "Could not save shirt."});
        } else {
          res.send({ success: true, shirt: shirt });
        }
      });
    }
  });
}

exports.delete = (req, res) => {
  logger.warn("deleting shirt");
  Shirt.findById(req.params.id).remove((err) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted shirt" });
    }
  });
}
