import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import ActionButton from "../../components/ActionButton";
import Select from "react-select";
import {
  getAllOutletAndSaleAreaList,
  getAllSalesArea,
  postAssignComplaint,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { BsFillPersonCheckFill, BsSearch } from "react-icons/bs";
import { ErrorMessage, Formik } from "formik";
import Modaljs from "../../components/Modal";
import { addMessageSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import { getAllUsers } from "../../services/authapi";
import TooltipComponent from "../../components/TooltipComponent";
import StockNotAssign from "./StockNotAssign";

const Pending = ({ getValue }) => {
  const [saData, setSaData] = useState([]);
  const [selectedSa, setSelectedSa] = useState([]);
  const [allData, setAllData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [checkedData, setCheckedData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [moduleType, setModuleType] = useState("");
  const [notAssignData, setNotAssignData] = useState([]);

  const showSalesAreaApi = async () => {
    const res = await getAllSalesArea();
    if (res.status) {
      setSaData(res.data);
    } else {
      setSaData([]);
    }
  };

  const fetchSaleAreaData = async () => {
    const res = await getAllOutletAndSaleAreaList(
      search,
      pageSize,
      pageNo,
      selectedSa.value
    );
    if (res.status) {
      setAllData(res.data);
      setPageDetail(res.pageDetails);
      setIsLoading(true);
    } else {
      setAllData([]);
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
      module_id: JSON.stringify(selectedSa.value),
      module_type: "sale_area",
      assign_to: values.user_id,
      is_future_date_visible: checkedData === true ? "1" : "0",
      assign_for: "2",
    };
    // return console.log("sData", sData);
    const res = await postAssignComplaint(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      fetchSaleAreaData();
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
    showSalesAreaApi();
    if (selectedSa.value) {
      fetchSaleAreaData();
    }
    if (getValue === "Approved") {
      fetchAllUsersData();
    }
  }, [search, pageNo, pageSize, selectedSa, getValue]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <div className="table-scroll p-2">
        <div className="w-100 mb-3 d-align justify-content-end gap-3">
          {getValue === "Approved" && allData.length > 0 && (
            <span>
              <TooltipComponent title={"Assign"} align={"left"}>
                <span
                  onClick={() => setShowAssign(true)}
                  className={`social-btn-re d-align gap-2 px-3 w-auto danger-combo`}
                >
                  <BsFillPersonCheckFill />
                </span>
              </TooltipComponent>
            </span>
          )}
          <Select
            className="text-primary"
            menuPortalTarget={document.body}
            placeholder="-- Select SA --"
            value={selectedSa}
            name="sales_area_id"
            options={saData?.map((itm) => ({
              label: itm.sales_area_name,
              value: itm.id,
            }))}
            onChange={(e) => setSelectedSa(e)}
          />
          {/* {allData.length > 0 && ( */}
          <span className="position-relative">
            <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
            <Form.Control
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="me-2"
              aria-label="Search"
            />
          </span>
          {/* // )} */}
        </div>
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr className="text-center">
              {[
                "Sr No.",
                "Outlet Name",
                "Location",
                "Sales Area",
                "Action",
              ].map((thead) => (
                <th key={thead}>{thead}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={5}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt="Loading"
                />
              </td>
            ) : allData.length > 0 ? (
              <>
                {allData?.map((e, idx) => (
                  <tr>
                    <td>{serialNumber[idx]}</td>
                    <td>{e.outlet_name}</td>
                    <td>{e.location}</td>
                    <td>{e.sales_area_name}</td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyelink={`/stock-management/complaints-on-outlet/${e.outlet_id}?type=${getValue}`}
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <td colSpan={5}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="245"
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
              ? allData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allData.length < pageSize
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
          moduleType === "sale_area" && "sale area"
        } outlet already has some complaint(s) assigned as follows:`}
      >
        <StockNotAssign
          notAssignData={notAssignData}
          setNotAssignData={setNotAssignData}
          module_id={selectedSa.value}
          module_type={moduleType}
        />
      </Modaljs>
    </>
  );
};

export default Pending;
