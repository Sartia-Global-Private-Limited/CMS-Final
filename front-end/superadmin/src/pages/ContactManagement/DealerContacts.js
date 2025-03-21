import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table, Form } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteContactsById,
  getAllDealerContacts,
} from "../../services/contractorApi";

import { useTranslation } from "react-i18next";
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DealerContacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allTaxes, setAllTaxes] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchTaxesData = async () => {
    const res = await getAllDealerContacts(search, pageSize, pageNo);

    if (res.status) {
      setAllTaxes(res?.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllTaxes([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteContactsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllTaxes((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchTaxesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchTaxesData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  const handleSelect = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allTaxes.map((item) => item.id);
      setSelectedInvoices(allItemId);
    } else setSelectedInvoices([]);
  };
  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Dealer Contacts"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="d-flex mb-3 justify-content-end">
            {selectedInvoices.length > 0 && (
              <button
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1 me-4"
                onClick={() =>
                  navigate(`/contacts/energy/send-messages/new`, {
                    state: {
                      id: selectedInvoices,
                      data: allTaxes,
                    },
                  })
                }
              >
                <FaClipboardCheck />
                {t("Send Messages")}
              </button>
            )}
          </div>
          <div className="table-scroll">
            <Table className="text-body  Roles">
              <thead className="text-truncate">
                <tr>
                  <th>
                    {allTaxes.length > 0 && (
                      <Form.Check
                        onClick={(e) => handleSelectAll(e.target.checked)}
                        checked={allTaxes.every((item) =>
                          selectedInvoices.includes(item.id)
                        )}
                      ></Form.Check>
                    )}
                  </th>
                  <th> {t("Sr No.")}</th>
                  <th> {t("name")}</th>
                  <th> {t("email")}</th>
                  <th> {t("address")}</th>
                  <th> {t("Mobile")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt={t("Loading")}
                    />
                  </td>
                ) : allTaxes?.length > 0 ? (
                  <>
                    {allTaxes?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>
                          <Form.Check
                            checked={selectedInvoices.includes(itm.id)}
                            onClick={() => handleSelect(itm.id)}
                          ></Form.Check>
                        </td>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.dealer_name}</td>
                        <td>{itm?.email || "--"}</td>
                        <td>{itm?.address || "--"}</td>
                        <td>{itm?.mobile}</td>
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
            </Table>
          </div>

          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            className="my-2"
            nextClassName={
              pageSize == pageDetail?.total
                ? allTaxes.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : allTaxes.length < pageSize
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

export default DealerContacts;
