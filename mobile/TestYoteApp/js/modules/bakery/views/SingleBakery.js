/**
 * Displays a single bakery by the bakeryId sent from props and the bakeryStore 
 */

// import react things
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import react-native components
import {
  Alert
  , Dimensions
  , Image
  , ListView
  , Platform
  , ScrollView
  , Text
  , TextInput
  , TouchableOpacity
  , View
} from 'react-native';

// import global components
import ActionButton from '../../../global/components/ActionButton';
import Base from '../../../global/components/BaseComponent';
import YTButton from '../../../global/components/YTButton';
import YTHeader from '../../../global/components/YTHeader';
import YTTouchable from '../../../global/components/YTTouchable';

// import libraries
import moment from 'moment';
import _ from 'lodash';

// import actions
import * as bakeryActions from '../bakeryActions';

// import styles
import bakeryStyles from '../bakeryStyles';
import YTColors from '../../../global/styles/YTColors';

class SingleBakery extends Base {
  constructor(props){
    super(props);
    this._bind(
      '_closeModal'
      , '_openEdit'
    )
  }

  componentDidMount() {
    const { bakeryId } = this.props.navigation.state.params;
    this.props.dispatch(bakeryActions.fetchSingleBakeryById(bakeryId));
  }

  _closeModal() {
    this.props.navigation.goBack();
  }

  _openEdit() {
    // console.log("open update bakery");
    const { bakeryId } = this.props.navigation.state.params;
    this.props.navigation.navigate('UpdateBakery', {bakeryId: bakeryId});
  }

  render() {
    const { bakeryStore } = this.props;
    const { bakeryId } = this.props.navigation.state.params;
    let bakery = bakeryStore[bakeryId];
    // console.log(bakery);

    const leftItem = {
      icon: require('../../../global/img/back.png'),
      layout: 'icon',
      onPress: this._closeModal,
    }

    const rightItem = {
      title: "Edit",
      onPress: this._openEdit,
    };

    return(
      <View style={bakeryStyles.container}>
        <YTHeader
          leftItem={leftItem}
          title={'Single Bakery'}
        />
        <ScrollView>
          <View style={bakeryStyles.cell}>
            <Text style={[bakeryStyles.headerLeft, {padding: 5}]}>Single Bakery </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

SingleBakery.propTypes = {
  bakeryId: PropTypes.string
}

const mapStoreToProps = (store) => {

  return {
    userStore: store.user
    , bakeryStore: store.bakery
  }
}

export default connect(mapStoreToProps)(SingleBakery);
