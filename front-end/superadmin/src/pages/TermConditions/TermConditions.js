import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import {
  getAdminAllTermConditions,
  getAdminDeleteTermConditions,
} from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import ReactPagination from "../../components/ReactPagination";

const TermConditions = () => {
  const [termCondition, setTermCondition] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchTermConditionsData = async () => {
    const res = await getAdminAllTermConditions(search, pageSize, pageNo);
    if (res.status) {
      setTermCondition(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTermCondition([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteTermConditions(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setTermCondition((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    fetchTermConditionsData();
    setShowAlert(false);
  };

  useEffect(() => {
    fetchTermConditionsData();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>All Term Conditions · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Term Conditions"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={`/TermConditions/AddTermConditions/new`}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {["Sr No.", "Title", "Date", "Action"].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {termCondition.length > 0 ? null : (
                  <tr>
                    <td colSpan={7}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {termCondition.map((terms, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{terms.title}</td>
                    <td>{moment(terms.created_at).format("DD-MM-YYYY")}</td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(terms.id);
                          setShowAlert(true);
                        }}
                        eyelink={`/TermConditions/ViewTermConditions/${terms.id}`}
                        editlink={`/TermConditions/AddTermConditions/${terms.id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                termCondition.length < pageSize
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

export default TermConditions;
