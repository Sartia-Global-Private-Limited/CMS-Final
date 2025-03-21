import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";

const CardComponent = ({
  title,
  onclick,
  custom,
  align,
  link,
  classbody,
  className,
  shadow,
  headclass,
  heading2,
  children,
  icon,
  custom2,
  search,
  searchOnChange,
  target,
  tag,
  backButton = true,
  showBackButton = false,
}) => {
  const { t } = useTranslation();
  const history = useNavigate();
  const { id } = useParams();

  return (
    <Card className={`card-bg h-100 ${className}`}>
      <Card.Header
        className={`${align} d-align d-md-flex gap-md-0 gap-2 d-grid justify-content-between bg-transparent border-primary p-3`}
        title={title}
      >
        <strong className={`d-align justify-content-between ${headclass}`}>
          {(id || showBackButton) && backButton ? (
            <BsArrowLeft
              title="back"
              fontSize={22}
              onClick={() => history(-1)}
              className="me-2 cursor-pointer"
            />
          ) : null}
          {t(title)} {heading2}
        </strong>{" "}
        <span className="d-align d-md-flex d-grid justify-content-between gap-2">
          {custom}
          {search && (
            <span className="position-relative">
              <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder={t("Search")}
                onChange={searchOnChange}
                className="me-2"
                aria-label="Search"
              />
            </span>
          )}
          {tag && (
            <Button
              as={link ? Link : null}
              to={link}
              target={target}
              variant="light"
              className={`text-none view-btn shadow rounded-0 px-1 text-orange ${shadow}`}
              onClick={onclick}
            >
              {icon}
              {t(tag)}
            </Button>
          )}{" "}
          {custom2}
        </span>
      </Card.Header>
      <Card.Body className={classbody}>{children}</Card.Body>
    </Card>
  );
};

export default CardComponent;
