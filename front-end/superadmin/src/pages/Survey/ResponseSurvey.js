import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { getAllResponseInSurvey } from "../../services/authapi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import NotAllowed from "../Authentication/NotAllowed";

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
          {checkPermission?.view ? (
            <>
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
            </>
          ) : (
            <NotAllowed />
          )}
        </CardComponent>
      </Col>
    </>
  );
};

export default ResponseSurvey;
