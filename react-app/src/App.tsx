import "./App.scss";
import { createContext, useEffect, useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import UpLoad from "./UpLoad";
import BuyCredits from "./BuyCredits";
import "vite/modulepreload-polyfill";
import About from "./About";
import CalculateCost from "./CalculateCost";
import DashBoard from "./DashBoard";
import { useMediaQuery } from "react-responsive";
import DashBoardEditor from "./DashBoardEditor";
import DashBoardManager from "./DashBoardManager";
import Swal from "sweetalert2";
import ResetPassword from "./ResetPassword";

import OrderRewiew from "./OrderReview";
import Contacts from "./components/footer/Contacts";
import Services from "./Services";
import { ParallaxProvider } from "react-scroll-parallax";
export const SignedInContext = createContext(false);
export const SignedUpContext = createContext(true);
export const MobileScreenContext = createContext(false);

// * VK: Significant for the backend area. Please exercise caution when making alterations
import {
  sendLogInRequest,
  sendLogOutRequest,
} from "./fetchScripts/authRequests";
import FAQs from "./FAQs";
import DashBoardTempClient from "./DashBoardTempClient";
import ContractDrafting from "./components/ContractDrafting";
import ContractAnalysis from "./components/ContractAnalysis";
import ContractReview from "./components/ContractReview";
import ContractManagment from "./components/ContractManagement";
import Resources from "./components/footer/Resources";
import Careers from "./components/footer/Careers";
import Legal from "./components/footer/Legal";
import ScrollToTop from "./components/ScrollToTop";

export function deleteCookie(name: string) {
  const date = new Date();
  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
  // Set it
  document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
}

export function handleSignOut() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  sendLogOutRequest();
}

//deleteCookie("token");

function App() {
  // const value = `; ${document.cookie}`;
  // const parts = value.split(`; token=`);
  // console.log(document.cookie);
  // console.log(parts);
  // const token =
  //   parts.length === 2 ? parts.pop()?.split(";").shift() !== null : false;

  // * VK: Changing the method of authorization verification (instead of cookies, data from local storage is used)
  const token = localStorage.getItem("accessToken") !== null ? true : false;

  const [signedIn, onSignIn] = useState(token);
  const [signedUp, onSignUp] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [serverAnswerMessage, setServerAnswerMessage] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const isMobileScreen = useMediaQuery({ query: "(max-width: 1028px" });
  /* const isPhoneScreen = useMediaQuery({ query: "(max-width: 760px" }); */
  const [userProfileData, setUserProfileData] = useState({
    userName: "user",
    userEmail: "user@example.com",
    userPhone: "+3530000000",
    userPassword: "password",
  });
  console.log(userProfileData);
  function handleSignUp() {
    onSignUp(!signedUp);
  }

  // * ↓ VK: Significant for the backend area. Please exercise caution when making alterations

  async function handleSignIn(userData: {
    username: string;
    password: string;
  }) {
    // * VK: userData contains the username and password from the form
    const answer: any = await sendLogInRequest(userData);

    if (answer.HTTP_status === 200) {
      // * VK: Logic in case of successful authorization
      localStorage.setItem("accessToken", "valid");
      localStorage.setItem("userRole", answer.userRole);
      setUserRole(answer.userRole);
      // console.log('Server response OK:', data);
      //alert(answer.message);
      Swal.fire({
        title: "Good job!",
        text: `${answer.message}!`,
        icon: "success",
      });
      // Previous code that was executed after LogIn and the call of the handleSignIn function
      onSignIn(!signedIn);
      // Transmit data to close a modal window
      setIsOpen(!modalIsOpen);
    } else {
      // Logic in case of unsuccessful authorization
      // console.log('Server response NOT OK:', data);
      if (answer.HTTP_status === 400) {
        // TODO VK: дополнить логику на случай неуспешной авторизации
        //alert(answer.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${answer.message}`,
        });
      } else if (answer.HTTP_status === 500) {
        // TODO VK: дополнить логику на случай сбоя в работе сервера
        //alert(answer.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${answer.message}`,
        });
      } else {
        // TODO VK: пересмотреть этот способ обработки ошибок, он не работает
        //alert("Unknown error!");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${answer.message}`,
        });
      }
    }
    setServerAnswerMessage(answer.message);
  }

  console.log(serverAnswerMessage);
  // * ↑ VK: Significant for the backend area. Please exercise caution when making alterations
  console.log(userRole);

  return (
    <>
      <SignedUpContext.Provider value={signedUp}>
        <SignedInContext.Provider value={signedIn}>
          <ParallaxProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    kind="full"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    setUserProfileData={setUserProfileData}
                    signedUp={signedUp}
                    onSignUp={onSignUp}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="About"
                element={
                  <About
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="ContractManagement"
                element={
                  <ContractManagment
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="ContractReview"
                element={
                  <ContractReview
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="ContractDrafting"
                element={
                  <ContractDrafting
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="ContractAnalysis"
                element={
                  <ContractAnalysis
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="FAQs"
                element={
                  <FAQs
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="UpLoad"
                element={
                  <UpLoad
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="OrderRewiew"
                element={
                  <OrderRewiew
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="BuyCredits"
                element={
                  <BuyCredits
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route
                path="Contacts"
                element={
                  <>
                    <ScrollToTop />
                    <Contacts
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  </>
                }
              />
              <Route
                path="Resources"
                element={
                  <>
                    <ScrollToTop />
                    <Resources
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  </>
                }
              />
              <Route
                path="Careers"
                element={
                  <>
                    <ScrollToTop />
                    <Careers
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  </>
                }
              />
              <Route
                path="Legal"
                element={
                  <>
                    <ScrollToTop />
                    <Legal
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  </>
                }
              />
              <Route
                path="DashBoard"
                element={
                  userRole === "client" ? (
                    <DashBoard
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  ) : userRole === "editor" ? (
                    <DashBoardEditor
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  ) : (
                    <DashBoardManager
                      kind="short"
                      onSignIn={onSignIn}
                      handleSignIn={handleSignIn}
                      signedUp={signedUp}
                      setUserProfileData={setUserProfileData}
                      handleSignUp={handleSignUp}
                      modalIsOpen={modalIsOpen}
                      setIsOpen={setIsOpen}
                    />
                  )
                }
              />
              // * VK: Temporary User Dashboard
              <Route
                path="/TemporaryDashboard"
                element={
                  <DashBoardTempClient
                    kind="short"
                    onSignIn={onSignIn}
                    handleSignIn={handleSignIn}
                    signedUp={signedUp}
                    setUserProfileData={setUserProfileData}
                    handleSignUp={handleSignUp}
                    modalIsOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/resetPassword" Component={ResetPassword} />
            </Routes>
          </ParallaxProvider>
        </SignedInContext.Provider>
      </SignedUpContext.Provider>
    </>
  );
}

export default App;

function NotFound() {
  return (
    <>
      <h2>Not found page!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </>
  );
}
function useReduxState(arg0: string, arg1: string): [any, any] {
  throw new Error("Function not implemented.");
}
