import React from "react";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getDateValue } from "../../utils/helper";

const ViewOutlet = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Outlet Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("Outlet Unique Id")} :</th>
                  <td>{edit?.outlet_unique_id}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Name")} :</th>
                  <td>{edit?.outlet_name}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Contact Number")} :</th>
                  <td>{edit?.outlet_contact_number}</td>
                </tr>
                <tr>
                  <th>{t("Customer Code")} :</th>
                  <td>{edit?.customer_code}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Category")} :</th>
                  <td>{edit?.outlet_category}</td>
                </tr>
                <tr>
                  <th>{t("Outlet CCNOMS")} :</th>
                  <td>{edit?.outlet_ccnoms}</td>
                </tr>
                <tr>
                  <th>{t("Outlet CCNOHSD")} :</th>
                  <td>{edit?.outlet_ccnohsd}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Contact Person Name")} :</th>
                  <td>{edit?.outlet_contact_person_name}</td>
                </tr>
                <tr>
                  <th>{t("Outlet RESV")} :</th>
                  <td>{edit?.outlet_resv}</td>
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
                <tr>
                  <th>{t("Energy Company Name")} :</th>
                  <td>{edit?.energy_company_name}</td>
                </tr>
                <tr>
                  <th>{t("Zone Name")} :</th>
                  <td>{edit?.zone_name}</td>
                </tr>
                <tr>
                  <th>{t("Regional Office Name")} :</th>
                  <td>{edit?.regional_office_name}</td>
                </tr>
                <tr>
                  <th> {t("Sales Area Name")} :</th>
                  <td>{edit?.sales_area_name}</td>
                </tr>
                <tr>
                  <th>{t("District Name")} :</th>
                  <td>{edit?.district_name}</td>
                </tr>
                <tr>
                  <th>{t("Primary Number")} :</th>
                  <td>{edit?.primary_number}</td>
                </tr>
                <tr>
                  <th>{t("Secondary Number")} :</th>
                  <td>{edit?.secondary_number}</td>
                </tr>
                <tr>
                  <th>{t("Primary Email")} :</th>
                  <td>{edit?.primary_email}</td>
                </tr>
                <tr>
                  <th>{t("Secondary Email")} :</th>
                  <td>{edit?.secondary_email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Other Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("Location")} :</th>
                  <td>{edit?.location}</td>
                </tr>
                <tr>
                  <th>{t("Address")} :</th>
                  <td>{edit?.address}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Longitude")} :</th>
                  <td>{edit?.outlet_longitude}</td>
                </tr>
                <tr>
                  <th>{t("Outlet Lattitude")} :</th>
                  <td>{edit?.outlet_lattitude}</td>
                </tr>
                <tr>
                  <th>{t("Created At")} :</th>
                  <td>{getDateValue(edit?.created_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewOutlet;
