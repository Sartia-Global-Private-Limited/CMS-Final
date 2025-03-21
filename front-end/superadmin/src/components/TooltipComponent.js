import React from "react";
import Tooltip from "react-simple-tooltip";
const TooltipComponent = (props) => {
  return (
    <Tooltip
      arrow={5}
      data={() => onclick()}
      background="#000"
      border="#000"
      color="#fff"
      content={props.title}
      fontSize=".6rem"
      offset={3}
      padding={3}
      placement={props.align}
      radius={5}
      className={props.className}
      zIndex={40}
      customCss={`white-space: nowrap; transition: 300ms ease;`}
    >
      {props.children}
    </Tooltip>
  );
};

export default TooltipComponent;
