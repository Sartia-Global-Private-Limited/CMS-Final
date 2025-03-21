import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteBillingTypeById,
  getAllBillingType,
} from "../../services/contractorApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BillingType = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allBilling, setAllBilling] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchBillingTypeData = async () => {
    const res = await getAllBillingType(search, pageSize, pageNo);
    if (res.status) {
      setAllBilling(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllBilling([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteBillingTypeById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllBilling((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchBillingTypeData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchBillingTypeData();
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
        <title>Billing Type · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
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
          <Link
            to={`/PurchaseOrder/create-billing-type/new`}
            variant="light"
            className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
          >
            <BsPlus /> {t("Create")}
          </Link>
        </span>
        <div className="overflow-auto p-3 mb-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Name")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <td colSpan={4}>
                  <img
                    className="p-3"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              ) : allBilling.length > 0 ? (
                <>
                  {allBilling?.map((itm, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{itm?.name}</td>
                      <td
                        className={`text-${
                          itm?.status === "Active" ? "green" : "danger"
                        }`}
                      >
                        {itm?.status}
                      </td>
                      <td>
                        <ActionButton
                          hideEye={"d-none"}
                          deleteOnclick={() => {
                            setIdToDelete(itm.id);
                            setShowAlert(true);
                          }}
                          editlink={`/PurchaseOrder/create-billing-type/${itm.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={4}>
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
        </div>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? allBilling.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allBilling.length < pageSize
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
        {/* </CardComponent> */}
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default BillingType;
