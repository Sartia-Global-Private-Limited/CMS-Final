import React from "react";
import ImageViewer from "./ImageViewer";
import TooltipComponent from "./TooltipComponent";

export const ItemDetail = ({ img, name, unique_id }) => {
  return (
    <div className="d-flex text-start">
      <ImageViewer
        src={
          img
            ? process.env.REACT_APP_API_URL + img
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
      >
        <img
          src={
            img
              ? process.env.REACT_APP_API_URL + img
              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          className="avatar me-2"
        />
      </ImageViewer>
      <span className="small d-grid">
        <span>{name}</span>
        <span className="text-gray">{unique_id ? `(${unique_id})` : "-"}</span>
      </span>
    </div>
  );
};
export const UserDetail = ({
  className,
  img,
  name,
  id,
  unique_id,
  login_id,
}) => {
  return name ? (
    <div className={`d-flex text-start ${className}`}>
      <ImageViewer
        src={
          img
            ? process.env.REACT_APP_API_URL + img
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
      >
        <img
          src={
            img
              ? process.env.REACT_APP_API_URL + img
              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          className="avatar me-2"
        />
      </ImageViewer>
      <span
        onClick={() => {
          const urlLink =
            login_id == id ? `/MyProfile` : `/Employees/ViewEmployee/${id}`;
          window.open(urlLink, "_blank");
        }}
        className="small d-grid cursor-pointer text-secondary"
      >
        <span>{name}</span>
        <span className="text-gray">{unique_id ? `(${unique_id})` : "-"}</span>
      </span>
    </div>
  ) : (
    "-"
  );
};
export const UserDetails = ({ img, name, id, unique_id, login_id }) => {
  return name ? (
    <TooltipComponent
      title={
        <>
          <span
            onClick={() => {
              const urlLink =
                login_id == id ? `/MyProfile` : `/Employees/ViewEmployee/${id}`;
              window.open(urlLink, "_blank");
            }}
            className="small text-start d-grid cursor-pointer"
          >
            <span>{name}</span>
            <span style={{ color: "var(--bs-primary-tint-60)" }}>
              {unique_id ? `(${unique_id})` : "-"}
            </span>
          </span>
        </>
      }
      className="user-hover"
    >
      <ImageViewer
        src={
          img
            ? process.env.REACT_APP_API_URL + img
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
      >
        <img
          className="user-hover-btn"
          src={
            img
              ? process.env.REACT_APP_API_URL + img
              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
        />
      </ImageViewer>
    </TooltipComponent>
  ) : (
    "-"
  );
};
