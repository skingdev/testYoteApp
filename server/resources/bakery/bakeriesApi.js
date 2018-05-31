/**
 * CRUD API for Bakery.
 *
 * NOTE:
 * to restrict routes to only logged in users, add "requireLogin()"
 * to restrict routes to only admin users, add "requireRole('admin')"
 */

var bakeries = require('./bakeriesController');

module.exports = function(router, requireLogin, requireRole) {

  // - Create
  router.post('/api/bakeries'               , requireLogin(), bakeries.create); // must login by default

  // - Read
  router.get('/api/bakeries'                , bakeries.list);
  router.get('/api/bakeries/search'         , bakeries.search);
  router.get('/api/bakeries/by-:refKey/:refId*'  , bakeries.listByRefs);
  router.get('/api/bakeries/by-:refKey-list'    , bakeries.listByValues);
  router.get('/api/bakeries/:id'            , bakeries.getById);

  // - Update
  router.put('/api/bakeries/:id'            , requireLogin(), bakeries.update); // must login by default

  // - Delete
  router.delete('/api/bakeries/:id'         , requireRole('admin'), bakeries.delete); // must be an 'admin' by default

}
