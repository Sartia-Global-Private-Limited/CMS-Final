import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  viewCredentialsViaEmail,
  viewCredentialsViaWhatsapp,
  viewSingleEmployeeCredentials,
} from "../../../services/authapi";

const SendLoginCredentials = () => {
  const { id } = useParams();
  const [viewCredentials, setViewCredentials] = useState([]);

  const fetchData = async () => {
    const res = await viewSingleEmployeeCredentials(id);
    if (res.status) {
      setViewCredentials(res.data);
    } else {
      setViewCredentials([]);
    }
  };

  const fetchDataUrl = async () => {
    const res = await viewCredentialsViaWhatsapp(id);
    if (res.status) {
      // window.location.href = res.link;
      window.open(res.link, "_blank");
    }
  };

  // console.log(url);
  const credentialsViaEmail = async () => {
    const rData = {
      email: viewCredentials?.email,
      password: viewCredentials?.base_64_password,
      id: viewCredentials?.id,
    };
    const res = await viewCredentialsViaEmail(rData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchData();
    // fetchDataUrl();
  }, []);

  const login = [
    {
      id: 1,
      title: "User Email Id",
      value: viewCredentials?.email,
      type: "email",
    },
    {
      id: 2,
      title: "Password",
      value: viewCredentials?.base_64_password,
      type: "password",
    },
  ];
  return (
    <Col md={5} className="py-5 mx-auto">
      <Form>
        {login.map((form, ido) => (
          <Form.Group key={ido} as={Row} className="mb-3">
            <Form.Label column>{form.title}</Form.Label>
            <Col sm={8}>
              <Form.Control
                type={form.type}
                readOnly
                defaultValue={form.value}
              />
            </Col>
          </Form.Group>
        ))}

        <span className="d-align gap-2">
          <TooltipComponent title={"Send Email"}>
            <BsEnvelopeFill
              className="social-btn danger-combo"
              onClick={credentialsViaEmail}
            />
          </TooltipComponent>
          <div className="vr hr-shadow" />
          <TooltipComponent title={"Send Whatsapp"}>
            <BsWhatsapp
              onClick={fetchDataUrl}
              className="social-btn success-combo"
            />
          </TooltipComponent>
        </span>
      </Form>
    </Col>
  );
};

export default SendLoginCredentials;
