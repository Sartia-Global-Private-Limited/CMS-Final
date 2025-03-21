import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Select from "react-select";

const ReactPagination = ({
  pageSize,
  handlePageSizeChange,
  prevonClick,
  nextonClick,
  nextClassName,
  prevClassName,
  title,
  className = "rounded",
}) => {
  return (
    <div
      className={`d-grid shadow py-1 bg-blue d-md-flex justify-content-center align-items-center gap-md-4 gap-3 ${className}`}
    >
      <small className="d-md-block d-none">Rows Per Page</small>
      <Select
        menuPortalTarget={document.body}
        menuPlacement={"auto"}
        className="social-btn-re p-0 purple-combo w-auto"
        name={"rows_per_page"}
        options={[
          { value: "5", label: "5" },
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ]}
        value={{ value: pageSize, label: pageSize }}
        onChange={handlePageSizeChange}
      />
      <small>{title}</small>
      <span className="d-align gap-2">
        <span
          onClick={prevonClick}
          className={`social-btn-re d-align gap-2 px-3 w-auto ${prevClassName}`}
        >
          <BsChevronLeft /> <span className="d-md-block d-none">Prev</span>
        </span>
        <div className="vr hr-shadow"></div>
        <span
          onClick={nextonClick}
          className={`social-btn-re d-align gap-2 px-3 w-auto ${nextClassName}`}
        >
          <span className="d-md-block d-none">Next</span> <BsChevronRight />
        </span>
      </span>
    </div>
  );
};

export default ReactPagination;
