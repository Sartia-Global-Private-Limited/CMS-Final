import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  getAllPiOnPoNumber,
  getAllPoDetails,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { Link, useNavigate } from "react-router-dom";

const MergetoInvoice = () => {
  const navigate = useNavigate();
  const [performaInvoice, setPerformaInvoice] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [poAllData, setPoAllData] = useState([]);
  const [poId, setPoId] = useState(null);

  const fetchAllPoData = async () => {
    const res = await getAllPoDetails();
    if (res.status) {
      setPoAllData(res.data);
    } else {
      setPoAllData([]);
    }
  };
  const fetchPerformaInvoiceData = async () => {
    const res = await getAllPiOnPoNumber(search, pageSize, pageNo, poId);
    if (res.status) {
      setPerformaInvoice(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setPerformaInvoice([]);
      setPageDetail({});
    }
  };

  const filteredPi = performaInvoice?.filter((itm) => itm.is_merged !== "1");

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = performaInvoice.map((item) => item.id);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSendToPi = async () => {
    navigate(`/merge-to-invoice/Pi-to-merge/new`, {
      state: {
        selectedItems,
        poId,
      },
    });
  };

  useEffect(() => {
    fetchAllPoData();
    if (poId) {
      fetchPerformaInvoiceData();
    }
  }, [search, pageNo, pageSize, poId]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>Merge to Invoice · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Merge to Invoice"}
          custom={
            <Select
              menuPortalTarget={document.body}
              name={"po_number"}
              placeholder="select po"
              options={poAllData?.map((itm) => ({
                label: itm.po_number,
                value: itm.id,
              }))}
              isClearable
              onChange={(e) => setPoId(e ? e.value : setPerformaInvoice([]))}
            />
          }
        >
          <div className="table-scroll p-2">
            {selectedItems?.length > 0 ? (
              <div className="text-end mb-3">
                <span
                  onClick={handleSendToPi}
                  className="social-btn-re w-auto d-inline-flex align-items-center danger-combo px-3"
                >
                  Pi to Merge
                </span>
              </div>
            ) : null}
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    <>
                      <Form.Check
                        checked={selectedItems.length}
                        onClick={handleSelectAll}
                      />
                    </>,
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
                {filteredPi.length > 0 ? (
                  <>
                    {filteredPi.map((data, id1) => (
                      <tr key={id1}>
                        <td>
                          <Form.Check
                            onChange={() => handleCheckboxChange(data.id)}
                            checked={selectedItems.includes(data.id)}
                          />
                        </td>
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
                            hideDelete={"d-none"}
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
                // deleteFunction={handleDelete}
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
                ? filteredPi.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : filteredPi.length < pageSize
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

export default MergetoInvoice;
