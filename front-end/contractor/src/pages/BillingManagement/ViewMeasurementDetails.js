import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { getDetailsofComplaintsInMeasurement } from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Col, Image, Row } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import ActionButton from "../../components/ActionButton";

export default function ViewMeasurementDetails() {
  const params = useParams();
  const complaint_id = params?.complaint_id;
  const [edit, setEdit] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchExpenseRequestData = async () => {
    const res = await getDetailsofComplaintsInMeasurement(complaint_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit();
    }
  };

  useEffect(() => {
    fetchExpenseRequestData();
  }, []);

  function MyCard({ children }) {
    return (
      <Card className="bg-new h-100">
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Col md={12}>
        <CardComponent
          className={"after-bg-light"}
          showBackButton={true}
          title={"view measurements details"}
        >
          <Row className="g-3">
            <Col md={6}>
              <div className="p-20 shadow rounded h-100 ">
                <strong className="text-secondary">
                  {t("Complaint Details")}
                </strong>
                <div className="mt-2 ">
                  <table className="table-sm table">
                    <tbody className="text-wrap">
                      <tr>
                        <th>{t("complaint Unique Id")} :</th>
                        <td>
                          {" "}
                          {edit?.complaints_Details?.complaint_unique_id}
                        </td>
                      </tr>
                      <tr>
                        <th> {t("complaint type")} :</th>
                        <td> {edit?.complaints_Details?.complaint_type}</td>
                      </tr>
                      <tr>
                        <th> {t("company Name")} :</th>
                        <td>
                          {" "}
                          {
                            edit?.complaints_Details?.companyDetails
                              ?.company_name
                          }
                        </td>
                      </tr>
                      <tr>
                        <th> {t("Complaint raiser Details")} :</th>
                        <td>
                          {" "}
                          {edit?.complaints_Details?.complaintRaiserDetails
                            ?.name ?? "--"}
                        </td>
                      </tr>
                      <tr>
                        <th>{t("complaint Description")}: </th>
                        <td>
                          {edit?.complaints_Details?.complaint_description}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("Area Manager Details")}
                </strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>{t("Area Manager Name")} :</th>
                        <td> {edit?.area_manager?.user_name}</td>
                      </tr>
                      {edit?.complaints_Details?.companyDetails
                        ?.selectedDistricts.length > 0 && (
                        <tr>
                          <th> {t("District name")} :</th>
                          {edit?.complaints_Details?.companyDetails?.selectedDistricts?.map(
                            (item) => (
                              <td>
                                <span className="shadow px-1 me-2">
                                  {item.district_name}
                                </span>
                              </td>
                            )
                          )}
                        </tr>
                      )}
                      {edit?.complaints_Details?.companyDetails
                        ?.selectedRegionalOffices.length > 0 && (
                        <tr>
                          <th> {t("Regional office name")} :</th>
                          {edit?.complaints_Details?.companyDetails?.selectedRegionalOffices?.map(
                            (item) => (
                              <td>
                                <span className="shadow px-1 me-2">
                                  {item.regional_office_name}
                                </span>
                              </td>
                            )
                          )}
                        </tr>
                      )}
                      {edit?.complaints_Details?.companyDetails
                        ?.selectedSaleAreas.length > 0 && (
                        <tr>
                          <th> {t("Sales area name")} :</th>
                          {edit?.complaints_Details?.companyDetails?.selectedSaleAreas?.map(
                            (item) => (
                              <td>
                                <span className="shadow px-1 me-2">
                                  {item.sales_area_name}
                                </span>
                              </td>
                            )
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            {edit?.complaints_Details?.companyDetails?.outletDetail
              ?.outlet_unique_id && (
              <Col md={12}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">
                    {t("Outlet Details")}
                  </strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("Outlet Name")} :</th>
                          <td>
                            {" "}
                            {
                              edit?.complaints_Details?.companyDetails
                                ?.outletDetail?.outlet_name
                            }
                          </td>
                        </tr>
                        <tr>
                          <th> {t("Outlet Number")} :</th>
                          <td>
                            {
                              edit?.complaints_Details?.companyDetails
                                ?.outletDetail?.outlet_unique_id
                            }
                          </td>
                        </tr>
                        <tr>
                          <th> {t("Outlet Address")} :</th>
                          <td>
                            {
                              edit?.complaints_Details?.companyDetails
                                ?.outletDetail?.address
                            }
                          </td>
                        </tr>
                        <tr>
                          <th> {t("Outlet ccnohsd")} :</th>
                          <td>
                            {
                              edit?.complaints_Details?.companyDetails
                                ?.outletDetail?.outlet_ccnohsd
                            }
                          </td>
                        </tr>
                        <tr>
                          <th> {t("Outlet ccnoms")} :</th>
                          <td>
                            {
                              edit?.complaints_Details?.companyDetails
                                ?.outletDetail?.outlet_ccnoms
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            )}
            {edit?.attachment_details?.[0]?.filePath.length > 0 && (
              <Col md={12}>
                <h4 className="my-3 d-align gap-3">
                  {t("attachment details")}{" "}
                  {edit &&
                    edit?.attachment_details?.[0]?.filePath.length > 0 && (
                      <ActionButton
                        hideEye={"d-none"}
                        hideDelete={"d-none"}
                        editOnclick={() =>
                          navigate(`/attach-hard-copies?${complaint_id}`, {
                            state: {
                              complaint_id,
                              type: "update",
                            },
                          })
                        }
                      />
                    )}
                </h4>
                <Row className="g-3">
                  {edit?.attachment_details?.[0]?.filePath.length > 0 ? (
                    edit?.attachment_details?.[0]?.filePath.map(
                      (data, index) => {
                        return (
                          <>
                            <Col key={index} md={4}>
                              <MyCard className="">
                                <div className="mb-3"></div>
                                <div className="object-fit bg-new-re p-2">
                                  {data?.fileFormat === "jpg" ||
                                  data.fileFormat == "png" ? (
                                    <div className="position-relative">
                                      <ImageViewer
                                        src={
                                          process.env.REACT_APP_API_URL +
                                          data.file
                                        }
                                        size={"xl"}
                                        // downloadIcon={true}
                                      >
                                        <Image
                                          style={{
                                            height: "100px",
                                            width: "100%",
                                            maxWidth: "100%",
                                          }}
                                          className=" mt-1"
                                          src={
                                            process.env.REACT_APP_API_URL +
                                            data.file
                                          }
                                        />
                                      </ImageViewer>
                                    </div>
                                  ) : null}

                                  {data?.fileFormat === "pdf" ? (
                                    <a
                                      href={`${process.env.REACT_APP_API_URL}${data.file}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Card.Img
                                        width={200}
                                        height={130}
                                        className="object-fit"
                                        src={`/assets/images/pdf.jpg`}
                                      />
                                    </a>
                                  ) : null}
                                  {data?.fileFormat === "docx" ||
                                  data?.fileFormat === "doc" ? (
                                    <a
                                      href={`${process.env.REACT_APP_API_URL}${data.file}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Card.Img
                                        width={200}
                                        height={130}
                                        className="object-fit"
                                        src={`/assets/images/docs.png`}
                                      />
                                    </a>
                                  ) : null}
                                </div>

                                <p className="small mb-0 text-truncate2 line-clamp-2">
                                  {data?.title}
                                </p>
                              </MyCard>
                            </Col>
                          </>
                        );
                      }
                    )
                  ) : (
                    <Col md={12} className="text-center">
                      {t("No Files Attach")}
                    </Col>
                  )}
                </Row>
              </Col>
            )}
          </Row>
        </CardComponent>
      </Col>
    </>
  );
}
