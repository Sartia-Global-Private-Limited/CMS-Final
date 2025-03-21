import React from "react";
import { Badge, Col, Table } from "react-bootstrap";
import ImageViewer from "../ImageViewer";
import { useTranslation } from "react-i18next";

const ViewSupplier = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.supplier_name && (
                  <tr>
                    <th>{t("Supplier Name")} :</th>
                    <td>{edit?.supplier_name}</td>
                  </tr>
                )}
                {edit?.owner_name && (
                  <tr>
                    <th>{t("Owner Name")} :</th>
                    <td>{edit?.owner_name}</td>
                  </tr>
                )}
                {edit?.cashier_name && (
                  <tr>
                    <th>{t("cashier name")} :</th>
                    <td>{edit?.cashier_name}</td>
                  </tr>
                )}
                {edit?.supplier_code && (
                  <tr>
                    <th>{t("supplier code")} :</th>
                    <td>{edit?.supplier_code}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Bank Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.bank_name && (
                  <tr>
                    <th>{t("bank Name")} :</th>
                    <td>{edit?.bank_name}</td>
                  </tr>
                )}
                {edit?.account_holder_name && (
                  <tr>
                    <th>{t("account holder name")} :</th>
                    <td>{edit?.account_holder_name}</td>
                  </tr>
                )}
                {edit?.account_number && (
                  <tr>
                    <th>{t("account Number")} :</th>
                    <td>{edit?.account_number}</td>
                  </tr>
                )}
                {edit?.branch_name && (
                  <tr>
                    <th>{t("branch name")} :</th>
                    <td>{edit?.branch_name}</td>
                  </tr>
                )}
                {edit?.ifsc_code && (
                  <tr>
                    <th>{t("ifsc code")} :</th>
                    <td>{edit?.ifsc_code}</td>
                  </tr>
                )}
                {edit?.upi_id && (
                  <tr>
                    <th>{t("upi id")}:</th>
                    <td>{edit?.upi_id}</td>
                  </tr>
                )}

                {edit?.upi_id && (
                  <tr>
                    <th>{t("qr image")} :</th>
                    <td>
                      <ImageViewer
                        src={
                          edit?.upi_image
                            ? `${process.env.REACT_APP_API_URL}${edit?.upi_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                        }
                      >
                        <img
                          width={50}
                          height={50}
                          className="my-bg object-fit p-1 "
                          src={
                            edit?.upi_image
                              ? `${process.env.REACT_APP_API_URL}${edit?.upi_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                          }
                        />{" "}
                      </ImageViewer>
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
          <strong className="text-secondary">{t("Supplier Addresses")}</strong>
          <div className="overflow-auto mt-2">
            <Table className="Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Shop Office No")}</th>
                  <th>{t("Street Name")}</th>
                  <th>{t("City")}</th>
                  <th>{t("State")}</th>
                  <th>{t("Pin Code")}</th>
                  <th>{t("Landmark")}</th>
                  <th>{t("GST Number")}</th>
                </tr>
              </thead>
              <tbody>
                {edit?.supplier_addresses?.map((address, id3) => (
                  <tr key={id3}>
                    <td>
                      {id3 + 1}
                      {address.is_default === "1" && (
                        <Badge bg="secondary">{t("Default")}</Badge>
                      )}
                    </td>
                    <td>{address.shop_office_number}</td>
                    <td>{address.street_name}</td>
                    <td>{address.city_name}</td>
                    <td>{address.state_name}</td>
                    <td>{address.pin_code}</td>
                    <td>{address.landmark}</td>
                    <td>{address.gst_number}</td>
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

export default ViewSupplier;
