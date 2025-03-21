import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

const SearchHeader = ({ setSearchText, ...props }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delay = 500;
    const timerId = setTimeout(() => {
      setSearchText(searchInput);
      if (searchInput) {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        searchParams.set("pageNo", "1");
        let newPath = url.pathname + "?" + searchParams.toString();
        navigate(newPath);
      }
    }, delay);
    return () => clearTimeout(timerId);
  }, [searchInput, navigate, setSearchText]);

  return (
    <Form.Group className="position-relative">
      <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        {...props}
      />
    </Form.Group>
  );
};

export default SearchHeader;
