/**
 * CRUD API for Shirt.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var shirts = require('./shirtsController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/shirts'               , requireLogin(), shirts.create); // must login by default

  // - Read
  router.get('/api/shirts'                , shirts.list);
  router.get('/api/shirts/search'         , shirts.search);
  router.get('/api/shirts/by-:refKey/:refId*'  , shirts.listByRefs);
  router.get('/api/shirts/by-:refKey-list'    , shirts.listByValues);
  router.get('/api/shirts/:id'            , shirts.getById);

  // - Update
  router.put('/api/shirts/:id'            , requireLogin(), shirts.update); // must login by default

  // - Delete
  router.delete('/api/shirts/:id'         , requireRole('admin'), shirts.delete); // must be an 'admin' by default

}
