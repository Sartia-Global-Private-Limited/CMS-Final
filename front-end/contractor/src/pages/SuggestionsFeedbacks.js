import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../components/CardComponent";
import { getAdminAllSuggestionsFeedbacks } from "../services/authapi";
import ReactPagination from "../components/ReactPagination";

const SuggestionsFeedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchFeedbackDataData = async () => {
    const res = await getAdminAllSuggestionsFeedbacks(search, pageSize, pageNo);
    if (res.status) {
      setFeedbackData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setFeedbackData([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchFeedbackDataData();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>Feedbacks & Suggestions · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Feedback & Suggestions"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="d-grid gap-4 last-child-none">
            {feedbackData.length > 0 ? null : (
              <div className="text-center">
                <img
                  className="p-3"
                  alt="no-result"
                  width="300"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </div>
            )}
            {feedbackData?.map((data, idx) => (
              <div key={idx} className="hr-border2">
                <p className="mb-1">
                  User Name : <strong>{data?.name}</strong>
                </p>
                <p className="mb-1">
                  Type : <strong>{data?.complaint_type_name}</strong>
                </p>
                <p className="text-green mb-1 mt-3">Suggestions text</p>
                <div className="d-grid">
                  <p className="mb-4">{data?.suggestion_text}</p>
                </div>
              </div>
            ))}
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                pageSize == pageDetail?.total
                  ? feedbackData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : feedbackData.length < pageSize
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
    </>
  );
};

export default SuggestionsFeedbacks;
