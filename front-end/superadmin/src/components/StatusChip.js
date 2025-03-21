import React from "react";

const StatusChip = ({ status }) => {
  const commonGreenStyle = {
    color: "var(--text-green)",
  };
  const commonRedStyle = {
    color: "var(--bs-danger)",
  };
  const commonOrangeStyle = {
    color: "var(--btn-danger1)",
  };
  const commonSecondaryStyle = {
    color: "var(--bs-secondary)",
  };

  const colorCode = {
    active: commonGreenStyle,
    paid: commonGreenStyle,
    approved: commonGreenStyle,
    credit: commonGreenStyle,
    "Payment received": commonGreenStyle,
    complete: commonGreenStyle,
    done: commonGreenStyle,
    completed: commonGreenStyle,
    inActive: commonRedStyle,
    debit: commonRedStyle,
    rejected: commonRedStyle,
    "over-due": commonRedStyle,
    "to-do": commonOrangeStyle,
    report: commonOrangeStyle,
    allocate: commonOrangeStyle,
    resolved: commonOrangeStyle,
    feedback: commonGreenStyle,
    suggestion: commonOrangeStyle,
    working: commonOrangeStyle,
    progress: commonOrangeStyle,
    "in-progress": commonGreenStyle,
    "ready to pi": commonGreenStyle,
    hold: commonSecondaryStyle,
    closed: commonSecondaryStyle,
  };
  const normalizedStatus = status?.toLowerCase();
  const { color } = colorCode[normalizedStatus] || "";

  return (
    <span style={{ color: color || "#8f8f0a" }} className="fw-bold">
      {status}
    </span>
  );
};

export default StatusChip;
