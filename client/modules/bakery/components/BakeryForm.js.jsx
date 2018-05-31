/**
 * Reusable stateless form component for Bakery
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { SelectFromArray, TextInput } from '../../../global/components/forms';

function BakeryForm({
  cancelLink
  , formHelpers
  , formTitle
  , formType
  , handleFormChange
  , handleFormSubmit
  , bakery
}) {

  // set the button text
  const buttonText = formType === "create" ? "Create Bakery" : "Update Bakery";

  // set the form header
  const header = formTitle ? <div className="formHeader"><h2> {formTitle} </h2><hr/></div> : <div/>;
  const states = ["NC", "SC", "VA"]

  return (
    <div className="yt-container">
      <div className="yt-row center-horiz">
        <div className="form-container -slim">
          <form name="bakeryForm" className="bakery-form" onSubmit={handleFormSubmit}>
            {header}
            <TextInput
              change={handleFormChange}
              label="Name"
              name="bakery.name"
              placeholder="Name (required)"
              required={true}
              value={bakery.name}
            />
            <TextInput
              change={handleFormChange}
              label="Address"
              name="bakery.address"
              value={bakery.address}
            />
            <TextInput
              change={handleFormChange}
              label="City"
              name="bakery.city"
              value={bakery.city}
            />
            <SelectFromArray
              label="State"
              items={states}
              change={handleFormChange}
              value={bakery.state}
              placeholder="Select State"
              name="bakery.state"
            />
            <TextInput
              change={handleFormChange}
              label="Zip"
              name="bakery.zip"
              value={bakery.zip}
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

BakeryForm.propTypes = {
  cancelLink: PropTypes.string.isRequired
  , formHelpers: PropTypes.object
  , formTitle: PropTypes.string
  , formType: PropTypes.string.isRequired
  , handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , bakery: PropTypes.object.isRequired
}

BakeryForm.defaultProps = {
  formHelpers: {}
  , formTitle: ''
}

export default BakeryForm;
