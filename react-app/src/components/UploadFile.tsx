import { useMediaQuery } from "react-responsive";
import { ChangeEvent, useState } from "react";

// * VK: Significant for the backend area. Please exercise caution when making alterations
import { fetchWithRefreshAuth } from "../fetchScripts/fetchWithRefreshAuth";

// * VK: Defining the interface for props
interface UploadFilesProps {
  orderId: number;
  clientEmail?: string;
  isDisabled?: boolean;
}

export default function UploadFiles(props: UploadFilesProps) {
  const orderId = props.orderId;
  const clientEmail = props.clientEmail;


  const isMobileScreen = useMediaQuery({ query: "(max-width: 1160px" });
  const isPhoneScreen = useMediaQuery({ query: "(max-width: 760px" });
  const [numPages, setNumPages]: any = useState();
  const onPagesChange: any = (e: ChangeEvent<HTMLInputElement>) => {
    const numPages = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    setNumPages(numPages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
  
      uploadProcessedFile(files, orderId, clientEmail);
    }
  };

  async function uploadProcessedFile(files: any, orderId: any, clientEmail: any) {
    const formData = new FormData();
    console.log("files ", files);

    formData.append('orderId', orderId);
    formData.append('clientEmail', clientEmail);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
  
    try {
      const response = await fetchWithRefreshAuth('/api/uploadProcessedFile', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          className={`file-upload dashboard ${props.isDisabled ? 'disabled' : ''}`}
          style={{ width: "80px", height: "33px" }}
        >
          <label>
            <input
              type="file"
              name="fileToUpload"
              id="fileToUpload"
              accept=".doc, .docx, .rtf, .pdf, .odt"
              onChange={handleFileChange}
              disabled={props.isDisabled}
              multiple
            />
            <span>Upload files</span>
          </label>
        </div>
      </div>
    </>
  );
  
}
