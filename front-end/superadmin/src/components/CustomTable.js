import React, { useState } from "react";
import { Table } from "react-bootstrap";
import ReactPagination from "./ReactPagination";

const CustomTable = ({ columns, rowData, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const pageCount = Math.ceil(rowData.length / pageSize);
  const offset = (currentPage - 1) * pageSize;
  const currentPageData = rowData.slice(offset, offset + pageSize);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.value);
  };

  return (
    <div>
      <Table className="text-body bg-new Roles">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <td colSpan={7}>
              <img
                className="p-3"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                alt="Loading"
              />
            </td>
          ) : currentPageData.length > 0 ? (
            <>
              {currentPageData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cellData, cellIndex) => (
                    <td key={cellIndex}>{cellData}</td>
                  ))}
                </tr>
              ))}
            </>
          ) : (
            <td colSpan={7}>
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </td>
          )}
        </tbody>
      </Table>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          currentPage === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          currentPage === pageCount
            ? "danger-combo-disable pe-none"
            : "success-combo"
        }
        title={`Showing ${currentPage || 0} to ${pageCount || 0} of ${
          rowData.length || 0
        }`}
        handlePageSizeChange={handlePageSizeChange}
        prevonClick={handlePreviousPage}
        nextonClick={handleNextPage}
      />
    </div>
  );
};

export default CustomTable;
