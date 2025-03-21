import React from "react";
import { Col } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";

const ViewRequestItems = ({ edit }) => {
  return (
    <>
      <Col md={edit?.approved_at ? 6 : 12}>
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
                  <th className="align-middle">Item :</th>
                  <td>
                    <ImageViewer
                      src={
                        edit.item_image
                          ? `${process.env.REACT_APP_API_URL}${edit.item_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={35}
                        height={35}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit.item_image
                            ? `${process.env.REACT_APP_API_URL}${edit.item_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />{" "}
                    </ImageViewer>
                    {edit?.item_name}
                  </td>
                </tr>
                {edit?.checkUserRoleTypeForRequestByDetails ? (
                  <tr>
                    <th className="align-middle">Requested by :</th>
                    <td>
                      <ImageViewer
                        src={
                          edit.requested_by_image
                            ? `${process.env.REACT_APP_API_URL}${edit.requested_by_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={35}
                          height={35}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            edit.requested_by_image
                              ? `${process.env.REACT_APP_API_URL}${edit.requested_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                      </ImageViewer>
                      {edit?.requested_by}{" "}
                      {edit?.requested_by_employee_id
                        ? `- ${edit?.requested_by_employee_id}`
                        : edit?.requested_by_employee_id}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <th>Request date :</th>
                  <td>{edit?.date}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      {edit?.approved_at && (
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
                          edit.approved_by_image
                            ? `${process.env.REACT_APP_API_URL}${edit.approved_by_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={35}
                          height={35}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            edit.approved_by_image
                              ? `${process.env.REACT_APP_API_URL}${edit.approved_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                      </ImageViewer>
                      {edit?.approved_by_name}{" "}
                      {edit?.approved_by_employee_id
                        ? `- ${edit?.approved_by_employee_id}`
                        : edit?.approved_by_employee_id}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      {edit?.request_status == "2" ? "Rejected" : "Approved"} at
                      :
                    </th>
                    <td>{edit?.approved_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      )}
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Notes</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  {/* <th>notes </th> */}
                  <td>{edit?.notes}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewRequestItems;
