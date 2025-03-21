import React from "react";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";

const ViewStockPunch = ({ edit }) => {
  return (
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
                        edit?.user_image
                          ? `${process.env.REACT_APP_API_URL}${edit?.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={30}
                        height={30}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit?.user_image
                            ? `${process.env.REACT_APP_API_URL}${edit?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />{" "}
                      {edit?.user_name}{" "}
                      {edit?.employee_id ? `- ${edit?.employee_id}` : null}
                    </ImageViewer>
                  </td>
                </tr>
                <tr>
                  <th>Complaint Id :</th>
                  <td>{edit?.complaint_unique_id}</td>
                </tr>
                <tr>
                  <th>Punch At :</th>
                  <td>{edit?.punch_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Stock Punch Details</strong>
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Item Name</th>
                  <th>Item Qty</th>
                </tr>
              </thead>
              <tbody>
                {edit?.stock_punch_detail?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{itm?.item_name?.label}</td>
                    <td>{itm?.item_qty}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewStockPunch;
