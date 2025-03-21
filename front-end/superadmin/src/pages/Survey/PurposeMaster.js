import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import CardComponent from "../../components/CardComponent";
import {
  AdminDeleteSurveyPurposeMaster,
  getAdminAllSurveyPurposeMaster,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import moment from "moment";
import ReactPagination from "../../components/ReactPagination";

const PurposeMaster = () => {
  const [itemMasterData, setItemMasterData] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchAllSurveyData = async () => {
    const res = await getAdminAllSurveyPurposeMaster(search, pageSize, pageNo);
    if (res.status) {
      setItemMasterData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setItemMasterData([]);
      setPageDetail({});
    }
  };

  const handleDelete = async () => {
    const res = await AdminDeleteSurveyPurposeMaster(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setItemMasterData((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllSurveyData();
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
        <title>Purpose Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Purpose Master"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          link={`/PurposeMaster/create-purpose-master/new`}
          icon={<BsPlus />}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new  Roles">
              <thead className="text-truncate">
                <tr>
                  {["S.No", "Name", "Date", "Action"].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemMasterData.length > 0 ? null : (
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
                {itemMasterData.map((data, index) => (
                  <tr key={index}>
                    <td>{serialNumber[index]}</td>
                    <td>{data.name}</td>
                    <td>{moment(data.created_at).format("DD-MM-YYYY")}</td>

                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(data.id);
                          setShowAlert(true);
                        }}
                        hideEye={"d-none"}
                        editlink={`/PurposeMaster/create-purpose-master/${data.id}`}
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
                pageSize == pageDetail?.total
                  ? itemMasterData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : itemMasterData.length < pageSize
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

export default PurposeMaster;
