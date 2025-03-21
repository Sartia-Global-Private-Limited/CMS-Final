import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { useParams } from "react-router-dom";
import { getAdminSingleDocumentList } from "../../services/authapi";

const DocumentCategoryView = () => {
  const { id } = useParams();
  const [viewData, setViewData] = useState([]);

  const fetchAllViewData = async () => {
    const res = await getAdminSingleDocumentList(id);
    if (res.status) {
      setViewData(res.data);
    } else {
      setViewData([]);
    }
  };

  useEffect(() => {
    fetchAllViewData();
  }, []);

  return (
    <Col md={12}>
      <CardComponent title={"Document Category View"}>
        <Row className="g-3">
          {viewData?.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
          {viewData?.map((itm, index) => {
            return (
              <Col md={4} key={index}>
                <div className="shadow d-grid gap-2 h-100 p-3">
                  <div>
                    · category <Form.Control disabled value={itm.category} />
                  </div>
                  <div>
                    · title <Form.Control disabled value={itm.title} />
                  </div>
                  <div>
                    · remark <Form.Control disabled value={itm.remark} />
                  </div>
                  <div>
                    <div className="mb-2">· image</div>
                    <Row className="g-3">
                      {itm.image
                        ? JSON.parse(itm.image)?.map((itm, index) => {
                            return (
                              <Col key={index} md={3}>
                                <img
                                  className="shadow p-1 object-fit"
                                  height={60}
                                  width={60}
                                  src={`${process.env.REACT_APP_API_URL}${itm?.storePath}`}
                                />
                              </Col>
                            );
                          })
                        : null}
                    </Row>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </CardComponent>
    </Col>
  );
};

export default DocumentCategoryView;
