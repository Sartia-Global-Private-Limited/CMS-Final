import React from "react";
import { BsSignDoNotEnter } from "react-icons/bs";

const NotAllowed = () => {
  return (
    <>
      <div className="text-center">
        <h1 style={{ color: "var(--btn-danger1)" }}>
          <BsSignDoNotEnter /> Access Denied
        </h1>
        <hr className="text-left" style={{ margin: "auto", width: "50%" }} />
        <h3>You dont have permission to view this module.</h3>
        <h3>🚫🚫🚫🚫</h3>
        <h6 style={{ color: "red" }}>
          <strong>Error Code</strong>: 403 forbidden
        </h6>
      </div>
    </>
  );
};

export default NotAllowed;
