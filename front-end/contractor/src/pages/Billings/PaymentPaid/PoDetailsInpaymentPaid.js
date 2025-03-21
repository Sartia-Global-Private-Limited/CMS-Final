import React, { useEffect, useState } from "react";
import { Card, Col, Table, Form, Row } from "react-bootstrap";
import "react-best-tabs/dist/index.css";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllPoInPaymentPaid,
  getAllPurchaseOrderListingInPayment,
  getAllRegionalOfficeListing,
  getAllRoInPaymentPaid,
  postPaymentPaidInRo,
} from "../../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../components/ActionButton";
const PoDetailsInpaymentPaid = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const fetchAllInvoices = async () => {
    const res = await getAllPurchaseOrderListingInPayment(
      pageSize,
      pageNo,
      search
    );
    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [pageSize, pageNo, refresh]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <div className="p-3">
        <div className="table-scroll my-2  ">
          <Table className="text-body Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Po number")}</th>
                <th>{t("po date")}</th>
                <th>{t("Total paid amount")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {allComplaints?.length > 0 ? null : (
                <tr>
                  <td colSpan={12}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="210"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}

              {allComplaints?.map((data, id1) => (
                <tr key={id1}>
                  <td>{id1 + 1}</td>
                  <td>{data?.po_number ?? "--"}</td>
                  <td>{data?.po_date ?? "--"}</td>
                  <td>{data?.total_paid_amount ?? "--"}</td>
                  <td>
                    <ActionButton
                      eyeOnclick={() =>
                        navigate(`/payment-paid/po-view`, {
                          state: {
                            id: data.po_id,
                          },
                        })
                      }
                      hideEdit={"d-none"}
                      hideDelete={"d-none"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          pageSize == pageDetail?.total
            ? allComplaints.length - 1 < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
            : allComplaints.length < pageSize
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
    </>
  );
};

export default PoDetailsInpaymentPaid;
