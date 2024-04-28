import { useEffect, useState } from "react";
import Footer from "./components/footer/footer";
import HeaderMenu from "./components/header/header";

import Inbox from "./components/Inbox";

// * VK: Significant for the backend area. Please exercise caution when making alterations
import { getMessages } from "./fetchScripts/getUserDataForDashboard";

import { fetchWithRefreshAuth } from "./fetchScripts/fetchWithRefreshAuth";
import { useParams } from "react-router-dom";

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


  if (!messages) {
    return null;
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

