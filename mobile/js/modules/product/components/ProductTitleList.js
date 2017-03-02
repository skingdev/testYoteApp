// import react things
import React, { PropTypes } from 'react';
import Base from '../../../global/components/BaseComponent';
import { connect } from 'react-redux';

// import react-native components
import ListView from 'ListView';
import Dimensions from 'Dimensions';
import Platform from 'Platform';
import StyleSheet from 'StyleSheet';
import View from 'View';
import Text from 'Text';
import TouchableHighlight from 'TouchableHighlight';
import RefreshControl from 'RefreshControl';
import ScrollView from 'ScrollView';
import Image from 'Image';

// import actions
import { listActions as myProductListActions, singleActions as myProductSingleActions } from '../actions';

// import custom components
import ProductTitleCard from './ProductTitleCard';

// import Styles
import YTColors from '../../../global/styles/YTColors';



var styles = StyleSheet.create({
  separator: {
    backgroundColor: YTColors.listSeparator,
    height: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: YTColors.lightBackground,
    // backgroundColor: YTColors.anagada,
  },
  emptyContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // flex: 1,
    // backgroundColor: YTColors.primaryHeader,
    backgroundColor: YTColors.lightBackground,
    padding: 4,
  },
  emptyMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column',
  },
  bigImage: {
    marginTop: Dimensions.get('window').height * 0.25,
    marginBottom: 20,
  },
  message: {
    // color: "#fff",
    color: YTColors.darkText,
    fontSize: 28,
    marginBottom: 50,
  },
  listWrapper: {
    // flex: 1
    backgroundColor: "transparent"
    // , marginBottom: 50
    // , minHeight
    // , padding: 4
  },
});



// FIXME: Android has a bug when scrolling ListView the view insertions
// will make it go reverse. Temporary fix - pre-render more rows
const LIST_VIEW_PAGE_SIZE = Platform.OS === 'android' ? 20 : 1;


class ProductTitleList extends Base {
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
      dataSource: cloneWithData(dataSource, props.products),
      refreshing: false
    }
    this._bind(
      '_renderFooter'
      , '_onContentSizeChange'
      , '_renderRow'
      , '_renderSeparator'
      , '_handleRefresh'
      , '_openProduct'
      , '_renderHeader'
    )
  }

  componentDidMount() {
    let listViewScrollView = this.refs.templateList.getScrollResponder();
    listViewScrollView.scrollTo({y:1});
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.products !== nextProps.products) {
      this.setState({
        dataSource: cloneWithData(this.state.dataSource, nextProps.products)
      });
    }
  }

  _onContentSizeChange(contentWidth: number, contentHeight: number) {
    if(contentHeight !== this.state.contentHeight) {
      this.setState({contentHeight});
    }
  }

  _renderHeader() {
    return this.props.renderHeader && this.props.renderHeader();
  }

  _renderFooter() {
    // console.log("render Footer");
    if(this.state.dataSource.getRowCount() === 0) {

      return this.props.renderEmptyList && this.props.renderEmptyList();
    }
    return this.props.renderFooter && this.props.renderFooter();
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View style={styles.separator} key={rowID} />
    )
  }

  _renderRow(product) {
    return (
      <ProductTitleCard
        product={product}
        onPress={() => this._openProduct(product)}
      />
    )
  }

  _handleRefresh() {
    this.setState({refreshing: true});
    this.props.dispatch(myProductListActions.fetchList()).then(() => {
      console.log("REFRESHED");
      this.setState({refreshing: false});

    });
  }

  _openProduct(product) {
    this.props.dispatch(myProductSingleActions.setCurrent(product._id));
    this.props.navigator.push({userProduct: product});
  }

  render() {
    const { contentInset, products } = this.props;
    const isEmpty = !products || products.length < 1;
    const bottom = contentInset.bottom + Math.max(0, this.props.minContentHeight - this.state.contentHeight);

    let listFlex = isEmpty ? { flex: 1 } : { flex: 1 }; // ??? the same

    const refreshControl =
     <RefreshControl
       refreshing={this.state.refreshing}
       onRefresh={this._handleRefresh}
     />

   return (
     <View style={styles.mainContainer}>

       <ListView
         ref="templateList"
         initialListSize={10}
         style={[styles.listWrapper, listFlex]}
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
       />

     </View>
   )
  }


}

ProductTitleList.propTypes = {
  products: PropTypes.array
  , contentInset: PropTypes.object
  , minContentHeight: PropTypes.number
}

ProductTitleList.defaultProps = {
  products: [],
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
    user: store.user.current
  }
}

export default connect(mapStoreToProps)(ProductTitleList);
