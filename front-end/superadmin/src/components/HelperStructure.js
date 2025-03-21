import React from "react";

export const FORMAT_OPTION_LABEL = ({
  label,
  image,
  role_name,
  employee_id,
}) => {
  return (
    <div>
      <img
        src={
          image ||
          `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        className="avatar me-2"
      />
      {label}{" "}
      <small className="text-gray">{employee_id && `(${employee_id})`}</small>{" "}
    </div>
  );
};
export const FORMAT_COMPLAINT_OPTION_LABEL = ({
  label,
  image,
  employee_id,
  isDisabled,
  supervisorUsers,
  free_supervisor_users,
  free_end_users,
}) => {
  return (
    <div
      className={`${
        isDisabled ? "danger-combo-disable pe-none1" : ""
      } d-align justify-content-between border-bottom`}
    >
      <div>
        <img
          src={
            image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          className="avatar me-2"
        />
        {label}{" "}
        <small className="text-gray">{employee_id && `(${employee_id})`}</small>{" "}
      </div>

      {isDisabled && (
        <div className="small">
          <span
            className="badge fw-normal ms-2 rounded-pill bg-success"
            style={{ letterSpacing: 2 }}
          >
            Assigned
          </span>
        </div>
      )}

      <div className="d-flex">
        {supervisorUsers ? (
          <div className="small">
            Free Supervisor
            <span className="badge  ms-2 rounded-pill bg-success">
              {free_supervisor_users === null ? 0 : free_supervisor_users}
            </span>
          </div>
        ) : null}
        {free_end_users >= 0 && (
          <div className="small ms-3">
            Free User
            <span className="badge ms-2 rounded-pill bg-success">
              {free_end_users}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
