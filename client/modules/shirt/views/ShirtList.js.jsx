/**
 * View component for /shirts
 *
 * Generic shirt list view. Defaults to 'all' with:
 * this.props.dispatch(shirtActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as shirtActions from '../shirtActions';

// import global components
import Base from "../../../global/components/BaseComponent.js.jsx";

// import shirt components
import ShirtLayout from '../components/ShirtLayout.js.jsx';
import ShirtListItem from '../components/ShirtListItem.js.jsx';

// import shirt css modules
import shirtStyles from '../shirtModuleStyles.css';

class ShirtList extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch a list of your choice
    this.props.dispatch(shirtActions.fetchListIfNeeded()); // defaults to 'all'
  }

  render() {
    const { shirtStore } = this.props;

    /**
     * Retrieve the list information and the list items for the component here.
     *
     * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
     * these steps within the mapStoreToProps method prior to delivering the
     * props to the component.  Othwerwise, the render() action gets convoluted
     * and potentially severely bogged down.
     */

    // get the shirtList meta info here so we can reference 'isFetching'
    const shirtList = shirtStore.lists ? shirtStore.lists.all : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual shirt objetcs
     */
    const shirtListItems = shirtStore.util.getList("all");

    /**
     * NOTE: isEmpty is is usefull when the component references more than one
     * resource list.
     */
    const isEmpty = !shirtListItems || !shirtList;

    return (
      <ShirtLayout>
        <div className="flex">
          <section className="section">
            <div className="yt-container">
              <h1> Shirt List
                <Link className="yt-btn small u-pullRight" to={'/shirts/new'}> NEW Shirt </Link>
              </h1>
              <hr/>
              { isEmpty ?
                (shirtListItems && shirtList.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                :
                <div style={{ opacity: shirtList.isFetching ? 0.5 : 1 }}>
                  <ul>
                    {shirtListItems.map((shirt, i) =>
                      <ShirtListItem key={shirt._id + i} shirt={shirt} />
                    )}
                  </ul>
                </div>
              }
            </div>
          </section>
        </div>
      </ShirtLayout>
    )
  }
}

ShirtList.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    shirtStore: store.shirt
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(ShirtList)
);
