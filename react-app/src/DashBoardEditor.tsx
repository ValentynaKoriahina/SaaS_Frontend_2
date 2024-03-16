import React, { useState, useEffect } from "react";
import Footer from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
import Button from "./components/Button";
import ModalWindow from "./components/modal/modal";
import InputText from "./components/InputText";
import DownLoadFile from "./components/DownloadFile";
import ChangeProfileForm from "./components/modal/ChangeProfileForm";
import UploadFiles from "./components/UploadFile";
import Inbox from "./components/Inbox";

// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getRegistredUserData } from "./fetchScripts/getUserDataForDashboard";
import { fetchWithRefreshAuth } from "./fetchScripts/fetchWithRefreshAuth";

export default function DashBoardEditor({
  kind,
  onSignIn,
  handleSignIn,
  modalIsOpen,
  setIsOpen,
  onSignUp,
  handleSignUp,
  setUserProfileData,
}: any) {
  const [userDataForDashboard, setUserDataForDashboard] = useState<any | null>(
    null
  );
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const requestData = async () => {
      try {
        const serverAnswer = await getRegistredUserData();
        setUserDataForDashboard(serverAnswer);
      } catch (error) {
        console.error("An error occurred while loading data:", error);
      }
    };

    requestData();
  }, []);

  function toggleOrderDetails(orderId: React.SetStateAction<null>) {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  }

  async function handleOrder(orderId: any, editorId: any) {
    const orderId2 = orderId;
    const editorId2 = editorId;

    try {
      const response = await fetchWithRefreshAuth(
        `/api/assignOrder?editorId=${editorId2}&orderId=${orderId2}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const index = userDataForDashboard.data.unassignedOrders.findIndex(
        (e: any) => e.order_id === orderId
      );

      userDataForDashboard.data.unassignedOrders[index] = {
        ...userDataForDashboard.data.unassignedOrders[index],
        assigned_editor_id: editorId,
      };

      setUserDataForDashboard(userDataForDashboard);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }

  function downloadClientGuides(orderId: any) {
    let pathToFile = "/api/downloadClientGuides/" + orderId;
    fetchWithRefreshAuth(pathToFile, {
      method: 'GET',
      headers: {
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Server returned an error response');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = orderId + '-Guides.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function handleNotes(orderId: string) {
    const index = userDataForDashboard.data.orderData.findIndex(
      (e: any) => e.order_id === orderId
    );

    userDataForDashboard.data.orderData[index] = {
      ...userDataForDashboard.data.orderData[index],
      add_information: "",
    };

    setUserDataForDashboard(userDataForDashboard);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
            <h2>Editor Dashboard Panel</h2>
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
                        ? userDataForDashboard.data.userData[0].username
                        : 0}
                    </td>
                    <td>
                      <ModalWindow
                        title={"Change profile data"}
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
          </div>
          <div className="row">
            <p>Table of orders</p>
            <table className="table dashboard-table">
              <tbody>
                <tr>
                  <td style={{ minWidth: "7vw" }}>Order #</td>
                  <td>Pages</td>
                  <td>Client name</td>
                  <td>Date</td>
                  <td>Delivery time</td>
                  <td>Manage</td>
                  <td>Status</td>
                  <td>Download file</td>
                  <td>Upload Edited File</td>
                  <td>Notes or Flag to manager</td>
                </tr>
                {userDataForDashboard &&
                  userDataForDashboard.data.orderData
                    .slice(-10, userDataForDashboard.data.orderData.length)
                    .sort((a: any, b: any) =>
                      a.created_at.date > b.created_at.date ? 1 : -1
                    )
                    .map((e: any) => (
                      <React.Fragment key={e.order_id}>
                        <tr>
                          <td onClick={() => toggleOrderDetails(e.order_id)}>
                            {expandedOrderId === e.order_id ? "▲" : "▼"}{" "}
                            {/* Стрелка */}
                            {userDataForDashboard ? e.order_id : ""}
                          </td>
                          <td>
                            {userDataForDashboard ? e.number_of_pages : ""}
                          </td>
                          <td>{userDataForDashboard ? e.client_name : ""}</td>
                          <td>
                            {userDataForDashboard
                              ? e.created_at.toString().split("T")[0] +
                              " " +
                              e.created_at
                                .toString()
                                .split("T")[1]
                                .split(".")[0]
                              : ""}
                          </td>
                          <td>{userDataForDashboard ? e.delivery_time : ""}</td>
                          <td>
                            {!e.assigned_editor_id ? (
                              e.order_status === "paid" ? (
                                <Button
                                  children={"Assign to me"}
                                  color={"orange"}
                                  style={"table-btn"}
                                  onClick={() =>
                                    handleOrder(
                                      e.order_id,
                                      userDataForDashboard.data.userData[0].id
                                    )
                                  }
                                />
                              ) : (
                                <></>
                              )
                            ) : (
                              <>
                                <a>assigned</a>
                              </>
                            )}
                          </td>
                          <td>{userDataForDashboard ? e.order_status : ""}</td>
                          <td>
                            {[
                              "pending",
                              "paid",
                              "processed",
                              "in work",
                            ].includes(e.order_status) ? (
                              <DownLoadFile orderId={e.order_id} />
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>
                            {e.order_status === "in work" ? (
                              <UploadFiles
                                orderId={e.order_id}
                                clientEmail={e.client_email}
                              />
                            ) : (
                              <UploadFiles orderId={e.order_id} isDisabled />
                            )}
                          </td>
                          <td style={{ minWidth: "20vw" }}>
                            {
                              <InputText
                                order_id={e.order_id}
                                onChange={() => handleNotes(e.order_id)}
                                userDataForDashboard={userDataForDashboard}
                                setUserDataForDashboard={
                                  setUserDataForDashboard
                                }
                              />
                            }
                          </td>
                        </tr>
                        {expandedOrderId === e.order_id && (
                          <tr>
                            <td colSpan={10}>
                              <p><b>Service type:</b> {e.service_type} </p>
                              {e.add_information ? <p><b>Additional information:</b> {e.add_information} </p> : null}
                              {e.user_guides ? <p><a href="#" onClick={() => downloadClientGuides(e.order_id)}>Download instructions for work</a></p> : null}
                              <p><b>Client info:</b></p>
                              <p><b>Email:</b> {e.client_email} </p>
                              <p><b>Company:</b> {e.clients_company_name} </p>
                              <p><b>Address:</b> {e.clients_company_address} </p>
                              <p><b>Industry:</b> {e.clients_company_industry} </p>
                              <p><b>Contract info:</b></p>
                              <p><b>Description</b> {e.contract_description} </p>
                              <p><b>Value:</b> {e.contract_value} </p>
                              <p><b>Counterparty name:</b> {e.counterparty_name} </p>
                              <p><b>Counterparty address:</b> {e.counterparty_address} </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* {userDataForDashboard && 
              // <Inbox
              //   userId={userDataForDashboard?.data.userData[0].id}
              //   userRole={localStorage.getItem('userRole')}
              //   editorId={1}
              // />
            } */}
      </div>
      <Footer kind="short" />
    </>
  );
}
