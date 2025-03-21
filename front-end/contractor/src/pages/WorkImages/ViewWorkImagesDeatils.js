import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleWorkImagesById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { Col, Table, Image, Row } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const ViewWorkImagesDeatils = () => {
  const [viewAllData, setViewAllData] = useState([]);
  const location = useLocation();
  const id = location.state.id;
  const { t } = useTranslation();

  const fetchAllWorkImagesData = async () => {
    const res = await getSingleWorkImagesById(id);
    if (res.status) {
      setViewAllData(res.data);
    } else {
      setViewAllData([]);
    }
  };

  useEffect(() => {
    if (id) fetchAllWorkImagesData();
  }, []);
  return (
    <Col md={12}>
      <CardComponent
        className={"after-bg-light"}
        showBackButton={true}
        title={"view work Images"}
      >
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("COMPLAINT TYPE")} :</th>
                      <td>{viewAllData?.complaint_type_name}</td>
                    </tr>
                    <tr>
                      <th>{t("Complaint id")} :</th>
                      <td>{viewAllData?.complaint_unique_id}</td>
                    </tr>
                    <tr>
                      <th>{t("Presentation title")} :</th>
                      <td>{viewAllData?.presentation_title}</td>
                    </tr>
                    <tr>
                      <th>{t("Image Upload By")} :</th>
                      <td>{viewAllData?.image_upload_by_name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
        <div className="table-scroll fs-6 px-4 mt-2">
          <div className="m-2 fw-bolder">
            {"Title"} :
            {viewAllData.main_image?.map((data) => {
              return data.row_title;
            })}{" "}
          </div>
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Work Images")}</th>
              </tr>
            </thead>
            <tbody>
              {viewAllData.main_image?.map((data) => {
                return (
                  <tr key={data}>
                    <td className="text-start">
                      <Col md={12}>
                        <div className="p-1">
                          <Row className="g-3">
                            <div className="shadow rounded p-3">
                              <strong>Before Work Image</strong> <br />
                              <strong>Title : </strong>
                              {data.before_image.title
                                ? data.before_image.title
                                : "no title"}
                              <br />
                              <strong>Description : </strong>
                              {data.before_image.description
                                ? data.before_image.description
                                : "no description"}
                            </div>
                            <ImageViewer
                              src={
                                data.before_image.file
                                  ? `${process.env.REACT_APP_API_URL}${data.before_image.file}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            >
                              <Image
                                width="100%"
                                height="400px"
                                className="my-bg p-1 rounded mb-2 text-center"
                                src={
                                  data.before_image.file
                                    ? `${process.env.REACT_APP_API_URL}${data.before_image.file}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                }
                                alt="no image"
                              />
                            </ImageViewer>
                            <div className="shadow rounded p-3">
                              <strong>Progress Work Image</strong> <br />
                              <strong>Title : </strong>
                              {data.progress_image.title
                                ? data.progress_image.title
                                : "no title"}
                              <br />
                              <strong>Description : </strong>
                              {data.progress_image.description
                                ? data.progress_image.description
                                : "no description"}
                            </div>
                            <ImageViewer
                              src={
                                data.progress_image.file
                                  ? `${process.env.REACT_APP_API_URL}${data.progress_image.file}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            >
                              <Image
                                width="100%"
                                height="400px"
                                className="my-bg p-1 rounded mb-2"
                                src={
                                  data.progress_image.file
                                    ? `${process.env.REACT_APP_API_URL}${data.progress_image.file}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                }
                                alt="no image"
                              />
                            </ImageViewer>
                            <div className="shadow rounded p-3">
                              <strong>After Work Image</strong> <br />
                              <strong>Title : </strong>
                              {data.after_image.title
                                ? data.after_image.title
                                : "no title"}
                              <br />
                              <strong>Description : </strong>
                              {data.after_image.description
                                ? data.after_image.description
                                : "no description"}
                            </div>
                            <ImageViewer
                              src={
                                data.after_image.file
                                  ? `${process.env.REACT_APP_API_URL}${data.after_image.file}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            >
                              <Image
                                width="100%"
                                height="400px"
                                className="my-bg p-1 rounded mb-2"
                                src={
                                  data.after_image.file
                                    ? `${process.env.REACT_APP_API_URL}${data.after_image.file}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                }
                                alt="no image"
                              />
                            </ImageViewer>
                          </Row>
                        </div>
                      </Col>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </CardComponent>
    </Col>
  );
};

export default ViewWorkImagesDeatils;
