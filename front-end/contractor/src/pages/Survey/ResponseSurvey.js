import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  getAllAssignSurvey,
  getAllResponseInSurvey,
} from "../../services/authapi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const ResponseSurvey = ({ checkPermission }) => {
  const [survey, setSurvey] = useState([]);
  const [surveyTable, setSurveyTable] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [surveyId, setSurveyId] = useState("");
  const navigate = useNavigate();

  const ResponseSurvey = async () => {
    const res = await getAllResponseInSurvey();
    if (res.status) {
      setSurvey(res.data);
    } else {
      setSurvey([]);
    }
  };
  const ResponseSurveyTable = async () => {
    const res = await getAllResponseInSurvey();
    if (res.status) {
      setSurveyTable(res.data?.filter((itm) => itm.survey_id == surveyId));
    } else {
      setSurvey([]);
    }
  };

  useEffect(() => {
    ResponseSurvey();
    ResponseSurveyTable();
  }, [surveyId, search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  const View = (id) => {
    navigate(`/ResponseSurvey/ViewResponseSurvey/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>All Survey Response · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"All Survey Response"} showBackButton={true}>
          <Col md={3}>
            <strong className="mb-2" style={{ fontSize: "12px" }}>
              {" "}
              select to view response
            </strong>
            <Select
              menuPortalTarget={document.body}
              name={"status"}
              options={survey?.map((data) => ({
                label: data.survey_name,
                value: data.survey_id,
              }))}
              onChange={(e) => setSurveyId(e ? e.value : null)}
              isClearable
            />
          </Col>
          {surveyTable ? (
            <div className="table-scroll p-3 my-3">
              <Table striped hover className="text-body Roles">
                <thead>
                  {surveyTable
                    ? surveyTable[0]?.response?.map((item, index) => (
                        <tr key={index}>
                          {item?.columns?.map((column, colIndex) => (
                            <td
                              // key={`${index}-${colIndex}`}
                              style={{
                                minWidth: "220px",
                              }}
                            >
                              {column?.selectType === "Heading" ? (
                                <Form.Label>{column?.value}</Form.Label>
                              ) : (
                                <Form.Control
                                  type={column?.value}
                                  disabled
                                  name={`column${colIndex}`}
                                  value={column?.value}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    : "No Data Found"}
                </thead>
              </Table>
            </div>
          ) : (
            "No Data Found"
          )}

          {/* <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {["Sr No.", "Survey Title", "Date", "Action"].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {survey.length > 0 ? null : (
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

                {survey.map((data, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>{data.survey_title}</td>
                    <td>{moment(data.created_at).format("DD-MM-YYYY")}</td>
                    <td>
                      <TooltipComponent title={"View"}>
                        <Link
                          to={`/ResponseSurvey/ViewResponseSurvey/${data?.id}`}
                        >
                          <BsEyeFill className="social-btn success-combo" />
                        </Link>
                      </TooltipComponent>
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
          </div> */}
        </CardComponent>
      </Col>
    </>
  );
};

export default ResponseSurvey;
