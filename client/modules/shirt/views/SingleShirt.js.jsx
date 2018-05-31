/**
 * View component for /shirts/:shirtId
 *
 * Displays a single shirt from the 'byId' map in the shirt reducer
 * as defined by the 'selected' property
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

// import shirt css modules
import shirtStyles from '../shirtModuleStyles.css';


class SingleShirt extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(shirtActions.fetchSingleIfNeeded(match.params.shirtId));
  }

  render() {
    const { shirtStore } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual shirt object from the map
     */
    const selectedShirt = shirtStore.selected.getItem();

    const isEmpty = (
      !selectedShirt
      || !selectedShirt._id
      || shirtStore.selected.didInvalidate
    );

    return (
      <ShirtLayout>
        <div className="flex">
          <section className="section">
            <div className="yt-container">
              <h3> Single Shirt </h3>
              {isEmpty ?
                (shirtStore.selected.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                :
                <div style={{ opacity: shirtStore.selected.isFetching ? 0.5 : 1 }}>
                  <h1> { selectedShirt.name }
                    <Link className="yt-btn small u-pullRight" to={`${this.props.match.url}/update`}> UPDATE Shirt </Link>
                  </h1>
                  <hr/>
                  <p> <em>Other characteristics about the Shirt would go here.</em></p>
                </div>
              }
            </div>
          </section>
        </div>
      </ShirtLayout>
    )
  }
}

SingleShirt.propTypes = {
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
  )(SingleShirt)
);
