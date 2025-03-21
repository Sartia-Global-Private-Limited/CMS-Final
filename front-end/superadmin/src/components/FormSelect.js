import React from "react";
import { Form } from "react-bootstrap";

const FormSelect = ({
  option,
  label,
  sname,
  value,
  onChange,
  className,
  SelectClass,
}) => {
  return (
    <Form.Group>
      <Form.Label className={className}>{label}</Form.Label>
      <Form.Select
        name={sname}
        value={value}
        onChange={onChange}
        className={SelectClass}>
        <option>--select--</option>
        {option.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default FormSelect;
