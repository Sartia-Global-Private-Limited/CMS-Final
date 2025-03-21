import React from "react";

const ViewTutorial = () => {
  return (
    <Row className="g-3 tutorial">
      {isLoading ? (
        <div className="text-center">
          <img
            className="p-3"
            width="350"
            src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
            alt="Loading"
          />
        </div>
      ) : tutorial.length > 0 ? (
        <>
          {tutorial.map((tutorialData, index) => (
            <Col key={index} md={4}>
              <MyCard>
                <div className="mb-3">
                  <ActionButton
                    hideEye={"d-none"}
                    editOnclick={() => handleEdit(tutorialData)}
                    deleteOnclick={() => {
                      setIdToDelete(tutorialData.id);
                      setShowAlert(true);
                    }}
                  />
                </div>
                <div className="object-fit bg-new-re p-2">
                  {tutorialData.tutorial_format === "video" ||
                  tutorialData.tutorial_format === "audio" ? (
                    <video
                      controls
                      autoPlay={false}
                      width="250"
                      height={130}
                      poster={`${
                        tutorialData.tutorial_format === "audio"
                          ? "https://www.freeiconspng.com/thumbs/sound-png/sound-png-3.png"
                          : "/assets/images/video-logo.png"
                      }`}
                    >
                      <source
                        src={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                        type="video/mp4"
                      />
                    </video>
                  ) : null}

                  {tutorialData.tutorial_format === "pdf" ? (
                    <a
                      href={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                      download={true}
                    >
                      <Card.Img
                        width={200}
                        height={130}
                        className="object-fit"
                        src={`/assets/images/pdf.jpg`}
                      />
                    </a>
                  ) : null}

                  {tutorialData.tutorial_format === "docs" ||
                  tutorialData.tutorial_format === "text" ? (
                    <a
                      href={`${process.env.REACT_APP_API_URL}${tutorialData.attachment}`}
                      download={true}
                    >
                      <Card.Img
                        width={200}
                        height={130}
                        className="object-fit"
                        src={`/assets/images/docs.png`}
                      />
                    </a>
                  ) : null}
                </div>
                <div className="d-flex my-2 justify-content-between">
                  <span>{tutorialData.tutorial_format}</span>
                  <small className="text-gray">
                    ({tutorialData.module_type}/{tutorialData.application_type})
                  </small>
                </div>
                <p className="small mb-0 text-truncate2 line-clamp-2">
                  {tutorialData.description}
                </p>
              </MyCard>
            </Col>
          ))}
        </>
      ) : (
        <div className="text-center">
          <img
            className="p-3"
            alt="no-result"
            width="350"
            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
          />
        </div>
      )}
    </Row>
  );
};

export default ViewTutorial;
