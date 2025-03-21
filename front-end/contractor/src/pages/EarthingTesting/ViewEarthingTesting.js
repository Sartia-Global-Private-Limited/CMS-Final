import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleEarthingTestingById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { UserDetails } from "../../components/ItemDetail";
import StatusChip from "../../components/StatusChip";

const ViewEarthingTesting = () => {
  const [earthingTestingData, setEarthingTestingData] = useState([]);
  const location = useLocation();
  const id = location.state.id;
  const { t } = useTranslation();

  const fetchViewEarthingTestingById = async () => {
    const res = await getSingleEarthingTestingById(id);
    if (res.status) {
      setEarthingTestingData(res.data);
    } else {
      setEarthingTestingData([]);
    }
  };

  useEffect(() => {
    if (id) fetchViewEarthingTestingById();
  }, []);
  return (
    <Col md={12}>
      <CardComponent
        showBackButton={true}
        title={"view Earthing Testing"}
        className={"after-bg-light"}
      >
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Complaint Type")} :</th>
                      <td>{earthingTestingData?.complaint_type_name}</td>
                    </tr>
                    <tr>
                      <th>{t("Complaint id")} :</th>
                      <td>{earthingTestingData?.complaint_unique_id}</td>
                    </tr>
                    <tr>
                      <th>{t("created by")} :</th>
                      <td>{earthingTestingData?.created_by}</td>
                    </tr>
                    <tr>
                      <th>{t("status")} :</th>
                      <td>
                        <StatusChip
                          status={
                            earthingTestingData?.status == "1"
                              ? "Requested"
                              : earthingTestingData?.status == "2"
                              ? "Approved"
                              : earthingTestingData?.status == "3"
                              ? "Rejected"
                              : earthingTestingData?.status == "4"
                              ? "Allocate"
                              : earthingTestingData?.status == "5"
                              ? "Report"
                              : ""
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="align-middle">{t("Outlet Data")} :</th>
                      <td className="align-middle">
                        {earthingTestingData?.outletData?.map((data) => (
                          <span className="shadow px-1 me-2">
                            {data.outlet_name}
                          </span>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th className="align-middle">{t("User Data")} :</th>
                      <td className="align-middle">
                        {earthingTestingData?.user_data?.map((user, index) => (
                          <Fragment key={index}>
                            <UserDetails
                              img={user?.image}
                              name={user?.name}
                              id={user?.user_id}
                              unique_id={user?.employee_id}
                            />
                          </Fragment>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("Expiry Date")} :</th>
                      <td>{earthingTestingData?.expire_date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
      </CardComponent>
    </Col>
  );
};

export default ViewEarthingTesting;
