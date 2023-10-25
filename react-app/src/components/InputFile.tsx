import { UrlBuilder } from "@bytescale/sdk";
import { UploadButton } from "@bytescale/upload-widget-react";
import { useState } from "react";

const InputFiles = ({ files, setFiles }: any) => {
  // ---------------------------
  // Configuration
  // See: https://www.bytescale.com/docs/upload-widget#configuration
  // ---------------------------
  const options = {
    apiKey: "free", // Get API keys from: www.bytescale.com
    maxFileCount: 5,
    styles: {
      colors: {
        primary: "#377dff",
      },
    },
  };
  console.log(files[0]);
  /* const [files, setFiles] = useState([]); */

  // --------------------------
  // Create an upload button...
  // --------------------------

  const MyUploadButton = ({ setFiles }: any) => (
    <UploadButton options={options} onComplete={setFiles}>
      {({ onClick }) => <button onClick={onClick}>Upload a file...</button>}
    </UploadButton>
  );

  // -----------------------------
  // Display the uploaded files...
  // -----------------------------

  const MyUploadedFiles = ({ files }: any) =>
    files.map((file: any) => {
      // Save 'filePath' to your DB, and construct URLs using UrlBuilder:
      const { filePath, accountId } = file;
      // Build an image transformation URL for the uploaded file.
      // Remove 'options' to get the URL to the original file:
      const fileUrl = UrlBuilder.url({
        filePath,
        accountId,
        options: {
          transformation: "preset",
          transformationPreset: "thumbnail",
        },
      });
      return (
        <p key={fileUrl}>
          <a href={fileUrl} target="_blank">
            {fileUrl}
          </a>
        </p>
      );
    });

  // ----------------------
  // Run the application...
  // ----------------------

  return (
    <>
      {files.length ? (
        {
          /* <MyUploadedFiles files={files} /> */
        }
      ) : (
        <MyUploadButton setFiles={setFiles} />
      )}
      {/* <a
        className="developed_by"
        href="https://www.bytescale.com/docs/upload-widget/react"
        target="_blank"
      >
        Powered by Bytescale
      </a> */}
    </>
  );
};

export default InputFiles;
