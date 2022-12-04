import React, { useState } from "react";
import Modal from "./Modal";
import { AiOutlineFile } from "react-icons/ai";
import Loader from "./Loader";

function GistList(props) {
  const [showModal, setShowModal] = useState(false);
  const [fileContent, setFileContent] = useState("");

  const { gists } = props;

  const handleFileClick = content => {
    setShowModal(true);
    setFileContent(content);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFileContent("");
  };

  return (
    <>
      {showModal && <Modal content={fileContent} handleCloseModal={handleCloseModal} />}
      <div className="gists-container">
        {gists?.map(gist => {
          const fileTypes = Object.keys(gist.files).map(key => {
            return {
              filename: gist.files[key].filename,
              language: gist.files[key].language,
              content: gist.files[key].content,
            };
          });

          return (
            <div key={gist.id} className="gist-container">
              <h1>Gist {gist.id}</h1>

              <div className="gist-row gist-tags">
                {fileTypes.map((file, index) => {
                  return (
                    <div key={index} className="tag" onClick={() => handleFileClick(file.content)}>
                      <AiOutlineFile />
                      <span>{file.filename}</span>
                      {file.language && <span>({file.language})</span>}
                    </div>
                  );
                })}
              </div>

              <div className="gist-row">
                {gist.forks.length === 0 ? (
                  <p>No one forked this gist 😢</p>
                ) : (
                  <p style={{ marginBottom: ".5rem" }}>Last forks</p>
                )}

                <div className="forks">
                  {gist.forks
                    ?.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
                    .slice(0, 3)
                    .map(fork => {
                      return (
                        <div key={fork.id} className="fork">
                          <img src={fork.user.avatar_url} alt="Avatar" />
                          <p>{fork.user.login}</p> - <p>{new Date(fork.created_at).toLocaleDateString()}</p>
                          <p>{new Date(fork.created_at).toLocaleTimeString()}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}

        {gists?.length === 0 && <p className="msg">{props.message}</p>}

        {props.canGetMore && (
          <div className="input-container" onClick={props.getNextGists}>
            {props.loading && (
              <div className="loader-container">
                <Loader />
              </div>
            )}

            <div className="input-submit">Get next gists</div>
          </div>
        )}
      </div>
    </>
  );
}

export default GistList;
