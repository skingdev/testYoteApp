/**
 * Bakery component called from TabsView
 * sends bakeryList as props to BakeryTitleList component for the ListView datasource
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
import BakeryList from '../components/BakeryList';

// import actions
import * as bakeryActions from '../bakeryActions'

// import styles
import bakeryStyles from '../bakeryStyles';

class BakeryRoot extends Base {
  constructor(props) {
    super(props);
    this._bind(
     '_closeModal'
     , '_openNew'
     , '_sendDelete'
    );
  }

  componentDidMount() {
    this.props.dispatch(bakeryActions.fetchListIfNeeded());
  }

  _closeModal() {
    this.props.navigation.goBack();
  }

  _openNew() {
    this.props.navigation.navigate('CreateBakery');
  }

  _sendDelete(id) {
    this.props.dispatch(bakeryActions.sendDelete(id)).then((res) => {
      this.props.dispatch(bakeryActions.removeBakeryFromList(id));
    })
  }

  render() {

    const {  bakeryStore, navigation, user } = this.props;

    if(!bakeryStore.lists.all || bakeryStore.lists.all.isFetching) {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicator/>
        </View>
      )
    }
    let bakeryList = bakeryStore.lists.all ? bakeryStore.lists.all.items : null;

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
          title="Bakery"
        >
        </YTHeader>

        <View style={{flex: 1}}>
          <BakeryList
            bakeries={bakeryList}
            navigation={navigation}
          />
        </View>

      </View>
    )
  }
}

BakeryRoot.propTypes = {
  dispatch: PropTypes.func
}

const mapStoreToProps = (store) => {

  return {
    user: store.user
    , bakeryStore: store.bakery

  }
}

export default connect(
  mapStoreToProps
)(BakeryRoot);
