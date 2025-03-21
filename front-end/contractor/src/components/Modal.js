import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { BsXLg } from "react-icons/bs";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const Modaljs = ({
  open,
  close,
  children,
  size,
  Savebtn,
  saveOnclick,
  className,
  closebtn,
  title,
  newButtonTitle,
  newButtonOnclick,
  newButtonType,
  hideFooter,
  footerClass,
  newButtonClass,
  formikProps,
  dialogClassName,
  px = 3,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      size={size}
      show={open}
      onHide={close}
      dialogClassName={dialogClassName}
      scrollable={true}
      backdrop="static"
      centered
      className="my-modal modal-area"
    >
      {/* table-bg border-4 modal-animate border-orange border-bottom py-2 m-3 */}
      <Form onSubmit={formikProps?.handleSubmit} className="d-content">
        <Modal.Header className="table-bg border-4 border-orange border-bottom py-2 m-3">
          <strong>{title}</strong>
          <div onClick={close} className="nav-link ms-auto cursor-pointer">
            <BsXLg />
          </div>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <SimpleBar className={`area px-${px}`}>{children}</SimpleBar>
        </Modal.Body>
        {!hideFooter && (
          <Modal.Footer className={`table-bg py-1 gap-2 ${footerClass}`}>
            <Form.Control
              size="lg"
              type="text"
              className={`dnone ${className}`}
              placeholder="Type your comments..."
            />
            <Button className="bg-new text-uppercase text-gray" onClick={close}>
              {t(closebtn)}
            </Button>
            <div className="vr hr-shadow" />
            <Button
              onClick={saveOnclick}
              variant="primary"
              type="submit"
              className="bg-new text-uppercase text-secondary"
              disabled={formikProps?.isSubmitting}
            >
              {formikProps?.isSubmitting ? (
                <>
                  <Spinner animation="border" variant="primary" size="sm" />{" "}
                  PLEASE WAIT...
                </>
              ) : (
                <>{t(Savebtn)}</>
              )}
            </Button>
            {newButtonTitle && (
              <>
                <div className="vr hr-shadow" />
                <Button
                  type={newButtonType}
                  className={`bg-new text-uppercase text-gray ${newButtonClass}`}
                  onClick={newButtonOnclick}
                >
                  {newButtonTitle}
                </Button>
              </>
            )}
          </Modal.Footer>
        )}
      </Form>
    </Modal>
  );
};

export default Modaljs;
