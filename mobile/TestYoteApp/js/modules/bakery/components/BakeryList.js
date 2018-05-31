/**
 * sets up datasource and necessary functions for the ListView call
 * _renderRow is where each bakeryId of the datasource is sent to BakeryTitleCard
 */

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
  , RefreshControl
  , ScrollView
  , StyleSheet
  , Text
  , TouchableHighlight
  , View
} from 'react-native';

// import actions
import * as bakeryActions from '../bakeryActions';

// import global components
import Base from '../../../global/components/BaseComponent';

// import module components
import BakeryListItem from './BakeryListItem';

// import Styles
import bakeryStyles from '../bakeryStyles';
import YTColors from '../../../global/styles/YTColors';

// FIXME: Android has a bug when scrolling ListView the view insertions
// will make it go reverse. Temporary fix - pre-render more rows
const LIST_VIEW_PAGE_SIZE = Platform.OS === 'android' ? 20 : 1;


class BakeryList extends Base {
  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sid, rid) => dataBlob[sid][rid],
      getSectionHeaderData: (dataBlob, sid) => dataBlob[sid],
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      contentHeight: 0,
      dataSource: cloneWithData(dataSource, props.bakeries),
      refreshing: false
    }
    this._bind(
      '_renderFooter'
      , '_onContentSizeChange'
      , '_renderRow'
      , '_renderSeparator'
      , '_handleRefresh'
      , '_openBakery'
      , '_renderHeader'
    )
  }

  componentDidMount() {
    // let listViewScrollView = this.refs.templateList.getScrollResponder();
    // listViewScrollView.scrollTo({y:1});
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.bakeries !== nextProps.bakeries || this.props.bakeryStore !== nextProps.bakeryStore) {
      this.setState({
        dataSource: cloneWithData(this.state.dataSource, nextProps.bakeries)
      });
    }
  }

  _onContentSizeChange(contentWidth: number, contentHeight: number) {
    if(contentHeight !== this.state.contentHeight) {
      this.setState({contentHeight});
    }
  }

  _renderHeader() {
    // return (
    //   <View>
    //     <Text style={bakeryStyles.header}> ListView Header! </Text>
    //   </View>)
  }

  _renderFooter() {
    // console.log("render Footer");
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View style={bakeryStyles.listSeparator} key={rowID} />
    )
  }

  _renderRow(bakeryId) {
    const { bakeryStore } = this.props;
    return (
      <BakeryListItem
        bakery={bakeryStore[bakeryId]}
        onPress={() => this._openBakery(bakeryId)}
      />
    )
  }

  _handleRefresh() {
    this.setState({refreshing: true});
    this.props.dispatch(bakeryActions.fetchList()).then(() => {
      // console.log("REFRESHED", this.state.refreshing);
      this.setState({refreshing: false});

    });
  }

  _openBakery(bakeryId) {
    console.log("open bakery", bakeryId);
    // this.props.dispatch(myBakerySingleActions.setCurrent(bakery._id));
    this.props.navigation.navigate('SingleBakery', {bakeryId: bakeryId});
  }

  render() {
    const { contentInset, bakeries } = this.props;
    const isEmpty = !bakeries || bakeries.length < 1;
    const bottom = contentInset.bottom + Math.max(0, this.props.minContentHeight - this.state.contentHeight);

    let listFlex = isEmpty ? { flex: 1 } : { flex: 1 }; // ??? the same

    const refreshControl =
     <RefreshControl
       refreshing={this.state.refreshing}
       onRefresh={this._handleRefresh}
     />

   return (
     <View style={bakeryStyles.container}>

       <ListView
         ref="templateList"
         initialListSize={10}
         pageSize={LIST_VIEW_PAGE_SIZE}
         dataSource={this.state.dataSource}
         renderRow={this._renderRow}
         renderHeader={this._renderHeader}
         renderFooter={this._renderFooter}
         renderSeparator={this._renderSeparator}
         enableEmptySections={true}
         onContentSizeChange={this._onContentSizeChange}
         scrollRenderAheadDistance={600}
         refreshControl={ refreshControl }
         removeClippedSubviews={false}
       />

     </View>
   )
  }


}

BakeryList.propTypes = {
  bakeries: PropTypes.array
  , contentInset: PropTypes.object
  , minContentHeight: PropTypes.number
}

BakeryList.defaultProps = {
  bakeries: [],
  contentInset: { top: 0, bottom: 0 },
  // TODO: This has to be scrollview height + fake header
  minContentHeight: Dimensions.get('window').height + 20,
  renderSeparator: (sectionID, rowID) => <View style={styles.separator} key={rowID} />,
}


function cloneWithData(dataSource: ListView.DataSource, data: ?Data) {
  if (!data) {
    return dataSource.cloneWithRows([]);
  }
  if (Array.isArray(data)) {
    // console.log("RENDER AS ARRAY");
    return dataSource.cloneWithRows(data);
  }
  return dataSource.cloneWithRowsAndSections(data);
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.loggedIn.user
    , bakeryStore: store.bakery
  }
}

export default connect(mapStoreToProps)(BakeryList);
