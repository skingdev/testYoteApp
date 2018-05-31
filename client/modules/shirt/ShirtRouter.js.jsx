/**
 * Set up routing for all Shirt views
 *
 * For an example with protected routes, refer to /product/ProductRouter.js.jsx
 */

// import primary libraries
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import global components
import Base from "../../global/components/BaseComponent.js.jsx";
import YTRoute from '../../global/components/routing/YTRoute.js.jsx';

// import shirt views
import CreateShirt from './views/CreateShirt.js.jsx';
import ShirtList from './views/ShirtList.js.jsx';
import SingleShirt from './views/SingleShirt.js.jsx';
import UpdateShirt from './views/UpdateShirt.js.jsx';

class ShirtRouter extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <YTRoute exact path="/shirts" component={ShirtList} />
        <YTRoute exact login={true} path="/shirts/new" component={CreateShirt} />
        <YTRoute exact path="/shirts/:shirtId" component={SingleShirt}/>
        <YTRoute exact login={true} path="/shirts/:shirtId/update" component={UpdateShirt}/>
      </Switch>
    )
  }
}

export default ShirtRouter;
