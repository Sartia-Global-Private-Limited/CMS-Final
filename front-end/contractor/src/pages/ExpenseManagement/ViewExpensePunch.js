import React from "react";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import ViewExpenseApproveData from "./ViewExpenseApproveData";

const ViewExpensePunch = ({ edit, viewType }) => {
  return (
    <>
      {viewType == "approveData" ? (
        <ViewExpenseApproveData edit={edit} />
      ) : (
        <>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Request Field</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th className="align-middle">User Name :</th>
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
                      <th>complaint id :</th>
                      <td>{edit?.[0]?.complaint_unique_id}</td>
                    </tr>
                    <tr>
                      <th>Punch At :</th>
                      <td>{edit?.[0]?.punch_at}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Company Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {edit?.[0]?.complaintDetails && (
                      <tr>
                        <th>Company Name :</th>
                        <td>
                          {
                            edit?.[0]?.complaintDetails?.companyDetails
                              ?.company_name
                          }
                        </td>
                      </tr>
                    )}
                    {edit?.[0]?.complaintDetails?.companyDetails
                      ?.selectedRegionalOffices && (
                      <tr>
                        <th>Regional Office :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {edit?.[0]?.complaintDetails?.companyDetails?.selectedRegionalOffices?.map(
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
                    {edit?.[0]?.complaintDetails?.companyDetails
                      ?.selectedSaleAreas && (
                      <tr>
                        <th>Sales Area :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {edit?.[0]?.complaintDetails?.companyDetails?.selectedSaleAreas?.map(
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
                    {edit?.[0]?.complaintDetails?.companyDetails
                      ?.selectedDistricts && (
                      <tr>
                        <th>District :</th>
                        <td className="fw-bold border-last-child text-dark">
                          {edit?.[0]?.complaintDetails?.companyDetails?.selectedDistricts?.map(
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
              <strong className="text-secondary">Complaint Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {edit?.[0]?.complaintDetails && (
                      <tr>
                        <th>Complaint Raise By :</th>
                        <td>
                          {
                            edit?.[0]?.complaintDetails?.complaintRaiserDetails
                              ?.name
                          }
                        </td>
                      </tr>
                    )}
                    {edit?.[0]?.complaintDetails?.complaint_type && (
                      <tr>
                        <th>Complaint Type :</th>
                        <td>{edit?.[0]?.complaintDetails?.complaint_type}</td>
                      </tr>
                    )}
                    {edit?.[0]?.complaintDetails?.complaint_unique_id && (
                      <tr>
                        <th>Complaint Id :</th>
                        <td>
                          {edit?.[0]?.complaintDetails?.complaint_unique_id}
                        </td>
                      </tr>
                    )}
                    {edit?.[0]?.complaintDetails?.manager_and_supevisor
                      ?.areaManagerDetails?.id && (
                      <tr>
                        <th className="align-middle">Manager :</th>
                        <td>
                          <ImageViewer
                            src={
                              edit?.[0]?.complaintDetails?.manager_and_supevisor
                                ?.areaManagerDetails?.image
                                ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complaintDetails?.manager_and_supevisor?.areaManagerDetails?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={35}
                              height={35}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                edit?.[0]?.complaintDetails
                                  ?.manager_and_supevisor?.areaManagerDetails
                                  ?.image
                                  ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complaintDetails?.manager_and_supevisor?.areaManagerDetails?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                          </ImageViewer>
                          {
                            edit?.[0]?.complaintDetails?.manager_and_supevisor
                              ?.areaManagerDetails?.name
                          }{" "}
                          -{" "}
                          {
                            edit?.[0]?.complaintDetails?.manager_and_supevisor
                              ?.areaManagerDetails?.employee_id
                          }
                        </td>
                      </tr>
                    )}
                    {edit?.[0]?.complaintDetails?.manager_and_supevisor
                      ?.superVisorDetails?.id && (
                      <tr>
                        <th className="align-middle">SuperVisor :</th>
                        <td>
                          <ImageViewer
                            src={
                              edit?.[0]?.complaintDetails?.manager_and_supevisor
                                ?.superVisorDetails?.image
                                ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complaintDetails?.manager_and_supevisor?.superVisorDetails?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={35}
                              height={35}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                edit?.[0]?.complaintDetails
                                  ?.manager_and_supevisor?.superVisorDetails
                                  ?.image
                                  ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.complaintDetails?.manager_and_supevisor?.superVisorDetails?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                          </ImageViewer>
                          {
                            edit?.[0]?.complaintDetails?.manager_and_supevisor
                              ?.superVisorDetails?.name
                          }{" "}
                          -{" "}
                          {
                            edit?.[0]?.complaintDetails?.manager_and_supevisor
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
              <strong className="text-secondary">Expense Punch Detail</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Item</th>

                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Punch Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit.length > 0 &&
                      edit?.map((itm, idx) => (
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
                                    ? `${process.env.REACT_APP_API_URL}${itm.item_images}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                }
                              />{" "}
                              {itm?.item_name}
                            </ImageViewer>
                          </td>

                          <td>{itm.item_price}</td>
                          <td>{itm.item_qty}</td>
                          <td>{itm.total_Amount}</td>
                          <td>{itm.punch_at}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </>
      )}
    </>
  );
};

export default ViewExpensePunch;
