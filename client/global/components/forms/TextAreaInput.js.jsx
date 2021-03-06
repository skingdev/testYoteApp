/**
 * Helper component for rendering textarea inputs
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';

// import components
import Base from "../BaseComponent.js.jsx";

class TextAreaInput extends Base {
  constructor(props) {
    super(props);
    this._bind('_handleInputChange');
  }

  _handleInputChange(e) {
    this.props.change(e);
  }

  render() {
    const {
      cols
      , helpText
      , label
      , maxlength
      , name
      , placeholder
      , required
      , rows
      , value
    } = this.props;

    return (
      <div className="input-group">
        <label htmlFor={name}> {label} {required ? <sup className="-required">*</sup> : null}</label>
        <textarea
          cols={cols}
          maxLength={maxlength}
          name={name}
          onChange={this._handleInputChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          type="text"
          value={value}
        >
        </textarea>
        <small className="help-text"><em>{helpText}</em></small>
      </div>
    )
  }
}

TextAreaInput.propTypes = {
  change: PropTypes.func.isRequired
  , cols: PropTypes.number
  , helpText: PropTypes.any
  , label: PropTypes.string
  , maxlength: PropTypes.number
  , name: PropTypes.string.isRequired
  , placeholder: PropTypes.string
  , required: PropTypes.bool
  , rows: PropTypes.number
  , value: PropTypes.string.isRequired
}

TextAreaInput.defaultProps = {
  helpText: null
  , label: ''
  , placeholder: ''
  , required: false
  , rows: '4'
}

export default TextAreaInput;
