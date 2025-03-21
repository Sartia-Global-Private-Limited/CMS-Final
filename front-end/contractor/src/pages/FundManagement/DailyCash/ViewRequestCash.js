import React from "react";
import { Col } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";

export const ViewRequestCash = ({ edit }) => {
  return (
    <>
      <Col md={edit?.approval_by ? 6 : 12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Request Details</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>Request Status :</th>
                  <td
                    className={`text-${
                      edit?.request_status === "0"
                        ? "orange"
                        : edit?.request_status === "1"
                        ? "green"
                        : "danger"
                    }`}
                  >
                    {edit?.request_status === "0"
                      ? "Pending"
                      : edit?.request_status === "1"
                      ? "Approved"
                      : "Rejected"}
                  </td>
                </tr>
                <tr>
                  <th className="align-middle">Requested by :</th>
                  <td>
                    <ImageViewer
                      src={
                        edit.user_image
                          ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={35}
                        height={35}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit.user_image
                            ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />{" "}
                    </ImageViewer>
                    {edit?.user_name} - {edit?.user_employee_code}
                  </td>
                </tr>
                <tr>
                  <th>Request id :</th>
                  <td>{edit?.request_unique_id}</td>
                </tr>
                <tr>
                  <th>Request Amount :</th>
                  <td className="text-green">₹ {edit?.request_amount}</td>
                </tr>
                <tr>
                  <th>Request date :</th>
                  <td>{edit?.request_date}</td>
                </tr>
                <tr>
                  <th>Request purpose :</th>
                  <td>{edit?.request_purpose}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      {edit?.approval_by && (
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">
              {edit?.request_status == "2" ? "Rejected" : "Approved"} Details
            </strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th className="align-middle">
                      {edit?.request_status == "2" ? "Rejected" : "Approved"} by
                      :
                    </th>
                    <td>
                      <ImageViewer
                        src={
                          edit.approval_by_image
                            ? `${process.env.REACT_APP_API_URL}${edit.approval_by_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={35}
                          height={35}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            edit.approval_by_image
                              ? `${process.env.REACT_APP_API_URL}${edit.approval_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                      </ImageViewer>
                      {edit?.approval_by_name} -{" "}
                      {edit?.approval_by_employee_code}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {edit?.request_status == "2" ? "Rejected" : "Approved"}{" "}
                      Amount :
                    </th>
                    <td className="text-green">₹ {edit?.approval_amount}</td>
                  </tr>
                  <tr>
                    <th>
                      {edit?.request_status == "2" ? "Rejected" : "Approved"}{" "}
                      date :
                    </th>
                    <td>{edit?.approval_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      )}
    </>
  );
};
