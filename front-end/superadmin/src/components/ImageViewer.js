import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { BsDownload, BsXLg } from "react-icons/bs";

const ImageViewer = ({
  children,
  src,
  video = false,
  audio = false,
  poster,
  textAlign = "center",
  image = true,
  downloadIcon,
  href,
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <span
        style={{ textAlign: textAlign }}
        onClick={() => setShow(true)}
        className="cursor-pointer"
      >
        {children}
      </span>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static"
        dialogClassName="modal-dialog modal-dialog-centered"
        size="lg"
      >
        <Modal.Header className="border-0">
          <Button
            variant="link"
            className="position-absolute top-0 end-0 p-2"
            onClick={() => setShow(false)}
          >
            <BsXLg className="text-danger" size={20} />
          </Button>

          {/* Video Player */}
          {video && (
            <video
              controls
              autoPlay
              style={{
                maxWidth: "80%",
                height: "60%",
                objectFit: "contain",
              }}
              poster={poster}
            >
              <source src={src} type="video/mp4" />
            </video>
          )}

          {/* Audio Player */}
          {audio && (
            <audio
              controls
              autoPlay
              style={{
                width: "80%",
              }}
            >
              <source src={src} type="audio/mp3" />
            </audio>
          )}

          {/* Image Viewer */}
          {image && !audio && !video && (
            <img
              src={src}
              style={{
                maxWidth: "100%",
                height: "400px",
                objectFit: "cover",
              }}
              alt="view"
            />
          )}
        </Modal.Header>

        {/* Download Icon */}
        {downloadIcon && (
          <Modal.Footer className="border-0 d-flex justify-content-end">
            <a href={href} download>
              <Button variant="success">
                <BsDownload className="text-white" />
              </Button>
            </a>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default ImageViewer;
