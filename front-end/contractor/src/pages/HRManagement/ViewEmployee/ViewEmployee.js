import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { viewSingleEmployee } from "../../../services/authapi";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import moment from "moment";
import { BsChatRightText, BsClock } from "react-icons/bs";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { getDateValue } from "../../../utils/helper";
import { UserDetail } from "../../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import FileViewer from "../../../components/FileViewer";

const ViewEmployee = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) fetchEmployeesData();
  }, [id]);

  const fetchEmployeesData = async () => {
    const res = await viewSingleEmployee(id);
    if (res?.status) setEdit(res.data);
  };

  const renderTimeline = () =>
    edit?.status_timeline?.length > 0 ? (
      edit?.status_timeline?.map((data) => (
        <div key={data.id} className="hstack gap-4 px-3">
          <div className="vr">
            <span
              className="rounded-circle"
              style={{ backgroundColor: `#52${data.id}FF` }}
            />
          </div>
          <div className="small">
            <div className="d-flex gap-5">
              <UserDetail
                img={data?.updated_by_image}
                name={data?.updated_by_name}
                id={data?.updated_by}
                unique_id={data?.updated_by_employee_id}
                login_id={user.id}
              />
              <span className="text-gray">
                <BsClock />{" "}
                {moment(data.updated_at).format("h:mm a | DD/MM/YYYY")}{" "}
                <span className="hr-border mx-2" />{" "}
                <span
                  className={`fw-bold text-${
                    data.updated_status === 1 ? "green" : "danger"
                  }`}
                >
                  {data.updated_status === 1 ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
            <p className="text-gray">
              <BsChatRightText /> {data.remark}
            </p>
          </div>
        </div>
      ))
    ) : (
      <NoResult width={250} />
    );

  const dataValue = [
    { name: "name", value: edit?.name },
    { name: "Mobile", value: edit?.mobile },
    { name: "address", value: edit?.address },
    { name: "Employee Id", value: edit?.employee_id },
    // { name: "department", value: edit?.department },
    { name: "email", value: edit?.email },
    { name: "employment status", value: edit?.employment_status || "" },
    { name: "joining date", value: getDateValue(edit?.joining_date) },
    { name: "aadhar Number", value: edit?.aadhar },
    { name: "pan Number", value: edit?.pan },
    { name: "role name", value: edit?.role_name },
    { name: "skills", value: edit?.skills },
    { name: "salary", value: edit?.salary },
    { name: "salary term", value: edit?.salary_term },
    { name: "Fund & Stock Limit", value: edit?.credit_limit },
  ];

  // Conditionally add team name, supervisor name, and manager name
  if (edit?.team_name) {
    dataValue.push({ name: "team name", value: edit.team_name });
  }

  if (edit?.supervisor_name) {
    dataValue.push({ name: "supervisor name", value: edit.supervisor_name });
  }

  if (edit?.manager_name) {
    dataValue.push({ name: "manager name", value: edit.manager_name });
  }

  // Now dataValue contains all fields including conditional ones

  const documentValue = [
    { name: "Profile Pic", src: edit?.image },
    { name: "aadhar card back image", src: edit?.aadhar_card_back_image },
    { name: "aadhar card front image", src: edit?.aadhar_card_front_image },
    { name: "bank documents", src: edit?.bank_documents },
    { name: "doctorate", src: edit?.doctorate },
    { name: "graduation", src: edit?.graduation },
    { name: "pan card image", src: edit?.pan_card_image },
    { name: "post graduation", src: edit?.post_graduation },
  ];

  const bankDetailsValue = [
    { name: "account number", value: edit?.account_number },
    { name: "bank name", value: edit?.bank_name },
    { name: "epf no", value: edit?.epf_no },
    { name: "esi no", value: edit?.esi_no },
    { name: "ifsc code", value: edit?.ifsc_code },
    { name: "username", value: edit?.username },
  ];

  const NoResult = ({ width = 420 }) => (
    <div className="text-center">
      <img
        className="p-3"
        alt="no-result"
        width={width}
        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
      />
    </div>
  );

  return (
    <Col md={12} data-aos="fade-up">
      <CardComponent
        className={"after-bg-light"}
        showBackButton={true}
        title={t("View Employee Details")}
      >
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Personal Info")}</strong>
              <table className="table-sm table mt-2">
                <tbody className="text-wrap">
                  {dataValue.map((val, index) => (
                    <tr key={index}>
                      <th className="align-middle">{val?.name} :</th>
                      <td className="align-middle">{val?.value || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Documents")}</strong>
              <table className="table-sm table mt-2">
                <tbody className="text-wrap">
                  {documentValue.map((val, index) => (
                    <tr key={index}>
                      <th className="align-middle">{val?.name} :</th>
                      <td className="align-middle">
                        {val?.src ? (
                          <ImageViewer
                            downloadIcon
                            href={process.env.REACT_APP_API_URL + val.src}
                            src={process.env.REACT_APP_API_URL + val.src}
                          >
                            <img
                              src={process.env.REACT_APP_API_URL + val.src}
                              className="my-btn object-fit"
                            />
                          </ImageViewer>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th className="align-middle">Attachment's :</th>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        {edit?.document?.image?.map((img) => {
                          return img ? <FileViewer file={img} /> : "-";
                        })}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Family Info")}</strong>
              <table className="table-sm table mt-2">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                  </tr>
                </thead>
                <tbody className="text-wrap">
                  {edit?.family_info?.map((val, index) => (
                    <tr key={index}>
                      <td>{val?.member_name || "-"}</td>
                      <td>{val?.member_relation || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Bank Details")}</strong>
              <table className="table-sm table mt-2">
                <tbody className="text-wrap">
                  {bankDetailsValue.map((val, index) => (
                    <tr key={index}>
                      <th className="align-middle">{val?.name} :</th>
                      <td className="align-middle">{val?.value || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Timeline History")}
              </strong>
              <SimpleBar className="mt-2">{renderTimeline()}</SimpleBar>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewEmployee;
