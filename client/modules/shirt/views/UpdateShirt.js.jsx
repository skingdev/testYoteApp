/**
 * View component for /shirts/:shirtId/update
 *
 * Updates a single shirt from a copy of the selcted shirt
 * as defined in the shirt reducer
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

// import module components
import ShirtForm from '../components/ShirtForm.js.jsx';
import ShirtLayout from '../components/ShirtLayout.js.jsx';

// import shirt css modules
import shirtStyles from '../shirtModuleStyles.css';

class UpdateShirt extends Base {
  constructor(props) {
    super(props);
    const { selectedShirt, shirtMap } = this.props;
    this.state = {
      shirt: shirtMap[selectedShirt.id] ?  _.cloneDeep(shirtMap[selectedShirt.id]) : {}
      // NOTE: we don't want to change the store, just make changes to a copy
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

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(shirtActions.fetchSingleIfNeeded(match.params.shirtId))
  }

  componentWillReceiveProps(nextProps) {
    const { selectedShirt, shirtMap } = nextProps;
    this.setState({
      shirt: shirtMap[selectedShirt.id] ? _.cloneDeep(shirtMap[selectedShirt.id]) : {}
      //we don't want to actually change the store's shirt, just use a copy
      , formHelpers: {}
    })
  }

  _handleFormChange(e) {
    let newState = _.update( this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState(newState);
  }

  _handleFormSubmit(e) {
    const { dispatch, history } = this.props;
    e.preventDefault();
    dispatch(shirtActions.sendUpdateShirt(this.state.shirt)).then((action) => {
      if(action.success) {
        history.push(`/shirts/${action.item._id}`)
      } else {
        // console.log("Response Error:");
        // console.log(action);
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { selectedShirt, shirtMap } = this.props;
    const { shirt, formHelpers } = this.state;
    const isEmpty = (!shirt || shirt._id === null || shirt._id === undefined);
    return  (
      <ShirtLayout>
        <div className="flex">
          <section className="section">
            {isEmpty ?
              (selectedShirt.selected.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <ShirtForm
                shirt={shirt}
                cancelLink={`/shirts/${shirt._id}`}
                formHelpers={formHelpers}
                formTitle="Update Shirt"
                formType="update"
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

UpdateShirt.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    selectedShirt: store.shirt.selected
    , shirtMap: store.shirt.byId
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(UpdateShirt)
);
