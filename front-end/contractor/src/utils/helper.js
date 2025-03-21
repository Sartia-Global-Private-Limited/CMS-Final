import moment from "moment";

// Check if the current date is within the financial year
export const isCurrentFinancialYear = (item) => {
  const currentDate = new Date();
  return (
    currentDate >= new Date(item?.start_date) &&
    currentDate <= new Date(item?.end_date)
  );
};

export const getDateValue = (val, format = "DD-MM-YYYY") => {
  return val ? moment(val).format(format) : "-";
};

export const QUERY_PARAMS = (params = {}) =>
  Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export const replaceSpaces = (val) => {
  return val
    ? val
        .toLowerCase()
        .replace(/%20| /g, "_")
        .replace(/[^a-z0-9_]/g, "")
    : "";
};

export const findMatchingPath = (route, currentPath) => {
  if (route?.length > 0) {
    for (let i = 0; i < route?.length; i++) {
      if (route[i].path === currentPath) {
        return route[i];
      }
      if (route[i].submodules?.length > 0) {
        const submoduleResult = findMatchingPath(
          route[i].submodules,
          currentPath
        );
        if (submoduleResult) {
          return submoduleResult;
        }
        for (let j = 0; j < route[i].modulesOfSubModule; i++) {
          if (route[i].modulesOfSubModule[j].path === currentPath) {
            return route[i].modulesOfSubmodule[j];
          }
        }
      }
    }
  }

  return null;
};

export const formatNumberToINR = (number = 0) => {
  if (!number) return "₹0";
  if (number < 0) {
    return `-₹${Math.abs(number).toLocaleString("en-IN")}`;
  }
  return `₹${number.toLocaleString("en-IN")}`;
};

export const getImageSrc = (selectedFile, fallbackUrl) => {
  if (
    selectedFile &&
    selectedFile.type &&
    selectedFile.type.startsWith("image/")
  ) {
    return URL.createObjectURL(selectedFile);
  }

  return `${process.env.REACT_APP_API_URL}/${fallbackUrl}` || "";
};

export const serialNumber = (pageNo, pageSize) => {
  const start = (+pageNo - 1) * +pageSize + 1;
  return Array.from({ length: +pageSize }, (_, index) => start + index);
};

// download csv
export const convertToCSV = (data) => {
  const csv = data.map((row) => row.join(",")).join("\n");
  return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
};

export const DOWNLOAD_CSV_FILE = (data, filename = "data.csv") => {
  const csvData = convertToCSV(data);
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", csvData);
  downloadLink.setAttribute("download", filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const DOWNLOAD_FILE_WITH_BACKEND = (fileUrl) => {
  const element = document.createElement("a");
  element.href = `${process.env.REACT_APP_API_URL}/sample_file/${fileUrl}`;
  element.download = fileUrl;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const preFillFormData = (e, setFieldValue, data) => {
  if (!e) {
    data.forEach((itm) => {
      setFieldValue(itm.to, "");
    });
  } else {
    data.forEach((itm) => {
      setFieldValue(itm.to, e[itm.fill]);
    });
  }
};

export const TOGGLE_ROW_HELPER = (prevCollapsedRows, index) => {
  const isCollapsed = prevCollapsedRows?.includes(index);
  if (isCollapsed) {
    return prevCollapsedRows?.filter((rowIndex) => rowIndex !== index);
  } else {
    return [...prevCollapsedRows, index];
  }
};
