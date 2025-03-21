import React from "react";
import TooltipComponent from "./TooltipComponent";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ImportExcel = ({ redirectUrl }) => {
  const navigate = useNavigate();
  return (
    <TooltipComponent title={"Import"} align="left">
      <button
        className="shadow border-0 purple-combo cursor-pointer"
        onClick={() => navigate(redirectUrl)}
      >
        <RiFileExcel2Fill className="fs-4 text-green" />
      </button>
    </TooltipComponent>
  );
};

export default ImportExcel;
