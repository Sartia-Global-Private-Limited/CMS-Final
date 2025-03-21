import React from "react";
import { BsInfoCircle } from "react-icons/bs";

const FormLabelText = ({ info, children }) => {
  return (
    <small className="fw-bold text-gray">
      {info && <BsInfoCircle className="text-orange" />} {children}
    </small>
  );
};

export default FormLabelText;
