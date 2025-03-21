import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  deleteProformaInvoiceById,
  getAllPerformaInvoice,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PerformaInvoice = () => {
  const [performaInvoice, setPerformaInvoice] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchPerformaInvoiceData = async () => {
    const res = await getAllPerformaInvoice({ search, pageSize, pageNo });
    if (res.status) {
      setPerformaInvoice(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPerformaInvoice([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteProformaInvoiceById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setPerformaInvoice((prev) =>
        prev.filter((itm) => itm.id !== +idToDelete)
      );
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchPerformaInvoiceData();
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
        <title>Performa Invoice · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Performa Invoice"}
          icon={<BsPlus />}
          link={"/PerformaInvoice/CreatePerformaInvoice/new"}
          tag={t("Create")}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "bill Number",
                    "Financial Year",
                    "Billing Regional office",
                    "Outlet Name",
                    "Complaint Id",
                    "po",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
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
                ) : performaInvoice.length > 0 ? (
                  <>
                    {performaInvoice.map((data, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>
                          <Link
                            className="text-secondary text-none"
                            to={`/PerformaInvoice/CreatePerformaInvoice/${data.id}?type=view`}
                          >
                            {data.bill_no}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="text-secondary text-none"
                            to={`/PerformaInvoice/CreatePerformaInvoice/${data.id}?type=view`}
                          >
                            {data.financial_year}
                          </Link>
                        </td>
                        <td>{data.billing_to_ro_office?.ro_name}</td>
                        <td>{data.outlet_name}</td>
                        <td>{data.complaint_unique_id}</td>
                        <td>{data.po_number}</td>
                        <td>
                          <ActionButton
                            eyelink={`/PerformaInvoice/CreatePerformaInvoice/${data.id}?type=view`}
                            editlink={`/PerformaInvoice/CreatePerformaInvoice/${data.id}`}
                            editClass={`danger-${
                              data?.is_merged === "1"
                                ? "combo-disable pe-none"
                                : "combo"
                            }`}
                            deleteClass={`${
                              data?.is_merged === "1"
                                ? "danger-combo-disable pe-none"
                                : "red-combo"
                            }`}
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
                ? performaInvoice.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : performaInvoice.length < pageSize
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

export default PerformaInvoice;
