import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const BackPage = ({ link }) => {
  return (
    <Link
      to={link}
      className="text-gray pe-auto text-decoration-none fs-5 me-2">
      <BsArrowLeft />{" "}
    </Link>
  );
};

export default BackPage;
