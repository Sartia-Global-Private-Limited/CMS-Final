import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsEyeFill } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import moment from "moment";
import ReactPagination from "../../components/ReactPagination";
import {
  getAllAssignSurvey,
  getAllResponseSurvey,
} from "../../services/authapi";
import TooltipComponent from "../../components/TooltipComponent";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const ResponseSurvey = () => {
  const [survey, setSurvey] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  const ResponseSurvey = async () => {
    const res = await getAllAssignSurvey(search, pageSize, pageNo);
    if (res.status) {
      setSurvey(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSurvey([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    ResponseSurvey();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  const View = (id) => {
    // console.log("it called", id);
    navigate(`/ResponseSurvey/ViewResponseSurvey/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>All Survey Response · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Survey Response"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          showBackButton={true}
        >
          <Col md={3}>
            <Select
              menuPortalTarget={document.body}
              name={"status"}
              options={survey.map((data) => {
                return {
                  label: data?.title,
                  value: data?.survey_id,
                };
              })}
              onChange={(e) => View(e?.value)}
            />
          </Col>
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
