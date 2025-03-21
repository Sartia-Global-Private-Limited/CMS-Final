import React from "react";
import { Col } from "react-bootstrap";
import { BsDownload, BsLightningCharge } from "react-icons/bs";
import ImageViewer from "../../../../components/ImageViewer";

const ViewExpensesCash = ({ edit }) => {
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Expense Details</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>expense date :</th>
                  <td>{edit?.expense_date}</td>
                </tr>
                <tr>
                  <th>expense category :</th>
                  <td>{edit?.expense_category_name}</td>
                </tr>
                <tr>
                  <th>expense amount :</th>
                  <td>{edit?.expense_amount}</td>
                </tr>
                <tr>
                  <th>payment method :</th>
                  <td>{edit?.payment_method_name}</td>
                </tr>
                <tr>
                  <th>receipt verification :</th>
                  <td
                    className={`text-${
                      edit?.receipt_verification == "0"
                        ? "orange"
                        : edit?.receipt_verification == "1"
                        ? "green"
                        : "danger"
                    }`}
                  >
                    {edit?.receipt_verification == "0"
                      ? "Pending"
                      : edit?.receipt_verification == "1"
                      ? "verify"
                      : "unverify"}
                  </td>
                </tr>
                <tr>
                  <th>Status :</th>
                  <td
                    className={`text-${
                      edit?.status == "1"
                        ? "green"
                        : edit?.status == "2"
                        ? "danger"
                        : "orange"
                    }`}
                  >
                    <BsLightningCharge />{" "}
                    {edit?.status == "1"
                      ? "Approved"
                      : edit?.status == "2"
                      ? "Rejected"
                      : "Pending"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Details</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>supplier :</th>
                  <td>{edit?.supplier_name}</td>
                </tr>
                <tr>
                  <th className="align-middle">user :</th>
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
                    {edit?.user_name}{" "}
                    {edit?.employee_id ? `- ${edit?.employee_id}` : null}
                  </td>
                </tr>
                <tr>
                  <th>complaint id :</th>
                  <td>{edit?.complaint_unique_id}</td>
                </tr>
                {edit?.approved_by ? (
                  <tr>
                    <th>
                      {edit?.status == "2" ? "Rejected" : "Approved"} by :
                    </th>
                    <td>{edit?.approved_by}</td>
                  </tr>
                ) : null}
                {edit?.approved_at ? (
                  <tr>
                    <th>
                      {edit?.status == "2" ? "Rejected" : "Approved"} at :
                    </th>
                    <td>{edit?.approved_at}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded">
          <strong className="text-secondary">External Field</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th className="align-middle">receipt invoice :</th>
                  <td>
                    <a
                      href={`${process.env.REACT_APP_API_URL}${edit.receipt_invoice}`}
                      target="_blank"
                      download={true}
                      rel="noreferrer"
                    >
                      <div
                        className="shadow d-inline-block p-1 px-3 success-combo"
                        style={{ borderRadius: "3px" }}
                      >
                        <BsDownload fontSize={20} />
                      </div>
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>expense description :</th>
                  <td>{edit?.expense_description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewExpensesCash;
