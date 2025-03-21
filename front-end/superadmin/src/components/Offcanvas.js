import React from "react";
import { Offcanvas } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const Offcanvasjs = ({ open, close, title, children }) => {
  return (
    <Offcanvas
      show={open}
      onHide={close}
      placement="end"
      className="rounded offcanvas-area p-3 bg-glass m-md-3 my-3"
    >
      <Offcanvas.Header className="bg-glass py-2 rounded">
        <strong>{title}</strong>
        <Link onClick={close} className="nav-link">
          <BsXLg />
        </Link>
      </Offcanvas.Header>
      <SimpleBar className="area">
        <Offcanvas.Body>{children}</Offcanvas.Body>
      </SimpleBar>
    </Offcanvas>
  );
};

export default Offcanvasjs;
