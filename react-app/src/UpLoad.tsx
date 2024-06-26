import { useMediaQuery } from "react-responsive";
import Footer from "./components/footer/footer";
import { useContext, useState } from "react";
import FileUploader from "./components/fileUploader/fileUploader";
import HeaderMenu from "./components/header/header";
import { SignedInContext, SignedUpContext } from "./App";

export default function UpLoad({
  onSignIn,
  onSignUp,
  handleSignIn,
  handleSignUp,
  modalIsOpen,
  setIsOpen,
}: any) {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 1160px" });
  const isPhoneScreen = useMediaQuery({ query: "(max-width: 760px" });
  const signedIn = useContext(SignedInContext);
  const signedUp = useContext(SignedUpContext);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    //logic ...
  };

  return (
    <>
      <div className="app">
        <HeaderMenu
          kind="short"
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          setUserProfileData={undefined}
        />
        <div className="FileUpload_picture">Upload Files</div>
        <section className="main-content">
          <div className="row">
            <h2>Upload files</h2>
            <p>File extensions allowed: .doc, .docx, .rtf, .pdf, .odt, .txt</p>
            <form onSubmit={handleSubmit}>
              <FileUploader
                setIsOpen={setIsOpen}
                handleSignIn={handleSignIn}
                handleSignUp={handleSignUp}
                modalIsOpen={modalIsOpen}
              />
            </form>
          </div>
        </section>
      </div>
      <Footer kind={"short"} />
    </>
  );
}
