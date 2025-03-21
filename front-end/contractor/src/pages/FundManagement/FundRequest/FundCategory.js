import React, { useState } from "react";
import { Card, Col, Form, Tab, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ImageViewer from "../../../components/ImageViewer";
import ReactPagination from "../../../components/ReactPagination";

const FundCategory = () => {
  const [pendingFundTransfer, setPendingFundTransfer] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [typeData, setTypeData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const results = !searchTerm
    ? pendingFundTransfer
    : pendingFundTransfer.filter(
        (itm) =>
          itm?.request_by
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          itm?.request_by_employee_id
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
      );

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <div>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <span className="d-align mt-3 me-3 justify-content-between gap-2">
            <h6 className=" fw-bold mx-3">Fund Category</h6>
            <span className="position-relative">
              <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
                aria-label="Search"
              />
            </span>
          </span>
          <div className="p-3">
            <div className="table-scroll">
              <Table className="text-body bg-new Roles">
                <thead className="text-truncate">
                  <tr>
                    {[
                      "Sr No.",
                      "Request By",
                      "Request Date",
                      "Request Amount",
                      "Total Approved Amount",
                      "Status",
                      "Action",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8}>
                        <img
                          className="p-3"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                          alt="Loading"
                        />
                      </td>
                    </tr>
                  ) : results.length > 0 ? (
                    results.map((data, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>
                          <ImageViewer
                            src={
                              data?.request_by_image
                                ? `${process.env.REACT_APP_API_URL}${data?.request_by_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <span className="d-flex align-items-center gap-2">
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  data?.request_by_image
                                    ? `${process.env.REACT_APP_API_URL}${data?.request_by_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                              <span className="d-grid">
                                {data?.request_by}{" "}
                                <span>
                                  {data?.request_by_employee_id
                                    ? data?.request_by_employee_id
                                    : null}
                                </span>
                              </span>
                            </span>
                          </ImageViewer>
                        </td>
                        <td>{data.request_date}</td>
                        <td
                          className={`fw-bolder text-${
                            data.total_request_amount > 0 ? "green" : "danger"
                          }`}
                        >
                          {data.total_request_amount > 0
                            ? `${"₹"} ${data.total_request_amount}`
                            : "0"}
                        </td>
                        <td
                          className={`fw-bolder text-${
                            data.total_approved_amount > 0 ? "green" : "danger"
                          }`}
                        >
                          {data.total_approved_amount > 0
                            ? `${"₹"} ${data.total_approved_amount}`
                            : "0"}
                        </td>
                        <td
                          className={`text-${
                            data?.status === "0"
                              ? "warning"
                              : data?.status === "1"
                              ? "green"
                              : data?.status === "2"
                              ? "danger"
                              : data?.status === "3"
                              ? "orange"
                              : "success"
                          }`}
                        >
                          {data?.status === "0"
                            ? "Pending"
                            : data?.status === "1"
                            ? "Approved"
                            : data?.status === "2"
                            ? "Rejected"
                            : data?.status === "3"
                            ? "Hold"
                            : "done"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={10}>
                      <ReactPagination
                        pageSize={pageSize}
                        prevClassName={
                          pageNo === 1
                            ? "danger-combo-disable pe-none"
                            : "red-combo"
                        }
                        nextClassName={
                          pageSize == pageDetail?.total
                            ? pendingFundTransfer.length - 1 < pageSize
                              ? "danger-combo-disable pe-none"
                              : "success-combo"
                            : pendingFundTransfer.length < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                        }
                        title={`Showing ${
                          pageDetail?.pageStartResult || 0
                        } to ${pageDetail?.pageEndResult || 0} of ${
                          pageDetail?.total || 0
                        }`}
                        handlePageSizeChange={handlePageSizeChange}
                        prevonClick={() => setPageNo(pageNo - 1)}
                        nextonClick={() => setPageNo(pageNo + 1)}
                      />
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default FundCategory;
