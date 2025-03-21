import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SearchComponent = ({
  setSearch,
  showAdd = false,
  addTitle,
  addAction,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delay = 500;
    const timerId = setTimeout(() => {
      setSearch(searchInput);
      if (searchInput) {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("page", "1");
        let newPath = url.pathname + "?" + searchParams.toString();
        navigate(newPath);
      }
    }, delay);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="position-relative">
        <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
        <Form.Control
          type="text"
          placeholder={t("Search")}
          className="me-2"
          aria-label="Search"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          {...props}
        />
      </div>
      {showAdd && (
        <Button
          variant="light"
          className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
          onClick={addAction}
        >
          <BsPlus />
          {addTitle}
        </Button>
      )}{" "}
    </div>
  );
};

export default SearchComponent;
