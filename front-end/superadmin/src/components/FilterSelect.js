import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import FormLabelText from "./FormLabelText";
import { Filter } from "lucide-react";

export const FilterSelect = ({
  data = [],
  userFormatOptionLabel,
  customField,
}) => {
  return (
    <div className="d-flex p-2 gap-1 mt-3">
      <Filter />
      <Row className="g-3 align-items-center w-100">
        {data?.map((field, index) => (
          <Col key={index} md={field?.md || 3}>
            <FormLabelText children={field?.title} />
            {field?.text ? (
              <div>{field?.text}</div>
            ) : (
              <Select
                menuPortalTarget={document.body}
                options={field?.data}
                onChange={(e) => {
                  if (e) {
                    field?.setId(e);
                  } else {
                    field?.setId({});
                  }
                }}
                isClearable
                isDisabled={field?.isDisabled}
                formatOptionLabel={userFormatOptionLabel}
              />
            )}
            {field?.hyperText && (
              <FormLabelText info children={field?.hyperText} />
            )}
          </Col>
        ))}
        {customField}
      </Row>
    </div>
  );
};
