import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  deleteRequestCashById,
  getAllRequestCash,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import ApprovedRequestCash from "./ApprovedRequestCash";
import RejectedRequestCash from "./RejectedRequestCash";

const RequestCash = () => {
  const [requireData, setRequestCashData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState("");

  const fetchAllRequestCashData = async () => {
    const res = await getAllRequestCash(search, pageSize, pageNo);
    if (res.status) {
      setRequestCashData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestCashData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteRequestCashById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRequestCashData((prev) =>
        prev.filter((dlt) => dlt.id !== +idToDelete)
      );
      fetchAllRequestCashData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllRequestCashData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Request Cash List · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold"
              title={["Request Cash List"]}
            />
            <Tab className="ms-auto" title={["All Request"]}>
              <span className="d-align mt-3 me-3 justify-content-end gap-2">
                <span className="position-relative">
                  <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="me-2"
                    aria-label="Search"
                  />
                </span>
                <Button
                  as={Link}
                  to={`/RequestCash/create-request-cash/new`}
                  variant="light"
                  className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                >
                  <BsPlus /> Create
                </Button>
              </span>
              <div className="overflow-auto p-3">
                <Table className="text-body bg-new Roles">
                  <thead className="text-truncate">
                    <tr>
                      {[
                        "Sr No.",
                        "User Name",
                        "Request id",
                        "Request Data",
                        "Request Amount",
                        "Request Status",
                        "Action",
                      ].map((thead) => (
                        <th key={thead}>{thead}</th>
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
                    ) : requireData.length > 0 ? (
                      <>
                        {requireData?.map((itm, idx) => (
                          <tr key={idx}>
                            <td>{serialNumber[idx]}</td>
                            <td>
                              <ImageViewer
                                src={
                                  itm?.user_image
                                    ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  width={30}
                                  height={30}
                                  className="my-bg object-fit p-1 rounded-circle"
                                  src={
                                    itm?.user_image
                                      ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                />{" "}
                                {itm?.user_name}
                              </ImageViewer>
                            </td>
                            <td>{itm?.request_unique_id}</td>
                            <td>{itm?.request_date}</td>
                            <td className="text-green">
                              ₹ {itm?.request_amount}
                            </td>
                            <td className={`text-orange`}>Pending</td>
                            <td>
                              <ActionButton
                                editlink={`/RequestCash/create-request-cash/${itm.id}`}
                                eyelink={`/RequestCash/view-details/${itm.id}?type=view`}
                                deleteOnclick={() => {
                                  setIdToDelete(itm.id);
                                  setShowAlert(true);
                                }}
                              />
                            </td>
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
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? requireData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : requireData.length < pageSize
                      ? "danger-combo-disable pe-none"
                      : "success-combo"
                  }
                  title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                    pageDetail?.pageEndResult || 0
                  } of ${pageDetail?.total || 0}`}
                  handlePageSizeChange={handlePageSizeChange}
                  prevonClick={() => setPageNo(pageNo - 1)}
                  nextonClick={() => setPageNo(pageNo + 1)}
                />

                <ConfirmAlert
                  size={"sm"}
                  deleteFunction={handleDelete}
                  hide={setShowAlert}
                  show={showAlert}
                  title={"Confirm Delete"}
                  description={"Are you sure you want to delete this!!"}
                />
              </div>
            </Tab>
            <Tab title={["Approved"]}>
              {typeData === "Approved" && <ApprovedRequestCash />}
            </Tab>
            <Tab title={["Rejected"]}>
              {typeData === "Rejected" && <RejectedRequestCash />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default RequestCash;
