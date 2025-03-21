import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  BsEyeFill,
  BsFillPersonCheckFill,
  BsPencilSquare,
  BsPlus,
} from "react-icons/bs";
import Modaljs from "../../components/Modal";
import { toast } from "react-toastify";
import { Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import {
  PostAssignSurvey,
  getAdminAllEnergy,
  getAdminAllSurvey,
  getOutletbyEnergyCompanyId,
} from "../../services/authapi";
import CardComponent from "../../components/CardComponent";
import TooltipComponent from "../../components/TooltipComponent";
import { Link } from "react-router-dom";
import Select from "react-select";
import ReactPagination from "../../components/ReactPagination";
import { addSurveyAssignSchema } from "../../utils/formSchema";

const AllSurvey = () => {
  const [showRole, setShowRole] = useState();
  const [survey, setSurvey] = useState([]);
  const [allEnergy, setAllEnergy] = useState([]);
  const [assign, setAssign] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchAllSurveyData = async () => {
    const res = await getAdminAllSurvey(search, pageSize, pageNo);
    if (res.status) {
      setSurvey(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSurvey([]);
      setPageDetail({});
    }
  };

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  const handleAssign = (id) => {
    setAssign(id);
    setShowRole(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      survey_id: assign,
      assign_to: values.assign_to.value,
    };

    const res = await PostAssignSurvey(sData);
    if (res.status) {
      fetchAllSurveyData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowRole(false);
  };

  useEffect(() => {
    fetchAllSurveyData();
    fetchAllEnergyData();
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
        <title>All Survey · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Survey"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={"/survey/create"}
          tag={"Create"}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Survey",
                    "Date",
                    "Survey Format",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {survey?.length > 0 ? null : (
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
                {survey?.map((data, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{data?.title}</td>
                    <td>{data?.created_at}</td>
                    <td>{data?.format}</td>
                    <td>
                      <span
                        className={`text-${
                          data?.status == 1 ? "green" : "danger"
                        }`}
                      >
                        {data?.status == 1 ? "Active" : "Inactive"}{" "}
                      </span>
                    </td>
                    <td>
                      <span className="d-align gap-2">
                        <TooltipComponent title={"View"}>
                          <Link to={`/ViewSurvey/${data?.id}`} target="_blank">
                            <BsEyeFill className="social-btn success-combo" />
                          </Link>
                        </TooltipComponent>
                        <div className="vr hr-shadow" />
                        <TooltipComponent title={"Edit"}>
                          <Link to={`/AllSurvey/CreateSurvey/${data?.id}`}>
                            <BsPencilSquare className="social-btn danger-combo" />
                          </Link>
                        </TooltipComponent>
                        <div className="vr hr-shadow" />
                        <TooltipComponent title={"Assign"}>
                          <BsFillPersonCheckFill
                            onClick={() => handleAssign(data?.id)}
                            className="social-btn red-combo"
                          />
                        </TooltipComponent>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={10}>
                    <ReactPagination
                      pageSize={pageSize}
                      prevClassName={
                        pageNo === 1
                          ? "danger-combo-disable pe-none"
                          : "red-combo"
                      }
                      nextClassName={
                        pageSize == pageDetail?.total
                          ? survey.length - 1 < pageSize
                            ? "danger-combo-disable pe-none"
                            : "success-combo"
                          : survey.length < pageSize
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
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          assign_to: "",
        }}
        validationSchema={addSurveyAssignSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showRole}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowRole(false)}
            title={"Create Assign"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md="12">
                <Form.Label>Select Energy Company</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"assign_to"}
                  value={props.values.assign_to}
                  options={allEnergy.map((data) => ({
                    label: data?.name,
                    value: data?.user_id,
                  }))}
                  onChange={(selectedOption) => {
                    props.setFieldValue("assign_to", selectedOption);
                  }}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.assign_to && props.errors.assign_to
                  )}
                />
                <small className="text-danger">{props.errors.assign_to}</small>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default AllSurvey;
