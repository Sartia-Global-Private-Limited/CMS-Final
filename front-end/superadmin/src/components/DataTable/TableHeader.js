import { Container, Row, Col } from "react-bootstrap";
import SearchHeader from "./SearchHeader";
import ButtonHeader from "./ButtonHeader";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TableHeader = ({
  setSearchText,
  button = {},
  userPermission = { create: true },
  openImport,
  extraComponent = null,
}) => {
  const {
    title = "Add",
    to = "/",
    noDrop = false,
    otherButtons = [],
    show = true,
    toClick = false,
  } = button;
  const navigate = useNavigate();

  const [isSmScreen, setIsSmScreen] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsSmScreen(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex align-items-center gap-2 flex-column flex-md-row">
      {setSearchText && <SearchHeader setSearchText={setSearchText} />}
      <div>{extraComponent}</div>
      {show && userPermission?.create ? (
        <ButtonHeader
          title={title}
          handleClickManual={toClick ? toClick : () => navigate(to)}
          handleClickImport={openImport}
          noDrop={noDrop}
          otherButtons={otherButtons}
        />
      ) : null}
    </div>
  );
};

export default TableHeader;
