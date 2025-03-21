import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteContactsById,
  getAllContacts,
} from "../../services/contractorApi";

const Contacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allTaxes, setAllTaxes] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchTaxesData = async () => {
    const res = await getAllContacts(search, pageSize, pageNo);
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

  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Contacts"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={"/Contacts/CreateContacts/new"}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "Name",
                    "Company Id",
                    "Company Name",
                    "Company Type",
                    "Position",
                    "Status",
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
                      alt="Loading"
                    />
                  </td>
                ) : allTaxes?.length > 0 ? (
                  <>
                    {allTaxes?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.first_name + " " + itm.last_name}</td>
                        <td>{itm?.contact_unique_id}</td>
                        <td>{itm?.company_name}</td>
                        <td>{itm?.company_type_name}</td>
                        <td>{itm?.position}</td>
                        <td
                          className={`text-${
                            itm?.status === "1" ? "green" : "danger"
                          }`}
                        >
                          {itm?.status === "1" ? "Active" : "Inactive"}
                        </td>
                        <td>
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            eyelink={`/Contacts/CreateContacts/${itm.id}?type=view`}
                            editlink={`/Contacts/CreateContacts/${itm.id}`}
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
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
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
          </div>
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

export default Contacts;
