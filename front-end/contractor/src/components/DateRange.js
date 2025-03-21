import React, { useState } from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { X } from "lucide-react";

const DateRange = ({ value, setValue, ...props }) => {
  const [displayValue, setDisplayValue] = useState("");

  const handleApply = (e, picker) => {
    const startDate = moment(picker.startDate);
    const endDate = moment(picker.endDate);

    setDisplayValue(
      `${startDate.format("DD/MM/YYYY")} - ${endDate.format("DD/MM/YYYY")}`
    );

    setValue(
      `${startDate.format("YYYY-MM-DD")},${endDate.format("YYYY-MM-DD")}`
    );
  };

  const handleClear = () => {
    setDisplayValue("");
    setValue("");
  };

  return (
    <div className="d-flex align-items-center">
      <DateRangePicker
        initialSettings={{ startDate: new Date(), endDate: new Date() }}
        onApply={handleApply}
      >
        <input
          type="text"
          value={displayValue}
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          className="form-control"
          readOnly
          {...props}
        />
      </DateRangePicker>
      {displayValue && (
        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={handleClear}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default DateRange;
