/**
 * View component for /bakeries/:bakeryId
 *
 * Displays a single bakery from the 'byId' map in the bakery reducer
 * as defined by the 'selected' property
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

// import bakery css modules
import bakeryStyles from '../bakeryModuleStyles.css';


class SingleBakery extends Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(bakeryActions.fetchSingleIfNeeded(match.params.bakeryId));
  }

  render() {
    const { bakeryStore } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual bakery object from the map
     */
    const selectedBakery = bakeryStore.selected.getItem();

    const isEmpty = (
      !selectedBakery
      || !selectedBakery._id
      || bakeryStore.selected.didInvalidate
    );

    return (
      <BakeryLayout>
        <div className="flex">
          <section className="section">
            <div className="yt-container">
              <h3> Update Bakery </h3>
              {isEmpty ?
                (bakeryStore.selected.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                :
                <div style={{ opacity: bakeryStore.selected.isFetching ? 0.5 : 1 }}>
                  <h1> { selectedBakery.name }
                    <Link className="yt-btn small u-pullRight" to={`${this.props.match.url}/update`}> UPDATE Bakery </Link>
                  </h1>
                  <div>
                    <label><b>Address: </b></label>
                    <span>{ selectedBakery.address } </span>
                  </div>
                  <div>
                    <label><b>City: </b></label>
                    <span>{ selectedBakery.city } </span>
                  </div>
                  <div>
                    <label><b>State: </b></label>
                    <span>{ selectedBakery.state } </span>
                  </div>
                  <div>
                    <label><b>Zip: </b></label>
                    <span>{ selectedBakery.zip } </span>
                  </div>
                </div>
              }
            </div>
          </section>
        </div>
      </BakeryLayout>
    )
  }
}

SingleBakery.propTypes = {
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
  )(SingleBakery)
);
