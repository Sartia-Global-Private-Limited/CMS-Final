import { Spinner } from "react-bootstrap";

const LoaderUi = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Spinner animation="grow" variant="secondary" />
    </div>
  );
};
export default LoaderUi;
