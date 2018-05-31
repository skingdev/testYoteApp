// import react things
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import react-native components
import {
  Dimensions
  , Image
  , ListView
  , Platform
  , StyleSheet
  , Text
  , View
} from 'react-native';

// import global components
import Base from '../../../global/components/BaseComponent';
import YTButton from '../../../global/components/YTButton';
import YTTouchable from '../../../global/components/YTTouchable';

// import libraries
import moment from 'moment';

// import styles
import shirtStyles from '../shirtStyles';
import YTColors from '../../../global/styles/YTColors';

class ShirtListItem extends Base {
  constructor(props){
    super(props);
  }

  render() {
    const { shirt, onPress } = this.props;

    var cell =
            <View style={shirtStyles.cell}>
              <Text style={shirtStyles.headerLeft}>Shirt List Item </Text>
            </View>;

    if(this.props.onPress) {
      cell =
        <YTTouchable onPress={this.props.onPress}>
          {cell}
        </YTTouchable>
    }

    return cell;

  }

}

ShirtListItem.propTypes = {
  shirt: PropTypes.object
  , onPress: PropTypes.func
}

const mapStoreToProps = (store) => {

  return {
    userStore: store.user
  }
}

export default connect(mapStoreToProps)(ShirtListItem);
