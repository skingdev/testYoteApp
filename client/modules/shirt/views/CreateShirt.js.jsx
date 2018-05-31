/**
 * View component for /shirts/new
 *
 * Creates a new shirt from a copy of the defaultItem in the shirt reducer
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, withRouter } from 'react-router-dom';

// import third-party libraries
import _ from 'lodash';

// import actions
import * as shirtActions from '../shirtActions';

// import global components
import Base from "../../../global/components/BaseComponent.js.jsx";

// import shirt components
import ShirtForm from '../components/ShirtForm.js.jsx';
import ShirtLayout from '../components/ShirtLayout.js.jsx';

class CreateShirt extends Base {
  constructor(props) {
    super(props);
    this.state = {
      shirt: _.cloneDeep(this.props.defaultShirt)
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      , formHelpers: {}
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the shirt
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
    dispatch(shirtActions.sendCreateShirt(this.state.shirt)).then((action) => {
      if(action.success) {
        dispatch(shirtActions.invalidateList());
        history.push(`/shirts/${action.item._id}`)
      } else {
        // console.log("Response Error:");
        // console.log(action);
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { shirt, formHelpers } = this.state;
    const isEmpty = (shirt.name === null || shirt.name === undefined);
    return (
      <ShirtLayout>
        <div className="flex">
          <section className="section">
            {isEmpty ?
              <h2> Loading...</h2>
              :
              <ShirtForm
                shirt={shirt}
                cancelLink="/shirts"
                formHelpers={formHelpers}
                formTitle="Create Shirt"
                formType="create"
                handleFormChange={this._handleFormChange}
                handleFormSubmit={this._handleFormSubmit}
                />
            }
          </section>
        </div>
      </ShirtLayout>
    )
  }
}

CreateShirt.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultShirt: store.shirt.defaultItem
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(CreateShirt)
);
