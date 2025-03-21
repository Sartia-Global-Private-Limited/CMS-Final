import React, { useState } from "react";
import { Col, Form, Spinner } from "react-bootstrap";
import ConfirmAlert from "./ConfirmAlert";
import { useTranslation } from "react-i18next";

export const FormikSubmitButton = ({ id, props, title }) => {
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Form.Group as={Col} md={12}>
        <div className="text-center">
          <button
            type={`${id ? "button" : "submit"}`}
            onClick={() => setShowAlert(id && true)}
            disabled={props?.isSubmitting}
            className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
          >
            {props?.isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> {t("PLEASE WAIT")}...
              </>
            ) : (
              <>
                {id ? t("UPDATE") : t("CREATE")} {title}
              </>
            )}
          </button>
          <ConfirmAlert
            size={"sm"}
            deleteFunction={props?.handleSubmit}
            hide={setShowAlert}
            show={showAlert}
            title={"Confirm UPDATE"}
            description={"Are you sure you want to update this!!"}
          />
        </div>
      </Form.Group>
    </>
  );
};
