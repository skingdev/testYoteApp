/**
 * View component for /bakeries/new
 *
 * Creates a new bakery from a copy of the defaultItem in the bakery reducer
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, withRouter } from 'react-router-dom';

// import third-party libraries
import _ from 'lodash';

// import actions
import * as bakeryActions from '../bakeryActions';

// import global components
import Base from "../../../global/components/BaseComponent.js.jsx";

// import bakery components
import BakeryForm from '../components/BakeryForm.js.jsx';
import BakeryLayout from '../components/BakeryLayout.js.jsx';

class CreateBakery extends Base {
  constructor(props) {
    super(props);
    this.state = {
      bakery: _.cloneDeep(this.props.defaultBakery)
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      , formHelpers: {}
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the bakery
       */
    }
    this._bind(
      '_handleFormChange'
      , '_handleFormSubmit'
    );
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update( this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState(newState);
  }


  _handleFormSubmit(e) {
    const { dispatch, history } = this.props;
    e.preventDefault();
    dispatch(bakeryActions.sendCreateBakery(this.state.bakery)).then((action) => {
      if(action.success) {
        dispatch(bakeryActions.invalidateList());
        history.push(`/bakeries/${action.item._id}`)
      } else {
        // console.log("Response Error:");
        // console.log(action);
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { bakery, formHelpers } = this.state;
    const isEmpty = (bakery.name === null || bakery.name === undefined);
    return (
      <BakeryLayout>
        <div className="flex">
          <section className="section">
            {isEmpty ?
              <h2> Loading...</h2>
              :
              <BakeryForm
                bakery={bakery}
                cancelLink="/bakeries"
                formHelpers={formHelpers}
                formTitle="Create Bakery"
                formType="create"
                handleFormChange={this._handleFormChange}
                handleFormSubmit={this._handleFormSubmit}
                />
            }
          </section>
        </div>
      </BakeryLayout>
    )
  }
}

CreateBakery.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultBakery: store.bakery.defaultItem
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(CreateBakery)
);
