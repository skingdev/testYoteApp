// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import shirt css modules
import shirtStyles from '../shirtModuleStyles.css';

function ShirtListItem({ shirt }) {
  return (
    <li>
      <Link to={`/shirts/${shirt._id}`}> {shirt.name}</Link>
    </li>
  )
}

ShirtListItem.propTypes = {
  shirt: PropTypes.object.isRequired
}

export default ShirtListItem;
