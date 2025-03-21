import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { toast } from "react-toastify";
import { Formik } from "formik";
import {
  postStockPunchApproveBySite,
  getPartialSiteExpenseRequestData,
  getPendingSiteExpenseRequestData,
  getAllManagersUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  getAllEndUserBySupervisorId,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ImageViewer from "../../../components/ImageViewer";
import Feedback from "../../OfficeInspectionNew/Feedback";
import { RiArrowDownSFill } from "react-icons/ri";
import { RiArrowUpSFill } from "react-icons/ri";

const ApproveSiteInspection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outletId = location?.state?.outletId;
  const month = location?.state?.month;
  const type = location?.state?.type;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);

  const fetchTransferDetails = async () => {
    const res =
      type == "pending"
        ? await getPendingSiteExpenseRequestData(outletId, month.split("-")[1])
        : await getPartialSiteExpenseRequestData(outletId, month.split("-")[1]);

    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const feedback = values.users
      .map((user) => {
        if (user.user_select)
          return {
            ...user.feedback_details,
            ...user.feedback,
            complaint_unique_id: user.itemDetails[0].complaint_unique_id,
            complaint_id: user.itemDetails[0].complaint_id,
            approve_type: "1",
          };
      })
      .filter((item) => item);

    const approve_site_inspections = [];
    const site_not_approved = [];

    for (let i = 0; i < values.users.length; i++) {
      const data = values.users[i];
      for (let j = 0; j < data.itemDetails.length; j++) {
        const d = data.itemDetails[j];
        if (data.user_select) {
          approve_site_inspections.push({
            office_approved_status: 2,
            id: d.id,
            stock_id: d.stock_id,
            site_approved_qty: d.site_approved_qty,
          });
        } else {
          site_not_approved.push({
            id: d.id,
            stock_id: d.stock_id,
          });
        }
      }
    }

    const sData = {
      approve_site_inspections,
      site_not_approved,
      feedback,
    };

    // return console.log("sData", sData);
    const res = await postStockPunchApproveBySite(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const handleManagerChange = async (value) => {
    if (!value) return setAllSupervisor([]);
    fetchFreeSupervisorData(value);
  };

  //All Supervisors By Manager Id
  const fetchFreeSupervisorData = async (id) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      setAllSupervisor(res.data);
    } else {
      setAllSupervisor([]);
      toast.error(res.message);
    }
  };

  const handleSupervisorChange = async (value, setvalue) => {
    if (!value) return setAllEndUser([]);
    fetchFreeUsersData(value);
  };

  //All End Users By Supervisor Id
  const fetchFreeUsersData = async (id) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      setAllEndUser(res.data);
    } else {
      setAllEndUser([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchTransferDetails();
    fetchManagers();
    fetchTransferDetails();
  }, []);

  return (
    <>
      <Helmet>
        <title>Approve Office Expense · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`Approve Office Expense`} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              users: edit || "",
              Manager: "",
              supervisor: "",
              end_user: "",
            }}
            // validationSchema={addStockPunchSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <>
                      {props.values.users.length > 0 &&
                        props.values.users.map((data, index) => {
                          return (
                            <div>
                              <div className="d-flex">
                                <Col md={12} className="">
                                  <div className="p-20 shadow rounded">
                                    <strong className="text-secondary d-flex">
                                      <Form.Check
                                        type={"checkbox"}
                                        className="fs-5"
                                      >
                                        {" "}
                                        <Form.Check.Input
                                          type={"checkbox"}
                                          style={{
                                            backgroundColor: "red",
                                            color: "blue",
                                          }}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `users[${index}].user_select`,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </Form.Check>{" "}
                                      <span className="my-2">
                                        {" "}
                                        User Details
                                      </span>
                                    </strong>
                                    <ul className="list-unstyled m-3">
                                      <li>
                                        Employee Name{" "}
                                        <span className="fw-bold">
                                          :{data?.userDetails?.[0]?.username}
                                        </span>
                                      </li>
                                      <li>
                                        Employee Id{" "}
                                        <span className="fw-bold">
                                          :{" "}
                                          {data?.userDetails?.[0]?.employee_id}
                                        </span>{" "}
                                      </li>
                                      <li>
                                        complaint Unique Id{" "}
                                        <span className="fw-bold">
                                          :{" "}
                                          {
                                            data.itemDetails?.[0]
                                              .complaint_unique_id
                                          }
                                        </span>
                                      </li>
                                    </ul>

                                    <div className="table-scroll  my-3">
                                      <Table
                                        striped
                                        hover
                                        className="text-body Roles"
                                      >
                                        <thead>
                                          <tr>
                                            <th>S.No.</th>
                                            <th>Item Name</th>
                                            <th>Item Price</th>
                                            <th>
                                              Approve Quantity <br />
                                              (office){" "}
                                            </th>
                                            <th>Approve Quantity</th>
                                            <th>total</th>
                                            <th>Approved Date</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {data.itemDetails.map((itm, idx) => {
                                            return (
                                              <>
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
                                                  <td>
                                                    {itm?.office_approved_qty}
                                                  </td>

                                                  <td width={"100px"}>
                                                    <Form.Control
                                                      name={`users[${index}].itemDetails[${idx}].site_approved_qty`}
                                                      placeholder="0"
                                                      disabled={
                                                        !props?.values?.users?.[
                                                          index
                                                        ]?.user_select
                                                      }
                                                      onChange={(e) => {
                                                        const maxValue =
                                                          itm.office_approved_qty;
                                                        if (
                                                          +e.target.value <=
                                                          +maxValue
                                                        ) {
                                                          props.handleChange(e);
                                                          props.setFieldValue(
                                                            `users[${index}].itemDetails[${idx}].approved_amount`,
                                                            +e.target.value *
                                                              +itm.item_rate
                                                          );
                                                        } else {
                                                          e.target.value =
                                                            +maxValue;
                                                          props.handleChange(e);
                                                          props.setFieldValue(
                                                            `users[${index}].itemDetails[${idx}].approved_amount`,
                                                            +e.target.value *
                                                              +itm.item_rate
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </td>
                                                  <td>
                                                    ₹{" "}
                                                    {itm?.total_approved_amount}
                                                  </td>

                                                  <td>
                                                    {itm?.approved_at ?? "--"}
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>

                                    {props.values.users[index].user_select && (
                                      <button
                                        type="button"
                                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1 my-2"
                                        onClick={() => {
                                          props.setFieldValue(
                                            `users[${index}].show_form`,
                                            !props.values.users[index].show_form
                                          );
                                        }}
                                      >
                                        {props.values.users[index].show_form ? (
                                          <>
                                            <RiArrowUpSFill /> hide Feedback
                                            Form
                                          </>
                                        ) : (
                                          <>
                                            {" "}
                                            <RiArrowDownSFill />
                                            show Feedback Form
                                          </>
                                        )}
                                      </button>
                                    )}

                                    {props?.values?.users[index]?.show_form && (
                                      <Feedback props={props} index={index} />
                                    )}
                                  </div>
                                </Col>
                              </div>
                            </div>
                          );
                        })}

                      <Form.Group as={Col} md={12}>
                        <div className="mt-2 text-center">
                          <button
                            type={`button`}
                            onClick={() => {
                              setShowAlert(true);
                            }}
                            disabled={props?.isSubmitting}
                            className={`shadow border-0 cursor-pointer px-4 py-1 purple-combo`}
                          >
                            {props?.isSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                />
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>Submit</>
                            )}
                          </button>{" "}
                          <ConfirmAlert
                            size={"sm"}
                            defaultIcon={<BsQuestionLg />}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm Alert"}
                            description={"Are sure to Approve This "}
                          />
                        </div>
                      </Form.Group>
                    </>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ApproveSiteInspection;
