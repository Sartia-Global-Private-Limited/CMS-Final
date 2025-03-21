import React, { useEffect, useState } from "react";
import { Col, Table, Form } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import {
  approveRejectAssetsManagementById,
  deleteAssetsById,
  getAllAssets,
  postAssignedAssetToUser,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import Modaljs from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addUserIdSchema } from "../../utils/formSchema";
import { getAllUsers } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";

const IdleAssets = () => {
  const [requestData, setRequestData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [assestsId, setAssestsId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [Allocate, setAllocate] = useState(false);
  const [assignUserData, setAssignUserData] = useState([]);

  const fetchAllAssetsData = async () => {
    const status = 2;
    const isDropdown = false;
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
    });
    if (res.status) {
      setRequestData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteAssetsById(assestsId);
    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) => prev.filter((dlt) => dlt.id !== assestsId));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    assestsId("");
    setShowDelete(false);
  };
  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectAssetsManagementById(status, assestsId);

    if (res.status) {
      toast.success(res.message);
      setRequestData((prev) => prev.filter((itm) => itm.id !== assestsId));
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }

    setAssestsId("");

    setShowReject(false);
  };

  const fetchAssignUserData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAssignUserData(res.data);
    } else {
      setAssignUserData([]);
    }
  };

  useEffect(() => {
    fetchAllAssetsData();
    fetchAssignUserData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: values.user_id.value,
      asset_id: Allocate.id,
      notes: values.notes,
    };
    // return console.log("sData", sData);
    const res = await postAssignedAssetToUser(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setAllocate(false);
    setSubmitting(false);
  };

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {label}
      </span>
    </div>
  );

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Assets · CMS Electricals</title>
        </Helmet>
        <CardComponent
          title={"All Idle Assets"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="table-scroll mb-3">
            <Table className=" Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Asset Name",
                    "Asset Model No",
                    "uin No",
                    "Price",
                    "Purchase Date",
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
                ) : requestData.length > 0 ? (
                  <>
                    {requestData?.map((data, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{data.asset_name}</td>
                        <td>{data.asset_model_number}</td>
                        <td>{data.asset_uin_number}</td>
                        <td>{data.asset_price}</td>
                        <td>{data.asset_purchase_date}</td>
                        <td
                          className={`text-${
                            data.asset_assign_status === 1 ? "green" : "danger"
                          }`}
                        >
                          {data.asset_assign_status === 1
                            ? "Active"
                            : "DeActive"}
                        </td>
                        <td>
                          <ActionButton
                            editlink={`/AllAssets/CreateAssets/${data?.id}`}
                            eyelink={`/AllAssets/CreateAssets/${data?.id}?type=view`}
                            deleteOnclick={() => {
                              setAssestsId(data.id);
                              setShowDelete(true);
                            }}
                            rejectOnclick={() => {
                              setAssestsId(data.id);
                              setShowReject(true);
                            }}
                            assignOnclick={() => {
                              setAllocate(data, true);
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
            </Table>
          </div>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? requestData.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : requestData.length < pageSize
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

        <Formik
          enableReinitialize={true}
          initialValues={{
            user_id: "",
            notes: "",
          }}
          validationSchema={addUserIdSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Modaljs
              open={Allocate}
              size={"sm"}
              closebtn={"Cancel"}
              Savebtn={"Assign"}
              close={() => setAllocate(false)}
              formikProps={props}
              title={"Assign to User"}
            >
              <Form.Group>
                <Form.Label>
                  Select User <span className="text-danger fw-bold">*</span>
                </Form.Label>
                <Select
                  menuPosition="fixed"
                  name="user_id"
                  value={props.values.user_id}
                  onChange={(val) => props.setFieldValue("user_id", val)}
                  options={assignUserData?.map((user) => ({
                    value: user.id,
                    label: user.name,
                    image: user.image
                      ? `${process.env.REACT_APP_API_URL}${user.image}`
                      : null,
                  }))}
                  components={{ Option: UserOption }}
                  isClearable
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Type Notes</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"notes"}
                  value={props.values.notes}
                  onChange={props.handleChange}
                />
              </Form.Group>
            </Modaljs>
          )}
        </Formik>
      </Col>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowDelete}
        show={showDelete}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </>
  );
};

export default IdleAssets;
