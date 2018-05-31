/**
 * Set up routing for all Bakery views
 *
 * For an example with protected routes, refer to /product/ProductRouter.js.jsx
 */

// import primary libraries
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import global components
import Base from "../../global/components/BaseComponent.js.jsx";
import YTRoute from '../../global/components/routing/YTRoute.js.jsx';

// import bakery views
import CreateBakery from './views/CreateBakery.js.jsx';
import BakeryList from './views/BakeryList.js.jsx';
import SingleBakery from './views/SingleBakery.js.jsx';
import UpdateBakery from './views/UpdateBakery.js.jsx';

class BakeryRouter extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <YTRoute exact path="/bakeries" component={BakeryList} />
        <YTRoute exact login={true} path="/bakeries/new" component={CreateBakery} />
        <YTRoute exact path="/bakeries/:bakeryId" component={SingleBakery}/>
        <YTRoute exact login={true} path="/bakeries/:bakeryId/update" component={UpdateBakery}/>
      </Switch>
    )
  }
}

export default BakeryRouter;
