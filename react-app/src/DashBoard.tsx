import { useEffect, useState } from "react";
import Footer from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getRegistredUserData } from "./fetchScripts/getUserDataForDashboard";
import { sendHandleOrderRequest } from "./fetchScripts/handleOrderRequest";
import { fetchWithRefreshAuth } from "./fetchScripts/fetchWithRefreshAuth";

import Button from "./components/Button";
import ModalWindow from "./components/modal/modal";
import { Link } from "react-router-dom";
import SignUpForm from "./components/modal/SignUpForm";
import DownLoadFile from "./components/DownloadFile";
import ChangeProfileForm from "./components/modal/ChangeProfileForm";

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
  const [userDataForDashboard, setUserDataForDashboard] = useState<any | null>(
    null
  );

  useEffect(() => {
    const requestData = async () => {
      try {
        // Запрос комбинированных данных о пользователе при загрузке компонента
        const serverAnswer = await getRegistredUserData();
        console.log(serverAnswer);
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

  async function handleOrder(orderId: string, points_cost: string) {
    //How pass order_id to server handle with order?
    const serverAnswer = await sendHandleOrderRequest(orderId, points_cost);

    let answer = serverAnswer.message === "Low balance" ? true : false;

    const index = userDataForDashboard.data.fileData.findIndex(
      (e: any) => e.order_id === orderId
    );

    userDataForDashboard.data.fileData[index] = {
      ...userDataForDashboard.data.fileData[index],
      order_status: "paid",
    };

    //console.log(userDataForDashboard);
    setUserDataForDashboard(userDataForDashboard);
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function downloadProcessedFile(fileName: string) {
    console.log(fileName);
    let pathToFile = "/api/downloadProcessedFile/" + fileName;

    // Используем fetchWithRetry вместо прямого вызова fetch
    fetchWithRefreshAuth(pathToFile, {
        method: "GET",
        headers: {
            "Content-Type": "application/pdf",
        },
    })
    .then((response: { ok: any; blob: () => any; }) => {
        if (!response.ok) {
            throw new Error("Server returned an error response");
        }
        return response.blob();
    })
    .then((blob: BlobPart) => {
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // Устанавливаем атрибут download для тега <a>

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Удаляем ссылку после клика
    })
    .catch((error: any) => {
        console.error('Ошибка:', error);
    });
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
                        ? userDataForDashboard.data.userData[0].username
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
              <div className="row">
                <p>Credit points</p>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Credit points</td>
                      <td>
                        {userDataForDashboard
                          ? userDataForDashboard.data.userData[0].points
                          : 0}
                      </td>
                      <td>
                        <Link className="nav__link nav__text" to="/BuyCredits">
                          <Button
                            children={"Buy credits"}
                            color={"orange"}
                            style="table-btn"
                            onClick={() => ""}
                          />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-6 rightColumn">
              <p>Recent transactions</p>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Transaction</td>
                    <td>Date</td>
                    <td>Status</td>
                    <td>Cost in credits</td>
                  </tr>

                  {userDataForDashboard
                    ? userDataForDashboard.data.paymentsData.map((e: any) => (
                        <tr>
                          <td>
                            {userDataForDashboard
                              ? e.paypal_seller_transaction_id
                              : ""}
                          </td>
                          <td>
                            {userDataForDashboard
                              ? e.created_at.toLocaleString().split("T")[0]
                              : ""}
                          </td>
                          <td>{userDataForDashboard ? e.status : ""}</td>
                          <td>{userDataForDashboard ? e.amount : ""}</td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <p>Recent orders</p>
            <table className="table dashboard-table">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>Status</td>
                  <td>Price in credits</td>
                  <td>Date</td>
                  <td>Manage</td>
                  <td>Download</td>
                </tr>
                {userDataForDashboard
                  ? userDataForDashboard.data.fileData
                      .slice(-50, userDataForDashboard.data.fileData.length)
                      .sort((a: any, b: any) =>
                        a.created_at.date > b.created_at.date ? 1 : -1
                      )
                      .map((e: any) => (
                        <tr>
                          <td>{userDataForDashboard ? e.original_name : ""}</td>
                          <td>{userDataForDashboard ? e.order_status : ""}</td>
                          <td>{userDataForDashboard ? e.points_cost : ""}</td>
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
                            {e.order_status === "pending" ? (
                              e.points_cost <
                              userDataForDashboard.data.userData[0].points ? (
                                <Button
                                  children={"Start processing"}
                                  color={"orange"}
                                  style={"table-btn"}
                                  disable={true}
                                  onClick={() => {
                                    handleOrder(e.order_id, e.points_cost);
                                  }}
                                />
                              ) : (
                                <>
                                  <a>Not enough credits</a>
                                </>
                              )
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>
                            {e.order_status !== "pending" ? (
                              e.completed ? (
                                <Button
                                  children={"Download"}
                                  color={"orange"}
                                  style={"table-btn"}
                                  onClick={() =>
                                    downloadProcessedFile(e.processed_file)
                                  }
                                />
                              ) : (
                                "Not completed"
                              )
                            ) : (
                              <></>
                            )}
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
