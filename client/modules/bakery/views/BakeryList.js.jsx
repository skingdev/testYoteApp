/**
 * View component for /bakeries
 *
 * Generic bakery list view. Defaults to 'all' with:
 * this.props.dispatch(bakeryActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as bakeryActions from '../bakeryActions';

// import global components
import Base from "../../../global/components/BaseComponent.js.jsx";

// import bakery components
import BakeryLayout from '../components/BakeryLayout.js.jsx';
import BakeryListItem from '../components/BakeryListItem.js.jsx';

// import bakery css modules
import bakeryStyles from '../bakeryModuleStyles.css';

class BakeryList extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch a list of your choice
    this.props.dispatch(bakeryActions.fetchListIfNeeded()); // defaults to 'all'
  }

  render() {
    const { bakeryStore } = this.props;

    /**
     * Retrieve the list information and the list items for the component here.
     *
     * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
     * these steps within the mapStoreToProps method prior to delivering the
     * props to the component.  Othwerwise, the render() action gets convoluted
     * and potentially severely bogged down.
     */

    // get the bakeryList meta info here so we can reference 'isFetching'
    const bakeryList = bakeryStore.lists ? bakeryStore.lists.all : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual bakery objetcs
     */
    const bakeryListItems = bakeryStore.util.getList("all");

    /**
     * NOTE: isEmpty is is usefull when the component references more than one
     * resource list.
     */
    const isEmpty = !bakeryListItems || !bakeryList;

    return (
      <BakeryLayout>
        <div className="flex">
          <section className="section">
            <div className="yt-container">
              <h1> Bakery List
                <Link className="yt-btn small u-pullRight" to={'/bakeries/new'}> NEW Bakery </Link>
              </h1>
              <hr/>
              { isEmpty ?
                (bakeryListItems && bakeryList.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                :
                <div style={{ opacity: bakeryList.isFetching ? 0.5 : 1 }} class="bakery-list-container">
                  <ul class="bakery-list">
                    {bakeryListItems.map((bakery, i) =>
                      <BakeryListItem key={bakery._id + i} bakery={bakery} />
                    )}
                  </ul>
                </div>
              }
            </div>
          </section>
        </div>
      </BakeryLayout>
    )
  }
}

BakeryList.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    bakeryStore: store.bakery
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(BakeryList)
);
