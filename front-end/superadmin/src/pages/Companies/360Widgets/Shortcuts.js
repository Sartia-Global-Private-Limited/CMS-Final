import { Building2 } from "lucide-react";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { NavLink } from "react-router-dom";

const ShortcutItem = ({ to, label }) => (
  <Col md={6}>
    <div className="p-2 text-center">
      <NavLink
        to={to}
        style={{
          borderRadius: "50px",
          display: "inline-grid",
          placeItems: "center",
          height: "50px",
          width: "50px",
        }}
        className="border border-dark"
      >
        <Building2 />
      </NavLink>
      <p>{label}</p>
    </div>
  </Col>
);

const Shortcuts = ({ checkPermission }) => {
  const shortcuts = [
    { to: "/MyCompanies/AddMyCompany/new", label: "Create My Company" },
    { to: "/MyCompanies/AddMyCompany/new", label: "Create Client Company" },
    { to: "/MyCompanies/AddMyCompany/new", label: "Create Vendor Company" },
    { to: "/MyCompanies/AddMyCompany/new", label: "Create New Company" },
  ];

  return (
    <CardComponent title="Shortcuts">
      <Row className="g-3">
        {checkPermission?.create ? (
          shortcuts.map(({ to, label }, index) => (
            <ShortcutItem key={index} to={to} label={label} />
          ))
        ) : (
          <p className="text-center p-4">Permission Denied!!</p>
        )}
      </Row>
    </CardComponent>
  );
};

export default Shortcuts;
