import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
  getAdminDeleteTutorials,
  getAdminTutorials,
} from "../services/authapi";
import ConfirmAlert from "../components/ConfirmAlert";
import CustomTable from "../components/DataTable/CustomTable";
import TableHeader from "../components/DataTable/TableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { findMatchingPath, serialNumber } from "../utils/helper";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../components/DataTable/ActionButtons";
import { TvMinimalPlay } from "lucide-react";
import { FilterSelect } from "../components/FilterSelect";
import ImageViewer from "../components/ImageViewer";
import { BsFilePdf, BsFileText, BsFileWord } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const Tutorials = ({}) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorialTypeId, setAllTutorialTypeId] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchAllTutorialData = async () => {
    const res = await getAdminTutorials(
      search || tutorialTypeId?.label,
      pageSize,
      pageNo
    );
    setIsLoading(true);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteTutorials(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("user_type_name", {
        header: "User Type",
      }),
      columnHelper.accessor("application_type", {
        header: "Application Type",
      }),
      columnHelper.accessor("module_type", {
        header: "Module Type",
      }),
      columnHelper.accessor("tutorial_format", {
        header: "Format",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("attachment", {
        header: "Attachment",
        cell: (info) => {
          const fileUrl = `${process.env.REACT_APP_API_URL}${info.row.original?.attachment}`;
          const fileType = fileUrl.split(".").pop().toLowerCase();

          if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
            return (
              <ImageViewer src={fileUrl}>
                <img
                  width={50}
                  height={50}
                  className="my-bg object-fit p-1 rounded"
                  src={fileUrl}
                  alt="Attachment"
                />
              </ImageViewer>
            );
          } else if (["mp4", "mov", "avi"].includes(fileType)) {
            return (
              <ImageViewer
                src={fileUrl}
                video={true}
                image={false}
                poster="/assets/images/video-logo.png"
              >
                <img
                  src="/assets/images/video-logo.png"
                  alt="Video thumbnail"
                  className="avatar me-2"
                />
              </ImageViewer>
            );
          } else if (["mp3", "wav"].includes(fileType)) {
            return (
              <ImageViewer
                src={fileUrl}
                audio={true}
                image={false}
                downloadIcon={true}
                href={fileUrl}
              >
                <img
                  src="https://www.freeiconspng.com/thumbs/sound-png/sound-png-3.png"
                  alt="Audio thumbnail"
                  className="avatar me-2"
                />
              </ImageViewer>
            );
          } else if (fileType === "pdf") {
            return (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <BsFilePdf size={24} />
              </a>
            );
          } else if (["txt", "doc", "docx"].includes(fileType)) {
            return (
              <a href={fileUrl} target="_blank" rel="noreferrer">
                {fileType === "txt" ? (
                  <BsFileText size={24} style={{ color: "green" }} />
                ) : (
                  <BsFileWord size={24} />
                )}
              </a>
            );
          } else {
            return <span>Unsupported File Type</span>;
          }
        },
      }),

      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/Tutorials/create/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllTutorialData();
  }, [search, pageNo, pageSize, tutorialTypeId]);

  return (
    <>
      <Helmet>
        <title>Tutorials · CMS Electricals</title>
      </Helmet>

      <FilterSelect
        data={[
          {
            id: tutorialTypeId,
            setId: setAllTutorialTypeId,
            title: "Tutorial Type",
            data: [
              { label: "video", value: "video" },
              { label: "audio", value: "audio" },
              { label: "text", value: "text" },
              { label: "pdf", value: "pdf" },
              { label: "image", value: "image" },
            ],
          },
        ]}
      />

      <CustomTable
        id="tutorials"
        isLoading={isLoading}
        rows={rows}
        columns={columns}
        align="bottom"
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              title: "Create",
              to: `/Tutorials/create/new`,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <TvMinimalPlay /> <strong>All Tutorials</strong>
          </div>
        }
        defaultVisible={{
          description: false,
        }}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default Tutorials;
