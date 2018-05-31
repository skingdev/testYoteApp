/**
 * Shirt component called from TabsView
 * sends shirtList as props to ShirtTitleList component for the ListView datasource
 */

// import react/redux dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import react-native components & apis
import {
  ActivityIndicator
  , ScrollView
  , StyleSheet
  , Text
  , TextInput
  , TouchableOpacity
  , View
} from 'react-native';

// import global components
import ActionButton from '../../../global/components/ActionButton';
import Base from '../../../global/components/BaseComponent';
import EmptyMessage from '../../../global/components/EmptyMessage';
import YTButton from '../../../global/components/YTButton';
import YTCard from '../../../global/components/YTCard';
import YTColors from '../../../global/styles/YTColors';
import YTHeader from '../../../global/components/YTHeader';

// import module components
import ShirtList from '../components/ShirtList';

// import actions
import * as shirtActions from '../shirtActions'

// import styles
import shirtStyles from '../shirtStyles';

class ShirtRoot extends Base {
  constructor(props) {
    super(props);
    this._bind(
     '_closeModal'
     , '_openNew'
     , '_sendDelete'
    );
  }

  componentDidMount() {
    this.props.dispatch(shirtActions.fetchListIfNeeded());
  }

  _closeModal() {
    this.props.navigation.goBack();
  }

  _openNew() {
    this.props.navigation.navigate('CreateShirt');
  }

  _sendDelete(id) {
    this.props.dispatch(shirtActions.sendDelete(id)).then((res) => {
      this.props.dispatch(shirtActions.removeShirtFromList(id));
    })
  }

  render() {

    const {  shirtStore, navigation, user } = this.props;

    if(!shirtStore.lists.all || shirtStore.lists.all.isFetching) {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicator/>
        </View>
      )
    }
    let shirtList = shirtStore.lists.all ? shirtStore.lists.all.items : null;

    const profileImg = user.info && user.info.profilePicUrl ? {uri: user.info.profilePicUrl} : require('../../../global/img/default.png');

    const rightItem = {
      onPress: () => this._openNew()
      , icon: require('../../../global/img/plus.png')
      , layout: 'image'
    }

    const leftItem = {
      icon: require('../../../global/img/back.png'),
      layout: 'icon',
      onPress: this._closeModal,
    }

    return (
      <View style={{flex: 1}}>
        <YTHeader
          leftItem={leftItem}
          title="Shirt"
        >
        </YTHeader>

        <View style={{flex: 1}}>
          <ShirtList
            shirts={shirtList}
            navigation={navigation}
          />
        </View>

      </View>
    )
  }
}

ShirtRoot.propTypes = {
  dispatch: PropTypes.func
}

const mapStoreToProps = (store) => {

  return {
    user: store.user
    , shirtStore: store.shirt

  }
}

export default connect(
  mapStoreToProps
)(ShirtRoot);
