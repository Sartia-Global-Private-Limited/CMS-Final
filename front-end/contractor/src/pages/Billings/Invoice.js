import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  deleteInvoiceById,
  getAllInvoiceListing,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Invoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchInvoiceData = async () => {
    const res = await getAllInvoiceListing({ search, pageSize, pageNo });
    if (res.status) {
      setInvoice(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setInvoice([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteInvoiceById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setInvoice((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchInvoiceData();
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
        <title>Invoice · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Invoice"}
          icon={<BsPlus />}
          link={"/Invoice/CreateInvoice/new"}
          tag={"Create"}
        >
          <div className="table-scroll ">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("PI NUMBER")}</th>
                  <th>{t("BILL DATE")}</th>
                  <th>{t("FINANCIAL YEAR")}</th>
                  <th>{t("BILLING REGIONAL OFFICE")}</th>
                  <th>{t("Billing From")}</th>
                  <th>{t("Billing To")}</th>

                  <th style={{ width: "fit-content" }}>{t("COMPLAINT ID")}</th>
                  <th>{t("PO")}</th>
                  <th>{t("ACTION")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : invoice.length > 0 ? (
                  <>
                    {invoice.map((data, id1) => (
                      <tr key={id1}>
                        <td>{data?.bill_no ?? "--"}</td>
                        <td>{data?.created_at ?? "--"}</td>
                        <td>{data?.financial_year ?? "--"}</td>
                        <td>{data?.billing_to_ro_office?.ro_name ?? "--"}</td>
                        <td>{data.billing_from.company_name}</td>
                        <td>{data?.billing_to?.company_name}</td>

                        <td>
                          {data?.complaintDetails?.map((item, idx) => (
                            <li> {item?.complaint_unique_id ?? "--"}</li>
                          )) ?? "--"}
                        </td>
                        <td>{data?.po_number ?? "--"}</td>
                        <td>
                          <ActionButton
                            hideDelete={"d-none"}
                            eyeOnclick={() =>
                              navigate(`/view-merge-to-pi`, {
                                state: {
                                  id: data?.id,
                                },
                              })
                            }
                            hideEdit={"d-none"}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={8}>
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
          </div>

          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? invoice.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : invoice.length < pageSize
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
        </CardComponent>
      </Col>
    </>
  );
};

export default Invoice;
