import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import {
  getApprovedComplaintsDetailsById,
  postChangeStatusComplaints,
} from "../../services/contractorApi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  ItemDetail,
  UserDetail,
  UserDetails,
} from "../../components/ItemDetail";

export const ViewUpdateStatus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { id } = useParams();

  const fetchAllApprovedComplaints = async () => {
    const res = await getApprovedComplaintsDetailsById(id);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchAllApprovedComplaints();
  }, []);

  const handleHoldResolveStatus = async () => {
    let resolveParams = {
      complaint_id: data.id,
      status: 5,
    };
    let holdParams = {
      complaint_id: data.id,
      status: 6,
      hold_users: selectedUsers,
    };
    const status = selectedUsers.length > 0 ? holdParams : resolveParams;
    const res = await postChangeStatusComplaints(status);
    if (res.status) {
      navigate(-1);
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  };

  const handleChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedUsers(selectedIds);
  };

  return (
    <>
      <CardComponent title={`Update Status`}>
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Company Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {data?.energy_company_name && (
                      <tr>
                        <th>{t("Company Name")} :</th>
                        <td>{data?.energy_company_name}</td>
                      </tr>
                    )}
                    {data?.regionalOffices && (
                      <tr>
                        <th>{t("Regional Office Name")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {data?.regionalOffices?.map((ro, id3) => {
                            return (
                              <span key={id3} className="hr-border">
                                {ro.regional_office_name}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    )}
                    {data?.saleAreas && (
                      <tr>
                        <th>{t("Sales Area Name")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {data?.saleAreas?.map((sale, id4) => {
                            return (
                              <span key={id4} className="hr-border">
                                {sale.sales_area_name}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    )}
                    {data?.districts && (
                      <tr>
                        <th>{t("District Name")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {data?.districts?.map((dict, id5) => {
                            return (
                              <span key={id5} className="hr-border">
                                {dict.district_name}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    )}
                    {data?.outlets && (
                      <>
                        <tr>
                          <th>{t("Outlet Name")} :</th>
                          <td className="fw-bolds border-last-child text-dark">
                            {data?.outlets?.map((on, id2) => {
                              return (
                                <span key={id2} className="hr-border">
                                  {on.outlet_name}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Outlet Address")} :</th>
                          <td className="fw-bolds border-last-child text-dark">
                            {data?.outlets?.map((on, id2) => {
                              return (
                                <span key={id2} className="hr-border">
                                  {on.address}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Outlet ccnohsd")} :</th>
                          <td className="fw-bolds border-last-child text-dark">
                            {data?.outlets?.map((on, id2) => {
                              return (
                                <span key={id2} className="hr-border">
                                  {on.outlet_ccnohsd}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("Outlet ccnoms")} :</th>
                          <td className="fw-bolds border-last-child text-dark">
                            {data?.outlets?.map((on, id2) => {
                              return (
                                <span key={id2} className="hr-border">
                                  {on.outlet_ccnohsd}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                      </>
                    )}
                    {data?.order_by_details && (
                      <tr>
                        <th>{t("Order By")} :</th>
                        <td>{data?.order_by_details}</td>
                      </tr>
                    )}
                    {data?.order_via_details && (
                      <tr>
                        <th>{t("Order Via")} :</th>
                        <td>{data?.order_via_details}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Complaint Details")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {data?.complaint_raise_by && (
                      <tr>
                        <th>{t("Complaint Raise By")} :</th>
                        <td>{data?.complaint_raise_by}</td>
                      </tr>
                    )}
                    {data?.complaint_type && (
                      <tr>
                        <th>{t("Complaint Type")} :</th>
                        <td>{data?.complaint_type}</td>
                      </tr>
                    )}
                    {data?.complaint_unique_id && (
                      <tr>
                        <th>{t("Complaint Id")} :</th>
                        <td>{data?.complaint_unique_id}</td>
                      </tr>
                    )}
                    {data?.manager_and_supevisor?.areaManagerDetails?.id && (
                      <tr>
                        <th className="align-middle">{t("Area manager")} :</th>
                        <td>
                          <UserDetail
                            img={
                              data?.manager_and_supevisor?.areaManagerDetails
                                ?.image
                            }
                            name={
                              data?.manager_and_supevisor?.areaManagerDetails
                                ?.name
                            }
                            unique_id={
                              data?.manager_and_supevisor?.areaManagerDetails
                                ?.employee_id
                            }
                          />
                        </td>
                      </tr>
                    )}

                    {data?.manager_and_supevisor?.superVisorDetails?.id && (
                      <tr>
                        <th className="align-middle">{t("Supervisor")} :</th>
                        <td>
                          <UserDetail
                            img={
                              data?.manager_and_supevisor?.superVisorDetails
                                ?.image
                            }
                            name={
                              data?.manager_and_supevisor?.superVisorDetails
                                ?.name
                            }
                            unique_id={
                              data?.manager_and_supevisor?.superVisorDetails
                                ?.employee_id
                            }
                          />
                        </td>
                      </tr>
                    )}

                    {data?.manager_and_supevisor?.endUserDetails && (
                      <tr>
                        <th className="align-middle">{t("End User")} :</th>
                        <td>
                          {data?.manager_and_supevisor?.endUserDetails?.map(
                            (itm, idx) => {
                              return (
                                <Fragment key={idx}>
                                  <UserDetails
                                    img={itm?.image}
                                    name={itm?.name}
                                    id={itm?.id}
                                    unique_id={itm?.employee_id}
                                  />
                                </Fragment>
                              );
                            }
                          )}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <th>{t("Status")} :</th>
                      <td>
                        <td className="align-middle">
                          <Select
                            isMulti
                            closeMenuOnSelect={false}
                            className="text-start"
                            menuPortalTarget={document.body}
                            placeholder="--Update users --"
                            options={
                              data?.manager_and_supevisor?.endUserDetails
                                ? data.manager_and_supevisor.endUserDetails
                                    .filter((itm) => itm.free_end_users === 1)
                                    .map((itm) => ({
                                      label: itm.name,
                                      value: itm.id,
                                    }))
                                : []
                            }
                            onChange={handleChange}
                            isClearable
                          />
                        </td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <div className="text-center">
            {selectedUsers.length > 0 ? (
              <button
                type={`button`}
                onClick={() => {
                  setOpenModal(true);
                }}
                className="shadow  border-0 danger-combo cursor-pointer px-4 py-1"
              >
                Hold
              </button>
            ) : (
              <button
                type="button"
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1 mx-3"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Resolve
              </button>
            )}
          </div>
        </Row>

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleHoldResolveStatus}
          hide={() => setOpenModal(false)}
          show={openModal}
          title={"Confirm UPDATE"}
          description={`Are you sure you want to ${
            selectedUsers.length > 0 ? "Hold" : "Resolve"
          } the complaint?`}
        />
      </CardComponent>
    </>
  );
};
