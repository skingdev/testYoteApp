/**
 * Displays a single shirt by the shirtId sent from props and the shirtStore 
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
import * as shirtActions from '../shirtActions';

// import styles
import shirtStyles from '../shirtStyles';
import YTColors from '../../../global/styles/YTColors';

class SingleShirt extends Base {
  constructor(props){
    super(props);
    this._bind(
      '_closeModal'
      , '_openEdit'
    )
  }

  componentDidMount() {
    const { shirtId } = this.props.navigation.state.params;
    this.props.dispatch(shirtActions.fetchSingleShirtById(shirtId));
  }

  _closeModal() {
    this.props.navigation.goBack();
  }

  _openEdit() {
    // console.log("open update shirt");
    const { shirtId } = this.props.navigation.state.params;
    this.props.navigation.navigate('UpdateShirt', {shirtId: shirtId});
  }

  render() {
    const { shirtStore } = this.props;
    const { shirtId } = this.props.navigation.state.params;
    let shirt = shirtStore[shirtId];
    // console.log(shirt);

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
      <View style={shirtStyles.container}>
        <YTHeader
          leftItem={leftItem}
          title={'Single Shirt'}
        />
        <ScrollView>
          <View style={shirtStyles.cell}>
            <Text style={[shirtStyles.headerLeft, {padding: 5}]}>Single Shirt </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

SingleShirt.propTypes = {
  shirtId: PropTypes.string
}

const mapStoreToProps = (store) => {

  return {
    userStore: store.user
    , shirtStore: store.shirt
  }
}

export default connect(mapStoreToProps)(SingleShirt);
