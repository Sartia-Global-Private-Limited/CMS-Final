import {
  Table,
  Spinner,
  Dropdown,
  DropdownButton,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MoveDown, MoveUp, Settings, Trash2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReactPagination from "../ReactPagination";
import { EmptyDataComponent } from "./EmptyDataComponent";
import { FaFileExcel, FaRegFilePdf } from "react-icons/fa";
import TooltipComponent from "../TooltipComponent";
import { toast } from "react-toastify";

const CustomTable = ({
  id,
  columns,
  rows,
  isLoading = false,
  userPermission = { view: true },
  hideFilters = true,
  loaderComponent,
  apiForExcelPdf,
  tableTitleComponent,
  tableNotes,
  align,
  excelAction = false,
  pdfAction = false,
  showDelete = true,
  customHeaderComponent,
  multiRows = {},
  hideCol = [],
  defaultVisible = {},
  pagination,
  bankId,
  employeeId,
  typeSelect,
  account_id,
  status,
  retention_status,
  module_type,
  module,
  maxHeight = "47vh",
}) => {
  const {
    hideFooter = true,
    pageNo = 1,
    pageSize = 10,
    totalData = 0,
  } = pagination || {};

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [sorting, setSorting] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // const [columnVisibility, setColumnVisibility] = useState(() => {
  //   const savedColumnVisibility = localStorage.getItem(`cv-${id}`);
  //   return JSON.parse(savedColumnVisibility ?? JSON.stringify(defaultVisible));
  // });

  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState({});

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const savedColumnVisibility = localStorage.getItem(`cv-${id}`);

    return savedColumnVisibility
      ? JSON.parse(savedColumnVisibility)
      : columns?.reduce((acc, column) => {
          acc[column.accessorKey || column.id] = true;
          return acc;
        }, {});
  });

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      columnVisibility,
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleClickExcelPdf = async (type) => {
    fetchData(type);
  };

  const fetchData = async (type) => {
    const columns = JSON.stringify(reportData);
    setIsDownloading(type);
    let res;
    if (bankId) {
      res = await apiForExcelPdf(bankId, module, module_type, {
        type,
        columns,
      });
    } else if (employeeId) {
      res = await apiForExcelPdf(employeeId, module, module_type, {
        type,
        columns,
      });
    } else if (account_id) {
      res = await apiForExcelPdf(account_id, typeSelect, module_type, {
        type,
        columns,
      });
    } else {
      res = await apiForExcelPdf({ type, columns, status, retention_status });
    }
    if (res?.status) {
      toast.success(res?.message);
      const filePath = res?.filePath;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(res?.message);
    }
    setIsDownloading(null);
  };

  useEffect(() => {
    const visibleColumns = Object.entries(columnVisibility)
      .filter(([, isVisible]) => isVisible)
      .map(([columnId]) => columnId);

    localStorage.setItem(`cv-${id}`, JSON.stringify(columnVisibility));
    setReportData(visibleColumns);
  }, [columnVisibility]);

  useEffect(() => {
    setSelectedRows({
      info: table?.getSelectedRowModel().flatRows || [],
      table: multiRows?.table,
      api: multiRows?.api,
      tags: multiRows?.tags,
    });
    // Object.keys(rowSelection).length > 0 &&
  }, [rowSelection]);

  const handleChangeRowsPerPage = (e) => {
    const newPageSize = parseInt(e?.value, 10);
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set("pageSize", newPageSize.toString());
    searchParams.set("pageNo", "1");

    let newPath = url.pathname + "?" + searchParams.toString();
    navigate(newPath);
  };

  const handleChangePage = (e, newPage) => {
    const pageQueryParam = `pageNo=${newPage}`;
    const pageParamExists = search.includes("pageNo=");

    const newPath = pageParamExists
      ? pathname + search.replace(/pageNo=\d+/, pageQueryParam)
      : pathname + search + (search ? "&" : "?") + pageQueryParam;
    navigate(newPath);
  };

  const startIndex = (+pagination.pageNo - 1) * +pagination.pageSize;
  const endIndex = startIndex + +pagination.pageSize;

  return (
    <>
      <div>
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#d0d0d09c",
              position: "absolute",
              inset: 0,
              zIndex: 9,
            }}
          >
            {loaderComponent ? (
              loaderComponent
            ) : (
              <Spinner animation="border" variant="secondary" />
            )}
          </div>
        )}
        {hideFilters && (
          <div
            style={{
              display: "flex",
              padding: "1rem",
              gap: "1rem",
              alignItems: "center",
              justifyContent: tableTitleComponent ? "space-between" : "end",
              flexDirection: "row",
            }}
          >
            {tableTitleComponent && tableTitleComponent}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {typeof customHeaderComponent === "function" &&
                customHeaderComponent(selectedRows)}

              {/* {Object.keys(rowSelection).length > 0 && showDelete && (
                <TooltipComponent
                  title={
                    <>
                      {multiRows?.text ? multiRows?.text : "Delete"}{" "}
                      {multiRows.hideCountRow
                        ? null
                        : Object.keys(rowSelection).length + " Rows"}
                    </>
                  }
                  align="top"
                >
                  <Button
                    color={multiRows?.bg ? multiRows?.bg : "error"}
                    variant="contained"
                    onClick={multiRows?.handlemultiple}
                  >
                    {multiRows?.icon ? multiRows?.icon : <Trash2 />}
                  </Button>
                </TooltipComponent>
              )} */}

              <TooltipComponent align={align} title={"Column Visibility"}>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={<Settings size={20} />}
                  variant="secondary"
                  autoClose={false}
                >
                  <Dropdown.Item
                    onClick={table.getToggleAllColumnsVisibilityHandler()}
                  >
                    <Form.Check
                      checked={table.getIsAllColumnsVisible()}
                      label={"Select All"}
                    />
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {table
                    .getAllLeafColumns()
                    .filter(
                      (itm) => !hideCol.includes(itm.id) && itm.id !== "select"
                    )
                    .map((column) => (
                      <Dropdown.Item
                        key={column.id}
                        onClick={column.getToggleVisibilityHandler()}
                      >
                        <Form.Check
                          checked={column.getIsVisible()}
                          label={column.columnDef.header}
                        />{" "}
                      </Dropdown.Item>
                    ))}
                </DropdownButton>
              </TooltipComponent>
              {excelAction && (
                <TooltipComponent align={align} title={"Excel Report"}>
                  <span
                    onClick={() => handleClickExcelPdf("1")}
                    className="my-btn d-align purple-combo"
                  >
                    {isDownloading === "1" ? (
                      <Spinner animation="grow" size="sm" />
                    ) : (
                      <FaFileExcel />
                    )}
                  </span>
                </TooltipComponent>
              )}

              {pdfAction && (
                <TooltipComponent align={align} title={"pdf report"}>
                  <span
                    onClick={() => handleClickExcelPdf("2")}
                    className="my-btn d-align purple-combo"
                  >
                    {isDownloading === "2" ? (
                      <Spinner animation="grow" size="sm" />
                    ) : (
                      <FaRegFilePdf />
                    )}
                  </span>
                </TooltipComponent>
              )}
            </div>
          </div>
        )}
        {tableNotes}
        <div style={{ maxHeight: maxHeight }} className="table-scroll mb-2">
          <Table striped bordered hover>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((itm) => !hideCol.includes(itm.id))
                    .map((header) => (
                      <th
                        key={header.id}
                        style={{
                          backgroundColor: `var(--bs-secondary)`,
                          color: `var(--bs-white)`,
                          textAlign: "center",
                          border: `1px solid #d5d5d5`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {{
                            asc: <MoveUp size={14} />,
                            desc: <MoveDown size={14} />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.getIsSelected() ? "table-active" : ""}
                >
                  {row
                    .getVisibleCells()
                    .filter((itm) => !hideCol.includes(itm.column.id))
                    .map((cell) => {
                      const cellContent =
                        cell.column.columnDef.cell(cell) || "-";
                      const isLongText = cellContent.length > 60;

                      return (
                        <td
                          key={cell.id}
                          style={{
                            textAlign: "center",
                            border: "1px solid #d5d5d5",
                            whiteSpace: "nowrap",
                            position: "relative",
                            verticalAlign: "middle",
                          }}
                        >
                          {isLongText ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip className="custom-tooltip">
                                  {cellContent}
                                </Tooltip>
                              }
                            >
                              <span>{cellContent.substring(0, 60)}...</span>
                            </OverlayTrigger>
                          ) : (
                            cellContent
                          )}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {!rows.length && <EmptyDataComponent userPermission={userPermission} />}
        {hideFooter && (
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pagination.pageNo <= 1
                ? "danger-combo-disable pe-none"
                : "red-combo"
            }
            nextClassName={
              endIndex >= totalData
                ? "danger-combo-disable pe-none"
                : "success-combo"
            }
            title={`Showing ${startIndex + 1 || 0}-${
              Math.min(endIndex, pagination?.totalData) || 0
            } of ${pagination?.totalData || 0}`}
            handlePageSizeChange={handleChangeRowsPerPage}
            prevonClick={(e) => handleChangePage(e, pagination.pageNo - 1)}
            nextonClick={(e) => handleChangePage(e, +pagination.pageNo + 1)}
          />
        )}
      </div>
    </>
  );
};

export default CustomTable;

export const selectable = {
  id: "select",
  exportAble: false,
  header: ({ table }) => (
    <IndeterminateCheckbox
      {...{
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllPageRowsSelectedHandler(),
      }}
    />
  ),
  cell: ({ row }) => (
    <IndeterminateCheckbox
      value={row.original.id}
      {...{
        checked: row.getIsSelected(),
        indeterminate: row.getIsSomeSelected(),
        onChange: row.getToggleSelectedHandler(),
      }}
    />
  ),
};

export const IndeterminateCheckbox = ({ ...rest }) => {
  const ref = useRef(null);
  return <Form.Check ref={ref} {...rest} />;
};
