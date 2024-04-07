import { createContext, useContext, useEffect, useState } from "react";
import Footer from "./components/footer/footer";
import HeaderMenu from "./components/header/header";
import Button from "./components/Button";
import ModalWindow from "./components/modal/modal";
import Select from "react-select";
import DownLoadFile from "./components/DownloadFile";
import ChangeProfileForm from "./components/modal/ChangeProfileForm";

import Inbox from "./components/Inbox";
import { SocketContext } from "./App";

// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getRegistredUserData } from "./fetchScripts/getUserDataForDashboard";
import { getMessages } from "./fetchScripts/getUserDataForDashboard";

import { fetchWithRefreshAuth } from "./fetchScripts/fetchWithRefreshAuth";
import { useParams } from "react-router-dom";


// export default function MessagingTool({
//   kind,
//   onSignIn,
//   handleSignIn,
//   modalIsOpen,
//   setIsOpen,
//   onSignUp,
//   handleSignUp,
//   setUserProfileData,
// }: any) {
//   // * ↓ VK: Significant for the backend area. Please exercise caution when making alterations
//   const [userDataForDashboard, setUserDataForDashboard] = useState<any | null>(
//     null
//   );
//   const [editor, setEditor] = useState([]);
//   const [selectedEditor, setSelectedEditor]: any = useState(null);
//   const [options, setOptions] = useState([]);
//   const [selectOptions, setSelectedOptions]: any = useState(null);
//   const socket = useContext(SocketContext);

//   useEffect(() => {
//     console.log('socket')
//     console.log(socket)

//     const requestData = async () => {
//       try {
//         // Запрос комбинированных данных о пользователе при загрузке компонента
//         const serverAnswer = await getRegistredUserData();
//         console.log(serverAnswer);
//         setUserDataForDashboard(serverAnswer);
//         // Сохраняем данные в состоянии
//         const newOptions = serverAnswer.data.unassignedOrders
//           .filter((e: any) => e.status === "paid")
//           .map((e: any) => {
//             return { value: e.order_id, label: e.order_id };
//           });
//         setOptions(newOptions);
//       } catch (error) {
//         console.error("An error occurred: ", error);
//       }
//     };

//     requestData(); // Вызываем асинхронную функцию внутри useEffect
//   }, []);

//   // Проверка наличия данных перед обработкой
//   if (userDataForDashboard !== null && userDataForDashboard !== undefined) {
//     console.log("userDataForDashboard", userDataForDashboard);
//   }

//   function openModal() {
//     setIsOpen(true);
//   }
//   function closeModal() {
//     setIsOpen(false);
//   }

//   // * ↑ VK: Significant for the backend area. Please exercise caution when making alterations
//   return (
//     <>
//       <div className="app">
//         <HeaderMenu
//           kind={kind}
//           onSignIn={onSignIn}
//           handleSignIn={handleSignIn}
//           modalIsOpen={modalIsOpen}
//           setIsOpen={setIsOpen}
//           onSignUp={onSignUp}
//           setUserProfileData={setUserProfileData}
//           handleSignUp={handleSignUp}
//         />
//         <section className="main-content flex-column">
//           <div className="row">
//             <h2>Messaging tool</h2>
//           </div>
//           {/* <Inbox
//                 senderId={userDataForDashboard.userData.user_id}
//                 userRole={localStorage.getItem('userRole')}
//                 receiverId={userDataForDashboard.orderData.editor_id}
//                 orderId={userDataForDashboard.orderData.order_id}
//                 messages={userDataForDashboard.messages}

//               /> */}
//         </section>
//       </div>
//       <Footer kind="short" />
//     </>
//   );
// }
export default function MessagingTool({
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
  const [editor, setEditor] = useState([]);
  const [selectedEditor, setSelectedEditor]: any = useState(null);
  const [options, setOptions] = useState([]);
  const [selectOptions, setSelectedOptions]: any = useState(null);
  const socket = useContext(SocketContext);
  const { orderId, receiverId }: any = useParams();
  const [messages, setMessages] = useState<any | null>(null);

  useEffect(() => {
    const requestData = async () => {
      try {
        const serverAnswer = await getMessages(orderId);
        console.log('serverAnswer')
        console.log(serverAnswer.messages)

        setMessages(serverAnswer.messages);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    };

    requestData();
  }, []);


  // Проверка наличия данных перед обработкой
  if (!messages) {
    return null; // Если данных еще нет, вернуть null или заглушку
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
            <h2>Messaging tool</h2>
          </div>
          <Inbox
            senderId={localStorage.getItem('userId')}
            userRole={localStorage.getItem('userRole')}
            receiverId={receiverId}
            orderId={orderId}
            messages={messages}
          />
        </section>
      </div>
      <Footer kind="short" />
    </>
  );
}

