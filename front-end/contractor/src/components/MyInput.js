import { Form, FormLabel, InputGroup, Button, FormText } from "react-bootstrap";
import { useField } from "formik";
import { Fragment, memo } from "react";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import EditorToolbar, { formats, modules } from "./EditorToolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircleMinus, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import Files from "react-files";
import { FixedSizeList as List } from "react-window";
import { toast } from "react-toastify";
import FileViewer from "./FileViewer";
import { ACCEPT_ALL_FORMAT } from "../data/StaticData";
import FormikErrorFocus from "formik-error-focus";

const MyInput = ({
  formikProps,
  label,
  isRequired = false,
  customType,
  dateProps,
  selectProps,
  inputStyle,
  containerStyle,
  rightElement,
  min,
  max,
  maxFileSize = 25000000,
  quilHeight = "100px",
  helperText = "",
  allowMultipleFile = false,
  ...props
}) => {
  const [field, meta] = useField(props);
  const error = meta.touched && meta.error;

  const MenuList = ({ children, maxHeight }) => {
    const height = 35;
    const totalHeight = Math?.min(children?.length * height, maxHeight);

    if (!children?.length) {
      return <NoDataInList />;
    }

    return (
      <List height={totalHeight} itemCount={children?.length} itemSize={height}>
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };

  const NoDataInList = () => (
    <>
      {selectProps?.addMore && (
        <Button
          variant="outline-primary"
          className="w-100 mt-2"
          onClick={selectProps?.addMore}
        >
          <Plus size={15} /> Add New
        </Button>
      )}
      <div className="p-2 text-gray text-center">No Result</div>
    </>
  );

  const renderComponent = () => {
    switch (customType) {
      case "phone":
        return (
          <PhoneInput
            // countryCodeEditable={false}
            country={"in"}
            disableDropdown
            preferredCountries={["in"]}
            value={field.value}
            onChange={(phoneValue, country) => {
              formikProps.setFieldValue(field.name, `+${phoneValue}`);
            }}
            inputStyle={{
              width: "100%",
              background: "transparent",
              border: "0",
            }}
            {...props}
          />
        );

      case "select":
        const filteredValue = selectProps?.data?.filter((itm) =>
          props.multiple
            ? field?.value?.includes(itm.value)
            : itm?.value == field.value
        );
        return (
          <Select
            isMulti={props.multiple}
            menuPortalTarget={document.body}
            closeMenuOnSelect={!props?.multiple}
            value={props?.multiple ? filteredValue : filteredValue?.[0] || null}
            onChange={(selectedOption) => {
              if (selectProps?.onChange) {
                selectProps.onChange(selectedOption);
              }
              const value = props.multiple
                ? selectedOption.map((option) => option.value)
                : selectedOption?.value;
              formikProps.setFieldValue(field.name, value || "");
            }}
            options={selectProps?.data || []}
            isClearable
            classNamePrefix="react-select"
            isInvalid={error}
            placeholder="Select..."
            noOptionsMessage={() => <NoDataInList />}
            components={{ MenuList }}
            {...props}
          />
        );

      case "multiline":
        return (
          <TextareaAutosize
            rows={2}
            minRows={2}
            className="edit-textarea"
            value={field.value}
            onChange={(val) =>
              formikProps.setFieldValue(field.name, val.target.value)
            }
            {...props}
          />
        );

      case "editor":
        return (
          <Fragment>
            <EditorToolbar shortId={props?.shortId || field.name} />
            <ReactQuill
              style={{ height: quilHeight }}
              modules={modules(props?.shortId || field.name)}
              formats={formats}
              theme="snow"
              value={field.value}
              onChange={(val) => formikProps.setFieldValue(field.name, val)}
            />
          </Fragment>
        );

      case "fileUpload":
        const handleFilesChange = (files) => {
          if (selectProps?.onChange) {
            selectProps.onChange(allowMultipleFile ? files : files[0]);
          }

          formikProps.setFieldValue(
            field.name,
            allowMultipleFile ? files : files[0]
          );
        };

        const handleRemoveFile = (index) => {
          const updatedFiles = allowMultipleFile
            ? field.value.filter((_, idx) => idx !== index)
            : null;
          formikProps.setFieldValue(field.name, updatedFiles);
        };

        const files = Array.isArray(field.value) ? field.value : [field.value];
        return (
          <>
            <div>
              {(allowMultipleFile ? field?.value?.length > 0 : field?.value) ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  {files?.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: `1px solid gray`,
                        borderRadius: 1,
                        position: "relative",
                        padding: 5,
                      }}
                    >
                      <FileViewer file={file} />

                      <small>{file?.name || "Uploaded file"}</small>
                      <CircleMinus
                        size={20}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "red",
                          margin: "-10px",
                          background: "var(--bs-indigo)",
                          borderRadius: "50px",
                        }}
                        onClick={() => handleRemoveFile(index)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Files
                  className="files-dropzone"
                  onChange={handleFilesChange}
                  onError={(error) => toast.error(error.message)}
                  accepts={props?.accepts || ACCEPT_ALL_FORMAT}
                  multiple={allowMultipleFile}
                  maxFileSize={maxFileSize}
                  minFileSize={0}
                  clickable
                  {...props}
                >
                  <div
                    style={{
                      padding: "0.375rem 0.75rem",
                      border: `1px dashed rgba(0, 0, 0, 0.23)`,
                      borderRadius: 1,
                      backgroundColor: "#EEEEEE",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "gray" }} className="mb-0">
                      {field.value
                        ? `${field.value ? files?.length : 0} File${
                            files?.length > 1 ? "s" : ""
                          } Selected`
                        : "Click to choose file or drag and drop here"}
                    </p>
                  </div>
                </Files>
              )}
            </div>
          </>
        );

      default:
        return (
          <InputGroup>
            <Form.Control
              type={customType || "text"}
              isInvalid={error}
              {...field}
              {...props}
              min={min || 0}
              step="any"
            />
          </InputGroup>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {label && (
        <FormLabel>
          {label} {isRequired && <span className="text-danger">*</span>}
        </FormLabel>
      )}
      {renderComponent()}
      {helperText && <FormText>{helperText}</FormText>}
      {error && <FormText className="text-danger">{meta.error}</FormText>}

      <FormikErrorFocus
        offset={0}
        align="top"
        focusDelay={200}
        ease="linear"
        duration={300}
      />
    </div>
  );
};

export default memo(MyInput);
