import React from "react";
import { useTranslation } from "react-i18next";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

const JsFooter = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="d-md-flex text-center align-items-center justify-content-between">
        <small>
          © {new Date().getFullYear()} |{" "}
          <Link to="/" className="text-secondary">
            CMS IT HUB PRIVATE LIMITED.
          </Link>{" "}
          | {t("All rights reserved")}
        </small>
        <span className="d-flex gap-4 my-md-0 my-2 justify-content-center">
          {[
            <BsFacebook className="facebook" />,
            <BsLinkedin className="linkedin" />,
            <BsInstagram className="instagram" />,
            <BsTwitter className="twitter" />,
          ].map((item, idx) => (
            <span key={idx} className="my-btn d-align">
              {item}
            </span>
          ))}
        </span>
      </div>
    </>
  );
};

export default JsFooter;
