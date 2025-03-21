import React from "react";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const ViewStockPunchApproveData = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Approved Field")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th className="align-middle">{t("User Name")} :</th>
                  <td>
                    <ImageViewer
                      src={
                        edit?.[0]?.user_image
                          ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={30}
                        height={30}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit?.[0]?.user_image
                            ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />{" "}
                      {edit?.[0]?.user_name}{" "}
                      {edit?.[0]?.employee_id
                        ? `- ${edit?.[0]?.employee_id}`
                        : null}
                    </ImageViewer>
                  </td>
                </tr>
                <tr>
                  <th>{t("complaint id")} :</th>
                  <td>{edit?.[0]?.complainsDetails?.complaint_unique_id}</td>
                </tr>
                <tr>
                  <th>{t("Punch At")} :</th>
                  <td>{edit?.[0]?.punch_at}</td>
                </tr>

                <tr>
                  <th>{t("Total Amount")} :</th>
                  <td>
                    <span className="fw-bold">
                      {" "}
                      ₹{" "}
                      {edit.length > 0 &&
                        edit?.reduce(
                          (total, itm) => total + itm.total_Amount,
                          0
                        )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Company Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.[0]?.complainsDetails && (
                  <tr>
                    <th>{t("Company Name")} :</th>
                    <td>
                      {
                        edit?.[0]?.complainsDetails?.companyDetails
                          ?.company_name
                      }
                    </td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.companyDetails
                  ?.selectedRegionalOffices && (
                  <tr>
                    <th>{t("Regional Office")} :</th>
                    <td className="fw-bolds border-last-child text-dark">
                      {edit?.[0]?.complainsDetails?.companyDetails?.selectedRegionalOffices?.map(
                        (ro, id3) => {
                          return (
                            <span key={id3} className="hr-border px-2">
                              {/* {id3 + 1}.{" "} */}
                              <span
                                style={{ padding: "0 5px" }}
                                // className="bg-light"
                              >
                                {ro.regional_office_name}
                              </span>
                            </span>
                          );
                        }
                      )}
                    </td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.companyDetails
                  ?.selectedSaleAreas && (
                  <tr>
                    <th>{t("Sales Area")} :</th>
                    <td className="fw-bolds border-last-child text-dark">
                      {edit?.[0]?.complainsDetails?.companyDetails?.selectedSaleAreas?.map(
                        (sale, id4) => {
                          return (
                            <span key={id4} className="hr-border px-2">
                              {/* {id4 + 1}.{" "} */}
                              <span
                                style={{ padding: "0 5px" }}
                                // className="bg-light"
                              >
                                {sale.sales_area_name}
                              </span>
                            </span>
                          );
                        }
                      )}
                    </td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.companyDetails
                  ?.selectedDistricts && (
                  <tr>
                    <th>{t("District")} :</th>
                    <td className="fw-bold border-last-child text-dark">
                      {edit?.[0]?.complainsDetails?.companyDetails?.selectedDistricts?.map(
                        (dict, id5) => {
                          return (
                            <span key={id5} className="hr-border ">
                              {/* {id5 + 1}.{" "} */}
                              <span
                                style={{ padding: "0 5px" }}
                                // className="bg-light"
                              >
                                {dict.district_name}
                              </span>
                            </span>
                          );
                        }
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Complaint Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.[0]?.complainsDetails && (
                  <tr>
                    <th>{t("Complaint Raise By")} :</th>
                    <td>
                      {
                        edit?.[0]?.complainsDetails?.complaintRaiserDetails
                          ?.name
                      }
                    </td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.complaint_type && (
                  <tr>
                    <th>{t("Complaint Type")} :</th>
                    <td>{edit?.[0]?.complainsDetails?.complaint_type}</td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.complaint_unique_id && (
                  <tr>
                    <th>{t("Complaint Id")} :</th>
                    <td>{edit?.[0]?.complainsDetails?.complaint_unique_id}</td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.manager_and_supevisor
                  ?.areaManagerDetails?.id && (
                  <tr>
                    <th className="align-middle">{t("Manager")} :</th>
                    <td>
                      <ImageViewer
                        src={
                          edit?.[0]?.complainsDetails?.manager_and_supevisor
                            ?.areaManagerDetails?.image
                            ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complainsDetails?.manager_and_supevisor?.areaManagerDetails?.image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={35}
                          height={35}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            edit?.[0]?.complainsDetails?.manager_and_supevisor
                              ?.areaManagerDetails?.image
                              ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complainsDetails?.manager_and_supevisor?.areaManagerDetails?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                      </ImageViewer>
                      {
                        edit?.[0]?.complainsDetails?.manager_and_supevisor
                          ?.areaManagerDetails?.name
                      }{" "}
                      -{" "}
                      {
                        edit?.[0]?.complainsDetails?.manager_and_supevisor
                          ?.areaManagerDetails?.employee_id
                      }
                    </td>
                  </tr>
                )}
                {edit?.[0]?.complainsDetails?.manager_and_supevisor
                  ?.superVisorDetails?.id && (
                  <tr>
                    <th className="align-middle">{t("SuperVisor")} :</th>
                    <td>
                      <ImageViewer
                        src={
                          edit?.[0]?.complainsDetails?.manager_and_supevisor
                            ?.superVisorDetails?.image
                            ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complainsDetails?.manager_and_supevisor?.superVisorDetails?.image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={35}
                          height={35}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            edit?.[0]?.complainsDetails?.manager_and_supevisor
                              ?.superVisorDetails?.image
                              ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complainsDetails?.manager_and_supevisor?.superVisorDetails?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                      </ImageViewer>
                      {
                        edit?.[0]?.complainsDetails?.manager_and_supevisor
                          ?.superVisorDetails?.name
                      }{" "}
                      -{" "}
                      {
                        edit?.[0]?.complainsDetails?.manager_and_supevisor
                          ?.superVisorDetails?.employee_id
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">
            {t("Approved Expense Punch Data")}
          </strong>
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("item")}</th>
                  <th>{t("Price")}</th>
                  <th>{t("Qty")}</th>
                  <th>{t("Punch Date & Time")}</th>
                  <th>{t("Approve Quantity")}</th>
                  <th>{t("Approve Date & Time")}</th>
                  <th>{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {edit.length > 0 &&
                  edit.map((itm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <ImageViewer
                            src={
                              itm?.item_images
                                ? `${process.env.REACT_APP_API_URL}${itm?.item_images}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                            }
                          >
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                itm?.item_images
                                  ? `${process.env.REACT_APP_API_URL}${itm?.item_images}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            />{" "}
                            {itm?.item_name}
                          </ImageViewer>
                        </td>

                        <td>₹{itm?.item_price}</td>
                        <td>{itm?.item_punch_qty}</td>
                        <td>{itm?.punch_at ?? "--"}</td>
                        <td>{itm?.item_approved_qty ?? "--"}</td>
                        <td>{itm?.approved_at ?? "--"}</td>
                        <td>₹{itm.total_Amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className=" d-flex justify-content-end my-2">
              {t("Total Amount")} ₹
              <span className="fw-bold">
                {" "}
                {edit.length > 0 &&
                  edit?.reduce((total, itm) => total + itm.total_Amount, 0)}
              </span>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewStockPunchApproveData;
