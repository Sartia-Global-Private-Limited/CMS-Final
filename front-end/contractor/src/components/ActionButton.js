import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  BsCheckLg,
  BsEyeFill,
  BsFillPersonCheckFill,
  BsPencilSquare,
  BsTrash,
  BsXLg,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import TooltipComponent from "./TooltipComponent";

const ActionButton = ({
  className,
  eyelink,
  editlink,
  hideEdit = true,
  editClass = "danger-combo",
  custom,
  hideDelete = true,
  editOnclick,
  deleteOnclick,
  eyeOnclick,
  hideEye = true,
  approveOnclick,
  rejectOnclick,
  approveMargin = "mx-2",
  assignLink,
  approveLink,
  assignOnclick,
  rejectClass = "red-combo",
  deleteClass = "red-combo",
  approveClass = "success-combo",
  gap = "2",
  hideAssignLine = true,
  hideApproveLine = true,
  eyeAlign,
  editAlign,
  deleteAlign,
  allocateAlign,
  rejectAlign,
  approveAlign,
}) => {
  const { t } = useTranslation();
  return (
    <span className={`d-align gap-${gap} ${className}`}>
      {hideEye && (
        <TooltipComponent
          align={eyeAlign}
          title={t("View")}
          className={hideEye}
        >
          <Button
            className={`view-btn`}
            variant="light"
            as={eyelink ? Link : null}
            to={eyelink}
          >
            <BsEyeFill
              onClick={eyeOnclick}
              className={`social-btn success-combo`}
            />
          </Button>
        </TooltipComponent>
      )}
      {hideEdit && (
        <>
          <div className={`vr hr-shadow ${hideEye} ${hideEdit}`} />
          <TooltipComponent
            align={editAlign}
            title={t("Edit")}
            className={hideEdit}
          >
            <Button
              className={`view-btn ${editClass}`}
              variant="light"
              as={editlink ? Link : null}
              to={editlink}
            >
              <BsPencilSquare
                onClick={editOnclick}
                className={`social-btn ${editClass}`}
              />
            </Button>
          </TooltipComponent>
        </>
      )}
      {hideDelete && (
        <>
          <div className={`vr hr-shadow ${hideDelete}`} />
          <TooltipComponent
            align={deleteAlign}
            title={t("Delete")}
            className={hideDelete}
          >
            <BsTrash
              onClick={deleteOnclick}
              className={`social-btn ${deleteClass}`}
            />
          </TooltipComponent>
        </>
      )}
      {(assignLink || assignOnclick) && (
        <>
          {hideAssignLine ? <div className={`vr hr-shadow`} /> : null}
          <TooltipComponent align={allocateAlign} title={t("Allocate")}>
            <Button
              className={`view-btn`}
              variant="light"
              as={assignLink ? Link : null}
              to={assignLink}
            >
              <BsFillPersonCheckFill
                onClick={assignOnclick}
                className={`social-btn red-combo`}
              />
            </Button>
          </TooltipComponent>
        </>
      )}
      {rejectOnclick && (
        <>
          <div className={`vr hr-shadow`} />
          <TooltipComponent align={rejectAlign} title={"Reject"}>
            <BsXLg
              onClick={rejectOnclick}
              className={`social-btn ${rejectClass}`}
            />
          </TooltipComponent>
        </>
      )}
      {approveOnclick || approveLink ? (
        <>
          {hideApproveLine ? <div className={`vr hr-shadow`} /> : null}
          <TooltipComponent align={approveAlign} title={t("Approve")}>
            <Button
              className={`view-btn ${approveClass} ${approveMargin}`}
              variant="light"
              as={approveLink ? Link : null}
              to={approveLink}
            >
              <BsCheckLg
                onClick={approveOnclick}
                className={`social-btn ${approveClass}`}
              />
            </Button>
          </TooltipComponent>
        </>
      ) : null}
      {custom}
    </span>
  );
};

export default ActionButton;
