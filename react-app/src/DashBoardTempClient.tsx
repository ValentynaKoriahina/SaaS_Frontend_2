import { Key, useEffect, useState } from "react";
import Footer from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getTempUserData } from "./fetchScripts/getUserDataForDashboard";
import { fetchWithRefreshAuth } from "./fetchScripts/fetchWithRefreshAuth";

import Button from "./components/Button";
import ModalWindow from "./components/modal/modal";
import { Link, useLocation } from "react-router-dom";
import ChangeProfileForm from "./components/modal/ChangeProfileForm";
import DashboardTooltip from "./components/DashboardTooltip";
import Inbox from "./components/Inbox";



export default function Dashboard({
  kind,
  onSignIn,
  handleSignIn,
  modalIsOpen,
  setIsOpen,
  onSignUp,
  handleSignUp,
  setUserProfileData,
}: any) {
  // * ↓ VK: Significant for the backend area. Please exercise caution when making alterations
  const [userDataForDashboard, setUserDataForDashboard] = useState<any | null>(null);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");

    const requestData = async () => {
      try {
        const serverAnswer = await getTempUserData(orderId);
        console.log(serverAnswer);
        setUserDataForDashboard(serverAnswer.data);
        console.log(userDataForDashboard)
      } catch (error) {
        console.error("An error occurred while loading data:", error);
      }
    };

    if (!userDataForDashboard) {
      requestData();
    }
  }, []);


  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function downloadProcessedFile(orderId: any) {
    let pathToFile = "/api/downloadProcessedFile/" + orderId;
    fetchWithRefreshAuth(pathToFile, {
      method: "GET",
      headers: {
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server returned an error response");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create URL for downloading the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Specify the name of the file to download
        a.download = orderId + '.zip';
        document.body.appendChild(a);
        a.click();
        // Clearing the link
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  }


  interface FileData {
    original_name: string;
  }

  interface FileListProps {
    files: FileData[];
  }

  const FileList: React.FC<FileListProps> = ({ files }) => {
    return (
      <div>
        <p>File List</p>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.original_name}</li>
          ))}
        </ul>
      </div>
    );
  }

  const AddInstructions: React.FC<FileListProps> = () => {
    return (
      <div>
        <p>Your additional instructions</p>
        <q>{userDataForDashboard.orderData.add_information}</q>

        <ul>
          {userDataForDashboard.userGuides.map((guide: string, index: Key | null | undefined) => (
            <li key={index}>{guide}</li>
          ))}
        </ul>
      </div>
    );
  }
  // * ↑ VK: Significant for the backend area. Please exercise caution when making alterations

  return (
    <>
      <div className="app">
        <HeaderMenu
          kind={kind}
          onSignIn={onSignIn}
          handleSignIn={handleSignIn}
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          onSignUp={onSignUp}
          setUserProfileData={setUserProfileData}
          handleSignUp={handleSignUp}
        />
        <section className="main-content flex-column">
          <div className="row">
            <h2>Dashboard Panel</h2>
          </div>
          <div className="row">
            <div className="col-md-6 leftColumn" id="leftColumn">
              <p>Profile info</p>
              <table className="table">
                <tbody>
                  <tr>
                    <td>User name</td>
                    <td>
                      {userDataForDashboard
                        ? userDataForDashboard.userData.username
                        : 0}
                    </td>
                    <td>
                      <ModalWindow
                        title={"Change"}
                        childComp={
                          <ChangeProfileForm
                            onSignUp={handleSignUp}
                            onCloseModal={closeModal}
                            userDataForDashboard={userDataForDashboard}
                            setUserProfileData={setUserProfileData}
                          />
                        }
                        modalIsOpen={modalIsOpen}
                        openModal={openModal}
                        closeModal={closeModal}
                        btnModalStyle="table-btn"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6 rightColumn">
              <p>Payment information</p>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Transaction</td>
                    <td>Date</td>
                    <td>Status</td>
                    <td>Sum $</td>
                  </tr>

                  {userDataForDashboard ? (
                    <tr>
                      <td>
                        {userDataForDashboard
                          ? userDataForDashboard.paymentsData.paypal_seller_transaction_id
                          : ""}
                      </td>
                      <td>
                        {userDataForDashboard
                          ? userDataForDashboard.paymentsData.payment_created_at.toLocaleString().split("T")[0]
                          : ""}
                      </td>
                      <td>{userDataForDashboard ? userDataForDashboard.paymentsData.payment_status : ""}</td>
                      <td>{userDataForDashboard ? userDataForDashboard.paymentsData.payment_amount : ""}</td>
                    </tr>
                  )
                    : ""}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <p>Order information</p>
            <table className="table dashboard-table">
              <tbody>
                <tr>
                  <td>Order ID</td>
                  <td>Status</td>
                  <td>Date</td>
                  <td>Download</td>
                </tr>
                {userDataForDashboard ? (
                  <tr>
                    <td>{userDataForDashboard ? userDataForDashboard.orderData.order_id : ""}</td>
                    <td>
                      {userDataForDashboard ? userDataForDashboard.orderData.order_status : ""}
                      <DashboardTooltip title={userDataForDashboard.orderData.order_status_notes} />
                    </td>

                    <td>
                      {userDataForDashboard
                        ? userDataForDashboard.orderData.created_at.toString().split("T")[0] +
                        " " +
                        userDataForDashboard.orderData.created_at
                          .toString()
                          .split("T")[1]
                          .split(".")[0]
                        : ""}
                    </td>
                    <td>
                      {userDataForDashboard.orderData.order_status == "processed" ?
                        (
                          <Button
                            children={"Download"}
                            color={"orange"}
                            style={"table-btn"}
                            onClick={() =>
                              downloadProcessedFile(userDataForDashboard.orderData.order_id)
                            }
                          />
                        ) : (
                          "Not completed"
                        )
                      }
                    </td>
                  </tr>
                )
                  : ""}
              </tbody>
            </table>
            {/* VK: Add FileList component with file list passing */}
            {userDataForDashboard && <FileList files={userDataForDashboard.filesData} />}
            {/* VK: Add AddInstructions component with other info */}
            {userDataForDashboard && <AddInstructions files={userDataForDashboard.filesData} />}
            <p>Messages to editor</p>
            {userDataForDashboard &&
              <Inbox
                senderId={userDataForDashboard.userData.user_id}
                userRole={localStorage.getItem('userRole')}
                receiverId={userDataForDashboard.orderData.editor_id}
                orderId={userDataForDashboard.orderData.order_id}
                messages={userDataForDashboard.messages}
              />
            }
          </div>
        </section>
      </div>
      <Footer kind="short" />
    </>
  );
}
