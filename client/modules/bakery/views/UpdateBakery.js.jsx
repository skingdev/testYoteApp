/**
 * View component for /bakeries/:bakeryId/update
 *
 * Updates a single bakery from a copy of the selcted bakery
 * as defined in the bakery reducer
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

// import module components
import BakeryForm from '../components/BakeryForm.js.jsx';
import BakeryLayout from '../components/BakeryLayout.js.jsx';

// import bakery css modules
import bakeryStyles from '../bakeryModuleStyles.css';

class UpdateBakery extends Base {
  constructor(props) {
    super(props);
    const { selectedBakery, bakeryMap } = this.props;
    this.state = {
      bakery: bakeryMap[selectedBakery.id] ?  _.cloneDeep(bakeryMap[selectedBakery.id]) : {}
      // NOTE: we don't want to change the store, just make changes to a copy
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

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(bakeryActions.fetchSingleIfNeeded(match.params.bakeryId))
  }

  componentWillReceiveProps(nextProps) {
    const { selectedBakery, bakeryMap } = nextProps;
    this.setState({
      bakery: bakeryMap[selectedBakery.id] ? _.cloneDeep(bakeryMap[selectedBakery.id]) : {}
      //we don't want to actually change the store's bakery, just use a copy
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
    dispatch(bakeryActions.sendUpdateBakery(this.state.bakery)).then((action) => {
      if(action.success) {
        history.push(`/bakeries/${action.item._id}`)
      } else {
        // console.log("Response Error:");
        // console.log(action);
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { selectedBakery, bakeryMap } = this.props;
    const { bakery, formHelpers } = this.state;
    const isEmpty = (!bakery || bakery._id === null || bakery._id === undefined);
    return  (
      <BakeryLayout>
        <div className="flex">
          <section className="section">
            {isEmpty ?
              (selectedBakery.selected.isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <BakeryForm
                bakery={bakery}
                cancelLink={`/bakeries/${bakery._id}`}
                formHelpers={formHelpers}
                formTitle="Update Bakery"
                formType="update"
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

UpdateBakery.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    selectedBakery: store.bakery.selected
    , bakeryMap: store.bakery.byId
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(UpdateBakery)
);
