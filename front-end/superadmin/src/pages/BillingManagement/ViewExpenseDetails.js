import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { getApiToForStockAndFundDetails } from "../../services/contractorApi";

export default function ViewExpenseDetails() {
  const params = useParams();
  const id = params?.id;
  const type = params?.type;
  const [stock, setStock] = useState("");

  const fetchExpenseRequestData = async () => {
    const res = await getApiToForStockAndFundDetails(id);
    // console.log(res, "api response");
    if (res.status) {
      setStock(type == "fund" ? res.dataFund : res.dataSite);
    } else {
      setStock();
    }
  };

  useEffect(() => {
    if (id) fetchExpenseRequestData();
  }, []);

  return (
    <Col md={12}>
      <h3 className="text-center">
        {" "}
        {type == "fund" ? "Fund " : "stock"} Details
      </h3>
      <div className="m-2 p-20 shadow rounded h-100">
        <Table className="table-sm table Roles">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Item</th>
              <th>Item Price</th>
              <th>Item Quantity</th>
              <th>Approve Qty</th>
              <th>Total</th>
              <th>Approved Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {stock[0]?.itemDetails?.length > 0 ? (
              stock[0]?.itemDetails?.map((itm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <ImageViewer
                        src={
                          itm?.item_image
                            ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                        }
                      >
                        <img
                          width={30}
                          height={30}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            itm?.item_image
                              ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                          }
                        />{" "}
                        {itm?.item_name}
                      </ImageViewer>
                    </td>

                    <td>₹{itm?.item_rate}</td>
                    <td>{itm?.item_qty}</td>
                    <td>{itm?.office_approved_qty}</td>

                    <td>₹ {itm?.total_office_approved_amount}</td>
                    <td>{itm?.approved_at ?? "--"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {stock[0]?.itemDetails?.length > 0 && (
          <div className=" d-flex justify-content-end my-2 fs-6">
            Total Office Approve Amount{" "}
            <span className="fw-bold mx-1 text-green ">
              ₹ {stock[0]?.total_office_amount}
            </span>
          </div>
        )}
      </div>
    </Col>
  );
}
