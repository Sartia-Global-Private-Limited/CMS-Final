import React from "react";
import { Button, NavDropdown } from "react-bootstrap";
import TooltipComponent from "./TooltipComponent";
import { BsThreeDotsVertical } from "react-icons/bs";

export const ActionDropdown = ({ data = [] }) => {
  return (
    <>
      <style jsx>
        {`
          .dropdown-toggle::after {
            display: none !important;
          }
          .my-drop .dropdown-menu.show {
            display: block;
            background: transparent;
            backdrop-filter: blur(4px);
            border: 1px solid #c8c8c8;
          }
        `}
      </style>

      <div className="vr hr-shadow" />
      <NavDropdown
        id="action-dropdown"
        className="my-drop dropdown-toggle"
        title={
          <TooltipComponent align="left" title={"More"}>
            <Button className={`view-btn`} variant="light">
              <BsThreeDotsVertical className={`social-btn purple-combo`} />
            </Button>
          </TooltipComponent>
        }
      >
        {data?.map((itm, idx) => {
          return (
            <NavDropdown.Item
              key={idx}
              href="#"
              onClick={itm?.onClick}
              disabled={itm?.disabled}
            >
              {itm?.icon} {itm?.title}
            </NavDropdown.Item>
          );
        })}
      </NavDropdown>
    </>
  );
};
