/**
 * Wraps all Shirt components in a default container. If you want to
 * give all Shirt views a sidebar for example, you would set that here. 
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';

// import global components
import Base from "../../../global/components/BaseComponent.js.jsx";
import DefaultLayout from "../../../global/components/DefaultLayout.js.jsx";

class ShirtLayout extends Base {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout>
        {this.props.children}
      </DefaultLayout>
    )
  }
}

export default ShirtLayout;
