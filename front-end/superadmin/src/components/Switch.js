import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const Switch = ({ title, idFor, name, onChange, value, checked, onClick }) => {

  return (
    <label className="my-switch">
      <Form.Label className='mb-0' htmlFor={idFor}>{title}</Form.Label>
      <input type="checkbox" name={name} value={value} id={idFor}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
      />
      <span className="my-slider"></span>
    </label>
  )
}

export default Switch;
