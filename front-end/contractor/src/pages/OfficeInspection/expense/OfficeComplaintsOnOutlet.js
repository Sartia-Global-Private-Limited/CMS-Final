import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Breadcrumb, Col, Form, Row, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import {
  getAllComplaintsOnOutlet,
  postAssignComplaint,
} from "../../../services/contractorApi";
import ReactPagination from "../../../components/ReactPagination";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addMessageSchema } from "../../../utils/formSchema";
import Modaljs from "../../../components/Modal";
import { getAllUsers } from "../../../services/authapi";
import TooltipComponent from "../../../components/TooltipComponent";
import OfficeExpenseStockNotAssign from "./OfficeExpenseStockNotAssign";

const OfficeComplaintsOnOutlet = () => {
  const [outletDetails, setOutletDetails] = useState({});
  const [complaintData, setComplaintData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [checkedData, setCheckedData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notAssignData, setNotAssignData] = useState([]);
  const [moduleType, setModuleType] = useState("");
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const fetchComplaintsOnOutletData = async () => {
    const res = await getAllComplaintsOnOutlet(search, pageSize, pageNo, id);
    if (res.status) {
      setOutletDetails(res.outletDetails);
      setComplaintData(res.complaintData);
      setPageDetail(res.pageDetails);
    } else {
      setOutletDetails(res.outletDetails);
      setComplaintData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      module_id: JSON.stringify(outletDetails.outlet_id),
      module_type: "outlet",
      assign_to: values.user_id,
      is_future_date_visible: checkedData === true ? "1" : "0",
      assign_for: "1",
    };
    // return console.log("sData", sData);
    const res = await postAssignComplaint(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      fetchComplaintsOnOutletData();
    } else {
      toast.error(res.message);
    }
    setShowModal(res.modal);
    setModuleType(res.type);
    setNotAssignData(res.data);
    setShowAssign(false);
    setSubmitting(false);
  };

  const UserOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="cursor-pointer">
      <img
        className="avatar ms-2 me-3"
        src={
          data.image ||
          `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        alt={data.name}
      />
      {label}
    </div>
  );

  useEffect(() => {
    fetchComplaintsOnOutletData();
    if (type === "Approved") {
      fetchAllUsersData();
    }
  }, [search, pageNo, pageSize, type]);

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
        <title>
          {`Expense Complaints On - ${outletDetails?.outlet_name} · CMS Electricals`}
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`Expense Complaints On - ${outletDetails?.outlet_name}`}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          custom={
            type === "Approved" &&
            complaintData.length > 0 && (
              <TooltipComponent title={"Assign"} align={"left"}>
                <span
                  onClick={() => setShowAssign(true)}
                  className={`social-btn-re d-align gap-2 px-3 w-auto danger-combo`}
                >
                  <BsFillPersonCheckFill />
                </span>
              </TooltipComponent>
            )
          }
        >
          <div className="table-scroll p-2">
            <Breadcrumb>
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{
                  to: "/office-expense",
                  className: "text-secondary text-decoration-none",
                }}
              >
                office expense
              </Breadcrumb.Item>
              <Breadcrumb.Item active>complaints on outlet</Breadcrumb.Item>
            </Breadcrumb>
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  {[
                    "Sr No.",
                    "complaint unique id",
                    "complaint type name",
                    "Description",
                    "complaints approval by",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={6}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : complaintData.length > 0 ? (
                  <>
                    {complaintData?.map((e, idx) => (
                      <tr>
                        <td>{serialNumber[idx]}</td>
                        <td>{e.complaint_unique_id}</td>
                        <td>{e.complaint_type_name}</td>
                        <td>{e.description}</td>
                        <td>{e.complaints_approval_by_name}</td>
                        <td>
                          <ActionButton
                            hideDelete={"d-none"}
                            hideEdit={"d-none"}
                            eyelink={`/office-expense/office-expense-pending-complaints/${e.complaint_unique_id}?prevId=${id}&&type=${type}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={6}>
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
                  ? complaintData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : complaintData.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
        }}
        validationSchema={addMessageSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showAssign}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowAssign(false)}
            title={"Assign Complaint"}
          >
            <Row className="g-2">
              <Col md={12}>
                <Form.Label>Select User</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="user_id"
                  options={allUserData?.map((user) => ({
                    label: user.name,
                    value: user.id,
                    image: user.image
                      ? `${process.env.REACT_APP_API_URL}${user.image}`
                      : null,
                  }))}
                  onChange={(selectedOption) =>
                    props.setFieldValue("user_id", selectedOption.value)
                  }
                  components={{ Option: UserOption }}
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="check"
                  name="is_future_date_visible"
                  onChange={(e) => setCheckedData(e.target.checked)}
                  label="See all future data"
                />
              </Col>
            </Row>
          </Modaljs>
        )}
      </Formik>

      <Modaljs
        open={showModal}
        size={"lg"}
        closebtn={"Cancel"}
        Savebtn={"Assign"}
        close={() => setShowModal(false)}
        hideFooter
        title={`This ${
          moduleType === "sale_area" ? "sale area" : ""
        } outlet already has some complaint(s) assigned as follows:`}
      >
        <OfficeExpenseStockNotAssign
          notAssignData={notAssignData}
          setNotAssignData={setNotAssignData}
          module_id={outletDetails?.outlet_id}
          module_type={moduleType}
        />
      </Modaljs>
    </>
  );
};

export default OfficeComplaintsOnOutlet;
