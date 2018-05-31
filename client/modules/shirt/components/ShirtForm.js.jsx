/**
 * Reusable stateless form component for Shirt
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { SelectFromArray, TextInput } from '../../../global/components/forms';

function ShirtForm({
  cancelLink
  , formHelpers
  , formTitle
  , formType
  , handleFormChange
  , handleFormSubmit
  , shirt
}) {

  // set the button text
  const buttonText = formType === "create" ? "Create Shirt" : "Update Shirt";

  // set the form header
  const header = formTitle ? <div className="formHeader"><h2> {formTitle} </h2><hr/></div> : <div/>;

  return (
    <div className="yt-container">
      <div className="yt-row center-horiz">
        <div className="form-container -slim">
          <form name="shirtForm" className="shirt-form" onSubmit={handleFormSubmit}>
            {header}
            <TextInput
              change={handleFormChange}
              label="Name"
              name="shirt.name"
              placeholder="Name (required)"
              required={true}
              value={shirt.name}
            />
            <TextInput
              change={handleFormChange}
              label="Color "
              name="shirt.color"
              required={true}
              value={shirt.color}
            />
            <div className="input-group">
              <div className="yt-row space-between">
                <Link className="yt-btn link" to={cancelLink}>Cancel</Link>
                <button className="yt-btn " type="submit" > {buttonText} </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

ShirtForm.propTypes = {
  cancelLink: PropTypes.string.isRequired
  , formHelpers: PropTypes.object
  , formTitle: PropTypes.string
  , formType: PropTypes.string.isRequired
  , handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , shirt: PropTypes.object.isRequired
}

ShirtForm.defaultProps = {
  formHelpers: {}
  , formTitle: ''
}

export default ShirtForm;
