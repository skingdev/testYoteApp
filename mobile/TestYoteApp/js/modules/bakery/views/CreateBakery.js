/**
 * Will create a new bakery from information in the TextInputs
 */

// import react things
import React from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';
import { connect } from 'react-redux';

// import react-native components
import {
  Alert
  , Image
  , KeyboardAvoidingView
  , Platform
  , ScrollView
  , StyleSheet
  , Text
  , TextInput
  , TouchableOpacity
  , View
} from 'react-native';

// import global components
import Base from '../../../global/components/BaseComponent';
import YTButton from '../../../global/components/YTButton';
import YTHeader from '../../../global/components/YTHeader';

// import libraries
import moment from 'moment';
import _ from 'lodash';

// import actions
import * as bakeryActions from '../bakeryActions'

// import styles
import bakeryStyles from '../bakeryStyles';
import YTColors from '../../../global/styles/YTColors';

class CreateBakery extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isFormValid: false
      , newBakery: _.cloneDeep(this.props.defaultBakery)
    }
    this._bind(
      '_closeModal'
      , '_handleAction'
      , '_handleInputChange'
      , '_checkFormValid'
    )
  }

  componentDidMount() {
    this.refs['newBakery.name'].focus();
    console.log(this.props.navigation);
  }

  _checkFormValid() {

    var requiredInputs = Object.keys(this.refs).filter((ref) => this.refs[ref].props.isRequired);

    var isValid = true;
    for(var i = 0; i < requiredInputs.length; i++) {

      var theVal = _.get(this.state, requiredInputs[i]);
      if(!theVal || theVal.length < 1) {
        isValid = false;
      }
    }

    this.setState({isFormValid: isValid});
  }

  _handleAction() {
    console.log("_handleAction fired");

    const { dispatch, user } = this.props;
    const { newBakery } = this.state;
    if(!this.state.isFormValid) {
      Alert.alert("Whoops", "All fields are required.");
      return;
    }
    dispatch(bakeryActions.sendCreateBakery(newBakery)).then((res) => {
      dispatch(bakeryActions.addBakeryToList(res.item._id));
      this.props.navigation.goBack();
    });
  }

  _closeModal() {
    this.props.navigation.goBack();
  }

  _handleInputChange(e, target) {
    var newState = _.update( this.state, target, function() {
      return e.nativeEvent.text;
    });
    console.log("input changed");
    this.setState(newState);
    this._checkFormValid();
  }

  _scrollToInput(e, refName) {
    setTimeout(() => {
      var scrollResponder = this.refs.myScrollView.getScrollResponder();
      // var scrollResponder = scrollView.getScrollRef();
      var offset = 130;
      // console.log(offset);
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ReactNative.findNodeHandle(this.refs[refName]),
        offset, // adjust depending on your contentInset
        /* preventNegativeScrollOffset */ true
        // false
      );
    }, 150);
  }

  render() {

    const { navigator, isFetching } = this.props;
    const { newBakery, isFormValid } = this.state;
    const rightItem = {
      title: 'Cancel',
      onPress: this._closeModal
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : null}
        contentContainerStyle={{flex:1}}
        style={{flex: 1, backgroundColor: '#fff'}}
      >
        <YTHeader
          rightItem={rightItem}
          title="New Bakery"
        />
      <ScrollView ref="myScrollView" keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" style={[bakeryStyles.formWrapper]}>
          <View>
            <View style={{padding: 5}}>
              <TextInput
                autoCorrect={true}
                isRequired={true}
                onFocus={ (e) => this._scrollToInput(e, 'newBakery.name')}
                onChange={ (e) => this._handleInputChange(e, "newBakery.name") }
                placeholder="Name"
                placeholderTextColor={YTColors.lightText}
                ref="newBakery.name"
                returnKeyType="next"
                style={bakeryStyles.input}
                value={this.state.newBakery.name}
              />
            </View>
            <View style={bakeryStyles.listSeparator}/>
          </View>
          <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
            <YTButton
              caption={isFetching ? "Creating..." : "Create new Bakery"}
              isDisabled={!isFormValid}
              onPress={this._handleAction}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}


const mapStoreToProps = (store) => {

  return {
    defaultBakery: store.bakery.defaultItem
    , isFetching: store.bakery.selected.isFetching
    , user: store.user.loggedIn.user
  }
}

export default connect(mapStoreToProps)(CreateBakery);
