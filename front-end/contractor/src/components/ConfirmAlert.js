import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  BsCheckLg,
  BsPencilSquare,
  BsQuestionLg,
  BsTrashFill,
  BsXLg,
} from "react-icons/bs";

const ConfirmAlert = ({
  size,
  show = false,
  hide,
  children,
  deleteFunction,
  defaultIcon = <BsQuestionLg />,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this!!",
  formikProps,
  type = "button",
}) => {
  return (
    <Modal
      size={size}
      show={show}
      onHide={() => hide(false)}
      scrollable={true}
      backdrop="static"
      centered
      className="my-modal modal-area"
    >
      <Form onSubmit={formikProps?.handleSubmit} className="d-content ">
        <Modal.Body className="d-grid gap-3 pb-0 text-center ">
          <div>
            <div
              className={`border-4 rounded-circle d-inline-flex p-3 fs-2 border ${
                title == "Confirm Delete" ||
                title === "Confirm Remove" ||
                title == "Confirm Reject"
                  ? "border-danger text-danger"
                  : title == "Confirm Approve"
                  ? "border-success text-success"
                  : "border-orange text-orange"
              }`}
            >
              {title === "Confirm Delete" ? (
                <BsTrashFill />
              ) : title === "Confirm Reject" || title === "Confirm Remove" ? (
                <BsXLg />
              ) : title === "Confirm Approve" ? (
                <BsCheckLg />
              ) : title === "Confirm Update" ? (
                <BsPencilSquare />
              ) : (
                defaultIcon
              )}
            </div>
          </div>
          <h4 className="fw-bolder my-0">{title}</h4>
          <p className="mb-0">{description}</p>
          {children}
        </Modal.Body>
        <Modal.Footer className="border-0 mt-0 flex-nowrap justify-content-center">
          <Button
            className="w-100"
            variant="outline-danger"
            onClick={() => hide(false)}
          >
            Cancel
          </Button>
          <Button
            variant={`${
              title === "Confirm Delete" ||
              title === "Confirm Reject" ||
              title === "Confirm Approve" ||
              title === "Confirm Remove"
                ? "success"
                : "warning"
            }`}
            className={`w-100`}
            disabled={formikProps?.isSubmitting}
            onClick={deleteFunction}
            type={type}
          >
            {formikProps?.isSubmitting ? (
              <>
                <Spinner animation="border" variant="primary" size="sm" />{" "}
                PLEASE WAIT...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConfirmAlert;
