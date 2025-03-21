import { useRef, useState } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";

const ButtonHeader = ({
  title,
  handleClickManual,
  handleClickImport,
  noDrop,
  otherButtons,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ButtonGroup ref={anchorRef} aria-label="Button group with a nested menu">
      {!noDrop ? (
        <Dropdown as={ButtonGroup} show={open} onToggle={handleToggle}>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-split-basic"
            onClick={handleToggle}
          >
            {title}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleClickManual}>Manual</Dropdown.Item>
            {handleClickImport && (
              <Dropdown.Item onClick={handleClickImport}>
                Import File
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button variant="success" onClick={handleClickManual}>
          {title}
        </Button>
      )}

      {otherButtons?.length > 0 &&
        otherButtons.map((itm, idx) => (
          <Button key={idx.toString()} onClick={itm.to}>
            {itm.title}
          </Button>
        ))}
    </ButtonGroup>
  );
};

export default ButtonHeader;
