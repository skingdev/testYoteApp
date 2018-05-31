/**
 * Reads and exports the reducers as defined by each resource module
 *
 * NOTE: this facilitates adding reducers via the CLI
 */

export { default as product } from './product/productReducers.js';
export { default as user } from './user/userReducers.js';

export { default as shirt } from './shirt/shirtReducers.js';
export { default as bakery } from './bakery/bakeryReducers.js';