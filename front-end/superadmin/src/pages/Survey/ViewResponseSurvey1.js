import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { getSingleResponseSurvey } from "../../services/authapi";
import { useParams } from "react-router-dom";

const ViewResponseSurvey1 = () => {
  const [survey, setSurvey] = useState([]);
  const { id } = useParams();

  const fetchAllSurveyData = async () => {
    const res = await getSingleResponseSurvey(id);
    if (res.status) {
      setSurvey(res.data);
    } else {
      setSurvey([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllSurveyData();
    }
  }, []);

  return (
    <Col md={12}>
      <CardComponent title={"View Response Survey"}>
        {survey.length > 0 && (
          <>
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  Survey - {survey?.[0]?.survey_title}
                </strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        {survey[0]?.questions_with_answers?.map((ques) => {
                          return <th>{ques.question.question.title}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {survey.map((user) => {
                        return (
                          <tr>
                            {user.questions_with_answers.map((response) => {
                              return <td>{response.answer}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </>
        )}
        {/* <div className="d-grid gap-2">
          {survey?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {survey[0]?.question_list?.map((data, idx) => (
            <div
              className="border-orange border-5 border-start border-end rounded-4 shadow p-3"
              key={idx}
            >
              <p className="mb-2 text-secondary">
                {data?.question?.question?.title}
              </p>
              <div className="d-grid gap-2">
                {data?.question?.question?.answers.map((answer, ide) => (
                  <Form.Control
                    className={`text-${!answer && "muted"}`}
                    key={ide}
                    type="text"
                    value={answer ? answer : "No Response"}
                    disabled
                  />
                ))}
              </div>
            </div>
          ))}
        </div> */}
      </CardComponent>
    </Col>
  );
};

export default ViewResponseSurvey1;
