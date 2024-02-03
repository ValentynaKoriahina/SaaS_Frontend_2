import { useEffect, useState } from "react";

import { Footer } from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getUserDataForDashboard } from "./components/scripts/getUserDataForDashboard";
import { sendHandleOrderRequest } from "./components/scripts/handleOrderRequest";

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
        const serverAnswer = await getUserDataForDashboard();
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

    alert(serverAnswer.message);

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

  async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }

    let response = await fetch(url, options);

    // Проверка на статус 401 и условия для повторного запроса
    if (response.status === 401) {
      const isRetrySuccess = await retryAuth();
      if (isRetrySuccess) {
        // options.headers!['_isRetry'] = true; // !Пометка, что запрос повторяется
        response = await fetch(url, options); // Повторный запрос с обновленным токеном
      }
    }

    return response;
  }
  
  // Функция для повторной аутентификации и обновления токена
  async function retryAuth(): Promise<boolean> {
    try {
      const response = await fetch(`/api/refresh`, {
        method: 'GET',
        credentials: 'include', // withCredentials: true в Axios
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // Обновление токена в хранилище
        return true;
      }
      console.log('НЕ АВТОРИЗОВАН');
      return false;
    } catch (error) {
      console.error('Ошибка при обновлении токена', error);
      return false;
    }
  }

  function downloadProcessedFile(fileName: string): void {
    console.log(fileName);
    let pathToFile = `/api/downloadProcessedFile/${fileName}`;

    // Используем fetchWithRetry вместо прямого вызова fetch
    fetchWithRetry(pathToFile, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Server returned an error response");
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // Установите атрибут download для указания имени файла
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Удалите link после клика
      })
      .catch(error => console.error('Ошибка:', error));
  }


  // function fetchWithToken(url: string, options: RequestInit = {}): Promise<Response> {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (accessToken) {
  //     options.headers = {
  //       ...options.headers,
  //       'Authorization': `Bearer ${accessToken}`
  //     };
  //   }
  //   return fetch(url, options);
  // }

  // function downloadProcessedFile(fileName: string): void {
  //   console.log(fileName);
  //   let pathToFile = `/api/downloadProcessedFile/${fileName}`;

  //   fetchWithToken(pathToFile, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/pdf",
  //     },
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("Server returned an error response");
  //       }
  //       return response.blob();
  //     })
  //     .then(blob => {
  //       const url = window.URL.createObjectURL(new Blob([blob]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", fileName); // Установите атрибут download для указания имени файла
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link); // Удалите link после клика
  //     })
  //     .catch(error => console.error('Ошибка:', error));
  // }

  // function downloadProcessedFile(fileName: any) {
  //   console.log(fileName);

  //   let pathToFile = "/api/downloadProcessedFile/" + fileName;
  //   fetch(pathToFile, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/pdf",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Server returned an error response");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(new Blob([blob]));

  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = fileName;

  //       document.body.appendChild(link);

  //       link.click();

  //       if (link.parentNode) {
  //         link.parentNode.removeChild(link);
  //       }
  //     });
  // }

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
