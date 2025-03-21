import React from "react";
import { useTranslation } from "react-i18next";
import {
  BsEyeFill,
  BsPencilSquare,
  BsTrash,
  BsCheckLg,
  BsXLg,
} from "react-icons/bs";
import TooltipComponent from "../TooltipComponent";

const ActionButton = ({
  tooltipTitle,
  onClick,
  icon: Icon,
  align,
  className,
}) => {
  if (!Icon) return null;
  return (
    <TooltipComponent align={align} title={tooltipTitle}>
      <Icon onClick={onClick} className={`social-btn ${className}`} />
    </TooltipComponent>
  );
};

const ActionButtons = ({ className, gap = "2", custom, actions = {} }) => {
  const { t } = useTranslation();

  const defaultActions = {
    view: {
      icon: BsEyeFill,
      align: "top",
      disabled: false,
      className: "success-combo",
    },
    edit: {
      icon: BsPencilSquare,
      align: "top",
      disabled: false,
      className: "danger-combo",
    },
    delete: {
      icon: BsTrash,
      align: "top",
      disabled: false,
      className: "red-combo",
    },
    approve: {
      icon: BsCheckLg,
      align: "top",
      disabled: false,
      className: "success-combo",
    },
    reject: {
      icon: BsXLg,
      align: "top",
      disabled: false,
      className: "red-combo",
    },
  };

  const combinedActions = Object.keys(defaultActions).reduce((acc, key) => {
    acc[key] = { ...defaultActions[key], ...actions[key] };
    return acc;
  }, {});

  const visibleActions = Object.keys(combinedActions).filter(
    (key) => combinedActions[key].show
  );

  return (
    <span className={`d-align gap-${gap} ${className}`}>
      {visibleActions.map((key, index) => {
        const { tooltipTitle, action, icon, align, disabled, className } =
          combinedActions[key];

        return (
          <React.Fragment key={key}>
            {index > 0 && <div className="vr hr-shadow" />}
            <ActionButton
              tooltipTitle={
                tooltipTitle || t(key.charAt(0).toUpperCase() + key.slice(1))
              }
              onClick={disabled ? null : action}
              icon={icon}
              align={align}
              className={`${disabled ? "danger-combo-disable" : className}`}
            />
          </React.Fragment>
        );
      })}
      {custom}
    </span>
  );
};

export default ActionButtons;
