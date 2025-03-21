import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Formik } from "formik";
import {
  postStockPunchApproveBySite,
  getApprovedSiteExpenseRequestData,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";

const AssignSiteInspection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outletId = location?.state?.outletId;
  const month = location?.state?.month;
  const [edit, setEdit] = useState({});

  const fetchTransferDetails = async () => {
    const res = await getApprovedSiteExpenseRequestData(
      outletId,
      month?.split("-")[1]
    );

    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
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

  useEffect(() => {
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
                              <Col md={12} className="">
                                <div className="  ">
                                  <div className="d-flex">
                                    <Col md={6} className="p-20 shadow rounded">
                                      <strong className="text-secondary my-2">
                                        {" "}
                                        User Details
                                      </strong>

                                      <ul className="list-unstyled ">
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
                                            {
                                              data?.userDetails?.[0]
                                                ?.employee_id
                                            }
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
                                    </Col>

                                    <Col md={6} className="p-20 shadow rounded">
                                      {data.getAssignDetail.length > 0 ? (
                                        <div>
                                          <strong className="text-secondary my-2">
                                            {" "}
                                            Complaint Assigned
                                          </strong>
                                          <br />
                                          <span>
                                            Employee Name-{" "}
                                            {data?.getAssignDetail[0]
                                              ?.office_user_name ||
                                              data.getAssignDetail[0]
                                                .end_user_name ||
                                              data.getAssignDetail[0]
                                                .supervisor_name ||
                                              data.getAssignDetail[0]
                                                .area_manager_name}
                                          </span>
                                          <br />
                                        </div>
                                      ) : (
                                        <button
                                          className="shadow border-0 cursor-pointer px-4 py-1 danger-combo"
                                          onClick={() => {
                                            navigate(`/assign-employee`, {
                                              state: {
                                                complaint_id:
                                                  data.itemDetails?.[0]
                                                    .complaint_id,
                                                type: "stock",
                                              },
                                            });
                                          }}
                                          type="button"
                                        >
                                          Assign
                                        </button>
                                      )}
                                    </Col>
                                  </div>

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
                                                <td>{itm?.approved_qty}</td>

                                                <td>
                                                  ₹ {itm?.total_approved_amount}
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
                                </div>
                              </Col>
                            </div>
                          );
                        })}
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

export default AssignSiteInspection;
