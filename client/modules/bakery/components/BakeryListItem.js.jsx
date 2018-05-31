// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import bakery css modules
import bakeryStyles from '../bakeryModuleStyles.css';

function BakeryListItem({ bakery }) {
  return (
    <li>
      <Link to={`/bakeries/${bakery._id}`}> {bakery.name}</Link>
    </li>
  )
}

BakeryListItem.propTypes = {
  bakery: PropTypes.object.isRequired
}

export default BakeryListItem;
