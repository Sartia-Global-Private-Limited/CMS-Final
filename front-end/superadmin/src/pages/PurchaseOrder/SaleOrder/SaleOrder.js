import React from "react";
import { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col, Row, Form, Table, Button } from "react-bootstrap";
import { BsDownload, BsEyeFill, BsPlus, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import SecurityDeposit from "../SecurityDeposit";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  deletePurchaseOrderById,
  getAllPurchaseOrder,
  getSinglePurchaseOrderById,
  postChangePoStatus,
} from "../../../services/contractorApi";
import Modaljs from "../../../components/Modal";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActionButton from "../../../components/ActionButton";
import BillingType from ".././BillingType";
import Switch from "../../../components/Switch";
import { useTranslation } from "react-i18next";

const SaleOrder = () => {
  const [poData, setPoData] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [typeData, setTypeData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchPurchaseOrderData = async () => {
    const res = await getAllPurchaseOrder({ search, pageSize, pageNo });
    if (res.status) {
      setPoData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPoData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDetails = async (id) => {
    const res = await getSinglePurchaseOrderById(id);
    if (res.status) {
      setSingleData(res.data);
    } else {
      setSingleData({});
    }
    setViewDetails(true);
  };

  const handleDelete = async () => {
    const res = await deletePurchaseOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setPoData((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  const handleChangePoStatus = async (e, event) => {
    const sData = {
      po_id: e.id,
      status: event.target.checked === true ? "1" : "2",
    };
    // return console.log("changeStatus", sData);
    const res = await postChangePoStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchPurchaseOrderData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Sale order · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("Sale order")} />
            <Tab className="ms-auto" title={t("Sale order")}>
              <span className="d-align mt-3 me-3 justify-content-end gap-2">
                <span className="position-relative">
                  <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                  <Form.Control
                    type="text"
                    placeholder={t("Search")}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    className="me-2"
                    aria-label="Search"
                  />
                </span>
                <Button
                  as={Link}
                  to={"/sale-order/create/new"}
                  variant="light"
                  className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                >
                  <BsPlus /> {t("Create")}
                </Button>
              </span>
              <div className="overflow-auto p-3">
                <Table className="text-body bg-new Roles">
                  <thead className="text-truncate">
                    <tr>
                      <th>{t("Sr no.")}</th>
                      <th>{t("Po Date")}</th>
                      <th>{t("Regional office")}</th>
                      <th>{t("Po Number")}</th>
                      <th>{t("Limit")}</th>
                      <th>{t("Cr Date")}</th>
                      <th>{t("Cr Number")}</th>
                      <th>{t("Po Status")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <td colSpan={10}>
                        <img
                          className="p-3"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                          alt={t("Loading")}
                        />
                      </td>
                    ) : poData.length > 0 ? (
                      <>
                        {poData.map((data, id1) => (
                          <tr key={id1}>
                            <td>{serialNumber[id1]}</td>
                            <td>{data?.po_date}</td>
                            <td>{data?.regional_office_name}</td>
                            <td>{data?.po_number}</td>
                            <td>{data?.limit}</td>
                            <td>{data?.cr_date}</td>
                            <td>{data?.cr_number}</td>
                            <td>
                              <Switch
                                checked={data.po_status === "1" ? true : false}
                                onChange={(event) =>
                                  handleChangePoStatus(data, event)
                                }
                              />{" "}
                              <span
                                className={`text-${
                                  data.po_status === "1" ? "green" : "orange"
                                }`}
                              >
                                {" "}
                                {data.po_status === "1"
                                  ? "Done"
                                  : "Working"}{" "}
                              </span>
                            </td>
                            <td>
                              <ActionButton
                                eyelink={`/PurchaseOrder/view-details/${data.id}?type=purchase-order`}
                                editlink={`/PurchaseOrder/CreatePurchaseOrder/${data.id}`}
                                deleteOnclick={() => {
                                  setIdToDelete(data.id);
                                  setShowDelete(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <td colSpan={10}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    )}
                  </tbody>
                  <ConfirmAlert
                    size={"sm"}
                    deleteFunction={handleDelete}
                    hide={setShowDelete}
                    show={showDelete}
                    title={"Confirm Delete"}
                    description={"Are you sure you want to delete this!!"}
                  />
                </Table>
                <ReactPagination
                  pageSize={pageSize}
                  prevClassName={
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? poData.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : poData.length < pageSize
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
              </div>
            </Tab>
            <Tab title={t("Security Deposit")}>
              {typeData === t("Security Deposit") && <SecurityDeposit />}
            </Tab>
            <Tab title={t("Billing Type")}>
              {typeData === t("Billing Type") && <BillingType />}
            </Tab>
          </Tabs>
        </Card>
      </Col>

      <Modaljs
        open={viewDetails}
        hideFooter={true}
        size={"lg"}
        close={() => setViewDetails(false)}
        title={
          <>
            <BsEyeFill className="text-green" /> {t("Sale order Details")}
          </>
        }
      >
        <Row className="g-3 py-1">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Company Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("po date")} :</th>
                      <td>{singleData?.po_date}</td>
                    </tr>
                    <tr>
                      <th>{t("Po regional office")} :</th>
                      <td>{singleData?.regional_office_name}</td>
                    </tr>
                    <tr>
                      <th>{t("state")} :</th>
                      <td>{singleData?.state_name}</td>
                    </tr>
                    <tr>
                      <th>{t("po number")}:</th>
                      <td>{singleData?.po_number}</td>
                    </tr>
                    {singleData?.po_amount && (
                      <tr>
                        <th>{t("po amount")} :</th>
                        <td>{singleData?.po_amount}</td>
                      </tr>
                    )}
                    {singleData?.tax_type && (
                      <tr>
                        <th>{t("tax type")} :</th>
                        <td
                          className={`text-${
                            singleData?.tax_type === "1" ? "green" : "orange"
                          }`}
                        >
                          {singleData?.tax_type === "1" ? "Include" : "Exclude"}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th>{t("tax amount")} :</th>
                      <td>{singleData?.tax_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("Limit")} :</th>
                      <td>{singleData?.limit}</td>
                    </tr>
                    <tr>
                      <th>{t("security deposit date")} :</th>
                      <td>{singleData?.security_deposit_date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("security deposit amount")} :</th>
                      <td>{singleData?.security_deposit_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("tender date")} :</th>
                      <td>{singleData?.tender_date}</td>
                    </tr>
                    <tr>
                      <th>{t("tender number")} :</th>
                      <td>{singleData?.tender_number}</td>
                    </tr>
                    <tr>
                      <th>{t("Bank")} :</th>
                      <td>{singleData?.bank}</td>
                    </tr>
                    <tr>
                      <th>{t("dd bg number")} :</th>
                      <td>{singleData?.dd_bg_number}</td>
                    </tr>
                    <tr>
                      <th>{t("Cr Date")} :</th>
                      <td>{singleData?.cr_date}</td>
                    </tr>
                    <tr>
                      <th>{t("Cr Number")} :</th>
                      <td>{singleData?.cr_number}</td>
                    </tr>
                    <tr>
                      <th>{t("Cr Code")} :</th>
                      <td>{singleData?.cr_code}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          {singleData?.purchase_order_item?.length > 0 && (
            <Col md={12}>
              <div className="p-20 mb-5 shadow rounded h-100">
                <strong className="text-secondary">{t("Items")}</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <thead>
                      <tr>
                        <th>{t("Name")}</th>
                        <th>{t("Price")}</th>
                        <th>{t("Quantity")}</th>
                        <th>{t("Sub Total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleData.purchase_order_item.map((item, indx) => (
                        <tr key={indx}>
                          <td>{item?.name}</td>
                          <td>{item?.amount}</td>
                          <td>{item?.qty}</td>
                          <td>{item?.sub_total}</td>
                        </tr>
                      ))}
                    </tbody>
                    {/* <tbody>
											<tr>
												<th>created at :</th>
												<td>{singleData?.created_at}</td>
											</tr>
											<tr>
												<th>created by :</th>
												<td>{singleData?.created_by}</td>
											</tr>
											<tr>
												<th>cr copy :</th>
												<td>
													<a
														href={`${process.env.REACT_APP_API_URL}${singleData.cr_copy}`}
														target="_blank"
														download={true}
														rel="noreferrer"
													>
														<div
															className="shadow d-inline-block p-1 px-3 success-combo"
															style={{ borderRadius: "3px" }}
														>
															<BsDownload fontSize={20} />
														</div>
													</a>
												</td>
											</tr>
											<tr>
												<th>sd letter :</th>
												<td>
													<a
														href={`${process.env.REACT_APP_API_URL}${singleData.sd_letter}`}
														target="_blank"
														download={true}
														rel="noreferrer"
													>
														<div
															className="shadow d-inline-block p-1 px-3 success-combo"
															style={{ borderRadius: "3px" }}
														>
															<BsDownload fontSize={20} />
														</div>
													</a>
												</td>
											</tr>
											<tr>
												<th>work :</th>
												<td>{singleData?.work}</td>
											</tr>
										</tbody> */}
                  </table>
                </div>
              </div>
            </Col>
          )}
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("External Field")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("created at")} :</th>
                      <td>{singleData?.created_at}</td>
                    </tr>
                    <tr>
                      <th>{t("created by")} :</th>
                      <td>{singleData?.created_by}</td>
                    </tr>
                    <tr>
                      <th>{t("cr copy")} :</th>
                      <td>
                        <a
                          href={`${process.env.REACT_APP_API_URL}${singleData.cr_copy}`}
                          target="_blank"
                          download={true}
                          rel="noreferrer"
                        >
                          <div
                            className="shadow d-inline-block p-1 px-3 success-combo"
                            style={{ borderRadius: "3px" }}
                          >
                            <BsDownload fontSize={20} />
                          </div>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>{t("sd letter")} :</th>
                      <td>
                        <a
                          href={`${process.env.REACT_APP_API_URL}${singleData.sd_letter}`}
                          target="_blank"
                          download={true}
                          rel="noreferrer"
                        >
                          {/* <Image
                            width={80}
                            height={50}
                            className="rounded object-fit"
                            src={`/assets/images/pdf.jpg`}
                          /> */}
                          <div
                            className="shadow d-inline-block p-1 px-3 success-combo"
                            style={{ borderRadius: "3px" }}
                          >
                            <BsDownload fontSize={20} />
                          </div>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>{t("work")} :</th>
                      <td>{singleData?.work}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Modaljs>
    </>
  );
};

export default SaleOrder;
