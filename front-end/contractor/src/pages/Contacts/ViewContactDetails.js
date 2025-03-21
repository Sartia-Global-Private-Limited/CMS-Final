import React from "react";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const ViewContactDetails = ({ edit }) => {
  const { t } = useTranslation();
  const tableData = [
    {
      id: 1,
      heading: t("Company Details"),
      data: [
        {
          id: 1,
          title: t("company name"),
          value: edit?.company_name,
        },
        {
          id: 2,
          title: t("company type"),
          value: edit?.company_type_name,
        },
        {
          id: 3,
          title: t("contact id"),
          value: edit?.contact_unique_id,
        },
        {
          id: 4,
          title: t("company address"),
          value: edit?.company_address,
        },
      ],
    },
    {
      id: 2,
      heading: t("Details"),
      data: [
        {
          id: 1,
          title: t("first name"),
          value: edit?.first_name,
        },
        {
          id: 2,
          title: t("last name"),
          value: edit?.last_name,
        },
        {
          id: 3,
          title: t("position"),
          value: edit?.position,
        },
        {
          id: 4,
          title: t("status"),
          value: (
            <span
              className={`text-${edit.status === "1" ? "green" : "danger"}`}
            >
              {edit?.status === "1" ? "Active" : "De-Active"}
            </span>
          ),
        },
      ],
    },
  ];
  return (
    <>
      {tableData?.map((main, id) => (
        <Col md={6} key={id}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{main.heading}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  {main?.data?.map((val, idx) => (
                    <tr key={idx}>
                      <th>{val.title} :</th>
                      <td>{val.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      ))}

      {edit?.phone?.length > 0 && (
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Phone")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <thead>
                  <tr>
                    <th>{t("Number")}</th>
                    <th>{t("Primary")}</th>
                  </tr>
                </thead>
                <tbody>
                  {edit.phone.map((item, indx) => (
                    <tr key={indx}>
                      <td>{item?.number}</td>
                      <td
                        className={`text-${
                          item.primary === "1" ? "green" : "danger"
                        }`}
                      >
                        {item?.primary === "1" ? "Active" : "De-Active"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      )}
      {edit?.phone?.length > 0 && (
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Email")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <thead>
                  <tr>
                    <th>{t("email")}</th>
                    <th>{t("Primary")}</th>
                  </tr>
                </thead>
                <tbody>
                  {edit.email.map((item, indx) => (
                    <tr key={indx}>
                      <td>{item?.email}</td>
                      <td
                        className={`text-${
                          item.primary === "1" ? "green" : "danger"
                        }`}
                      >
                        {item?.primary === "1" ? "Active" : "De-Active"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      )}

      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("External Field")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("notes")} :</th>
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
