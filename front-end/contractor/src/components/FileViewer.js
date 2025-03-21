import React from "react";
import { Download, File } from "lucide-react";
import pdfIcon from "../assets/images/pdf.png";
import csvIcon from "../assets/images/csv.png";
import docIcon from "../assets/images/doc.png";
import docxIcon from "../assets/images/doc.png";
import xlsIcon from "../assets/images/xls.png";
import xlsxIcon from "../assets/images/xls.png";
import { Image } from "react-bootstrap";

const FileViewer = ({
  file,
  align = "center",
  width = 40,
  height = 40,
  fileSize = 25,
}) => {
  const getFileTypeIcon = (file) => {
    if (!file) {
      return null;
    }

    const fileName = typeof file === "string" ? file : file.name;
    const fileType = fileName?.split(".").pop().toLowerCase();

    const icons = {
      pdf: (
        <img
          alt="pdf"
          src={pdfIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
      csv: (
        <img
          alt="csv"
          src={csvIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
      doc: (
        <img
          alt="doc"
          src={docIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
      docx: (
        <img
          alt="docx"
          src={docxIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
      xls: (
        <img
          alt="xls"
          src={xlsIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
      xlsx: (
        <img
          alt="xlsx"
          src={xlsxIcon}
          width={width}
          height={height}
          className="rounded"
        />
      ),
    };

    const downloadLink =
      typeof file === "string"
        ? process.env.REACT_APP_API_URL + file
        : URL.createObjectURL(file);

    const icon = icons[fileType] || (
      <img
        src={
          typeof file === "string"
            ? `${process.env.REACT_APP_API_URL}${file}`
            : file?.preview?.url
        }
        width={40}
        height={40}
        style={{ objectFit: "contain" }}
        alt={""}
      />
    );

    return (
      <div className="position-relative d-inline-block text-center">
        <div className="hover-box position-relative">
          <a
            style={{ textAlign: align }}
            target="_blank"
            href={downloadLink}
            download={fileName}
            rel="noopener noreferrer"
          >
            {icon}
            <div
              className="download-icon position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                top: 0,
                left: 0,
                backgroundColor: "rgb(82 0 255 / 0.51)",
                color: "white",
                borderRadius: "0.25rem",
                backdropFilter: "blur(3px)",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
            >
              <Download size={20} />
            </div>
          </a>
        </div>
      </div>
    );
  };

  return <div>{getFileTypeIcon(file)}</div>;
};

export default FileViewer;
