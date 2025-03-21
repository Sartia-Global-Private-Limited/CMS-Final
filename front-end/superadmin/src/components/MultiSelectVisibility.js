import React from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MultiSelectVisibility({
  headerNames,
  setColumn,
  column,
  className = "w-100 w-md-50 form-shadow",
  ...props
}) {
  return (
    <MultiSelect
      value={column}
      onChange={(e) => setColumn(e?.value)}
      options={headerNames}
      optionLabel="name"
      placeholder="select..."
      className={className}
      maxSelectedLabels={3}
      {...props}
    />
  );
}
