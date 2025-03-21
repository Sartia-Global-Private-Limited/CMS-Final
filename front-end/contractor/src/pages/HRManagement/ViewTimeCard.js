import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Attendance from "./ViewTimeCardsAttendance/EmployeeAttendance";
import MembersClockIn from "./ViewTimeCardsAttendance/MembersClockIn";
import MembersClockOut from "./ViewTimeCardsAttendance/MembersClockOut";
import CardComponent from "../../components/CardComponent";
import { BsPlus } from "react-icons/bs";
import { Formik } from "formik";
import Modaljs from "../../components/Modal";
import Select from "react-select";
import { createManuallychema } from "../../utils/formSchema";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { getDashboardData } from "../../services/authapi";

const ViewTimeCard = () => {
  const { user } = useSelector(selectUser);
  const [getData, setGetData] = useState([]);

  const fetchData = async () => {
    const res = await getDashboardData();
    if (res.status) {
      setGetData(res.data[0]);
    } else {
      setGetData([]);
    }
  };

  const allEmployees = [
    { value: "Altaf Ahmad1", label: "Altaf Ahmad" },
    { value: "Altaf Ahmad2", label: "Altaf Ahmad" },
    { value: "Altaf Ahmad3", label: "Altaf Ahmad" },
    { value: "Altaf Ahmad4", label: "Altaf Ahmad" },
    { value: "Altaf Ahmad5", label: "Altaf Ahmad" },
  ];

  const [openAdd, setOpenAdd] = useState(false);
  const tabs = [
    { title: "Time Card", page: <Attendance /> },
    { title: "Members (Clock-In)", page: <MembersClockIn getData={getData} /> },
    {
      title: "Members (Clock-Out)",
      page: <MembersClockOut getData={getData} />,
    },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const rData = {
      name: values.name.value,
      start_date: values.start_date,
      clock_in: values.clock_in,
      end_date: values.end_date,
      clock_out: values.clock_out,
      descritpion: values.descritpion,
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>View Employee · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          icon={user.id === 1 ? <BsPlus /> : ""}
          onclick={() => setOpenAdd(true)}
          tag={user.id === 1 ? "Create Manually" : ""}
        >
          <Tabs
            activeTab="1"
            ulClassName="border-primary border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-3">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          start_date: "",
          clock_in: "",
          end_date: "",
          clock_out: "",
          descritpion: "",
        }}
        validationSchema={createManuallychema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={openAdd}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setOpenAdd(false)}
            title={"Create Manually"}
            formikProps={props}
          >
            <Row className="g-3">
              <Form.Group as={Col} md={12}>
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>

                <Select
                  menuPosition="fixed"
                  className="text-primary"
                  name="name"
                  value={props.values.name}
                  onChange={(val) => props.setFieldValue("name", val)}
                  options={allEmployees}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />

                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Start Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name={"start_date"}
                  defaultValue={props.values.start_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.start_date && props.errors.start_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Clock-In <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  name={"clock_in"}
                  defaultValue={props.values.clock_in}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.clock_in && props.errors.clock_in
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.clock_in}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  End Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name={"end_date"}
                  defaultValue={props.values.end_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.end_date && props.errors.end_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>
                  Clock-out <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  name={"clock_out"}
                  defaultValue={props.values.clock_out}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.clock_out && props.errors.clock_out
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.clock_out}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name={"descritpion"}
                  defaultValue={props.values.descritpion}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.descritpion && props.errors.descritpion
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.descritpion}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default ViewTimeCard;
