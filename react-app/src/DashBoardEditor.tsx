import { useEffect, useState } from "react";

import { Footer } from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getUserDataForDashboard } from "./components/scripts/getUserDataForDashboard";
import { sendHandleOrderRequest } from "./components/scripts/handleOrderRequest";
import Button from "./components/Button";
import ModalWindow from "./components/modal/modal";
import InputText from "./components/InputText";
import DownLoadFile from "./components/DownloadFile";
import ChangeProfileForm from "./components/modal/ChangeProfileForm";
import UploadFiles from "./components/UploadFile";

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
  // * ↓ VK: Significant for the backend area. Please exercise caution when making alterations
  const [userDataForDashboard, setUserDataForDashboard] = useState<any | null>(
    null
  );

  useEffect(() => {
    const requestData = async () => {
      try {
        // Запрос комбинированных данных о пользователе при загрузке компонента
        const serverAnswer = await getUserDataForDashboard();
        setUserDataForDashboard(serverAnswer); // Сохраняем данные в состоянии
      } catch (error) {
        console.error("An error occurred while loading data:", error);
      }
    };

    requestData(); // Вызываем асинхронную функцию внутри useEffect
  }, []);

  // Проверка наличия данных перед обработкой
  if (userDataForDashboard !== null && userDataForDashboard !== undefined) {
    console.log("userDataForDashboard", userDataForDashboard);
  }

  async function handleOrder(orderId: any, editorId: any) {
    //How pass editor_id to server handle with order?

    const orderId2 = orderId;
    const editorId2 = editorId;

    try {
      const response = await fetch(
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

      //console.log(userDataForDashboard);
      setUserDataForDashboard(userDataForDashboard);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }

  async function handleNotes(orderId: string) {
    //How pass order_id to server handle with order?
    //const serverAnswer = await sendHandleOrderRequest(orderId);
    //alert(serverAnswer.message);

    const index = userDataForDashboard.data.orderData.findIndex(
      (e: any) => e.order_id === orderId
    );

    userDataForDashboard.data.orderData[index] = {
      ...userDataForDashboard.data.orderData[index],
      add_information: "",
    };

    setUserDataForDashboard(userDataForDashboard);
    console.log(userDataForDashboard);
    console.log(index);
    console.log("add_information");
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  // * ↑ VK: Significant for the backend area. Please exercise caution when making alterations
  //const [addInformation, setAddInformation] = useState("Add information");
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
                  <td style={{ minWidth: "7vw" }}>File name</td>
                  <td>Pages</td>
                  <td>Client name</td>
                  <td>Date work started</td>
                  <td>Manage</td>
                  <td>Status</td>
                  <td>Download file</td>
                  <td>Upload Edited File</td>
                  <td>Notes or Flag to manager</td>
                </tr>
                {userDataForDashboard
                  ? userDataForDashboard.data.orderData
                    .slice(-10, userDataForDashboard.data.orderData.length)
                    .sort((a: any, b: any) =>
                      a.created_at.date > b.created_at.date ? 1 : -1
                    )
                    .map((e: any) => (
                      <tr key={e.order_id}>
                        <td>{userDataForDashboard ? e.original_name : ""}</td>
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
                          {
                            (['pending','paid','processed','in work'].includes(e.order_status) ? (
                              <DownLoadFile fileName={e.file_name} />
                            ) : (
                              <></>
                            ))
                          }
                        </td>
                        <td>
                          {
                            (e.order_status === "in work" ? (
                              <UploadFiles orderId={e.order_id} sourceFileName={e.file_name} />
                            ) : (
                              <UploadFiles orderId={e.order_id} sourceFileName={e.file_name} isDisabled={true} />
                            ))
                          }
                        </td>
                        <td style={{ minWidth: "30vw" }}>
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
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer kind="short" />
    </>
  );
}
