import { Dispatch, SetStateAction, useContext, useState } from "react";
import "./header.scss";
import Logo from "../../../public/ChronoLegal_G.jpg";
import { HashLink as Link } from "react-router-hash-link";
import { Navbar } from "../burger/navBar";
import ModalWindow from "../modal/modal";
import LogInForm from "../modal/LogInForm";
import FacebookPic from "../../../public/facebook1.png";
import MailPic from "../../../public/twitter.png";
import PhonePic from "../../../public/instagram.png";
import TelegramPic from "../../../public/linkedin.png";
import {
  SignedInContext,
  SignedUpContext,
  deleteCookie,
  handleSignOut,
} from "../../App";
import Button from "../Button";
import { useMediaQuery } from "react-responsive";
import SignUpForm from "../modal/SignUpForm";
import ResetPassForm from "../modal/ResetPass";

interface IHeaderProps {
  kind?: "full" | "short";
  handleSignIn: boolean;
  setUserProfileData: any;
  handleSignUp: boolean;
  onSignIn: Dispatch<SetStateAction<boolean>>;
  onSignUp: Dispatch<SetStateAction<boolean>>;

  modalIsOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderMenu({
  kind,
  handleSignIn,
  handleSignUp,
  setUserProfileData,
  onSignIn,
  onSignUp,
  modalIsOpen,
  setIsOpen,
}: IHeaderProps) {
  const signedIn = useContext(SignedInContext);
  const signedUp = useContext(SignedUpContext);
  const [resetPass, setResetPass] = useState(false);
  const isMobileScreen = useMediaQuery({ query: "(max-width: 1028px" });

  const signedInStatus = signedIn ? "Sign Out" : "Sign In";

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    resetPass && setResetPass(!resetPass);
  }

  function closeSignUp() {
    onSignUp(!signedUp);
    setIsOpen(false);
  }

  return (
    <>
      <div className="header__links">
        <div className="contacts__links">
          <a href="https://www.facebook.com/">
            <div className="contacts__links-btn">
              <img
                src={FacebookPic}
                className="contacts__icon"
                alt="Picture social-list"
              />
            </div>
          </a>
          <a href="mailto:mitin.oa@gmail.com">
            <div className="contacts__links-btn">
              <img
                src={MailPic}
                className="contacts__icon"
                alt="Picture mail"
              />
            </div>
          </a>
          <a href="tel:+48000000000">
            <div className="contacts__links-btn">
              <img
                src={PhonePic}
                className="contacts__icon"
                alt="Picture phone"
              />
            </div>
          </a>
          <a href="https://t.me/">
            <div className="contacts__links-btn">
              <img
                src={TelegramPic}
                className="contacts__icon"
                alt="Picture telegram"
              />
            </div>
          </a>
        </div>
      </div>

      <header className={kind === "short" ? "header__short" : "header"}>
        <div className="wrapper header">
          {kind === "full" ? (
            <div className="logo">
              <img className="logo__img" alt="LOGO" src={Logo}></img>
            </div>
          ) : (
            <></>
          )}
          {kind === "short" ? (
            <>
              <Link to="/">
                <button
                  type="button"
                  className={"btn btn-warning"}
                  style={{ padding: "0px" }}
                >
                  <img className="logo__img" alt="LOGO" src={Logo} />
                </button>
              </Link>
            </>
          ) : (
            <></>
          )}
          <ul className={kind === "short" ? "nav__short" : "nav"}>
            {signedIn ? (
              <>
                <Link className="nav__link nav__text" to="/Dashboard">
                  Dashboard
                </Link>
                <Link className="nav__link nav__text" to="/UpLoad">
                  File Upload
                </Link>
                <Link className="nav__link nav__text" to="/BuyCredits">
                  Buy Credits
                </Link>
                {!isMobileScreen ? (
                  <Link to="/">
                    <ModalWindow
                      // * VK: This part of the code will be displayed if the variable signedIn == true
                      title={signedUp ? signedInStatus : "Sign Up"}
                      childComp={
                        signedInStatus == "Sign In" ? (
                          !signedIn && signedUp ? (
                            !resetPass ? (
                              <LogInForm
                                handleSignIn={handleSignIn}
                                onSignUp={handleSignUp}
                                setIsOpen={setIsOpen}
                                modalIsOpen={modalIsOpen}
                                resetPass={resetPass}
                                setResetPass={setResetPass}
                              />
                            ) : (
                              <ResetPassForm
                                setIsOpen={setIsOpen}
                                resetPass={resetPass}
                                setResetPass={setResetPass}
                              />
                            )
                          ) : (
                            <SignUpForm
                              handleSignUpForm={handleSignUp}
                              onSignUp={onSignUp}
                              onCloseModal={closeModal}
                              setUserProfileData={setUserProfileData}
                            />
                          )
                        ) : (
                          <Link to="/">
                            <>
                              <Button
                                children={`Want to ${signedInStatus}?`}
                                color="orange"
                                onClick={() => {
                                  onSignIn(false);
                                  setIsOpen(false);
                                  // deleteCookie("token");
                                  handleSignOut();
                                }}
                                style="modal-btn"
                              />
                            </>
                          </Link>
                        )
                      }
                      modalIsOpen={modalIsOpen}
                      openModal={openModal}
                      closeModal={signedUp ? closeModal : closeSignUp}
                    />
                  </Link>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <Link className="nav__link nav__text" to="/About">
                  ABOUT
                </Link>
                <Link className="nav__link nav__text" to="/Services">
                  SERVICES
                </Link>
                <Link className="nav__link nav__text" to="/FAQs">
                  FAQs
                </Link>
                <Link className="nav__link nav__text" to="/OrderRewiew">
                  ORDER A REWIEW
                </Link>

                {!isMobileScreen ? (
                  <Link to="/">
                    <ModalWindow
                      title={
                        signedUp
                          ? resetPass
                            ? "Reset password"
                            : signedInStatus
                          : "Sign Up"
                      }
                      childComp={
                        signedInStatus == "Sign In" ? (
                          !signedIn && signedUp ? (
                            !resetPass ? (
                              <LogInForm
                                handleSignIn={handleSignIn}
                                onSignUp={handleSignUp}
                                setIsOpen={setIsOpen}
                                modalIsOpen={modalIsOpen}
                                resetPass={resetPass}
                                setResetPass={setResetPass}
                              />
                            ) : (
                              <ResetPassForm
                                setIsOpen={setIsOpen}
                                resetPass={resetPass}
                                setResetPass={setResetPass}
                              />
                            )
                          ) : (
                            <SignUpForm
                              handleSignUp={handleSignUp}
                              onCloseModal={closeModal}
                              onSignUp={onSignUp}
                              setUserProfileData={setUserProfileData}
                            />
                          )
                        ) : (
                          <Link to="/">
                            <Button
                              children={signedInStatus}
                              color="orange"
                              onClick={() => {
                                onSignIn(false);
                                setIsOpen(false);
                                // deleteCookie("token");
                                handleSignOut;
                              }}
                              style="modal-btn"
                            />
                          </Link>
                        )
                      }
                      modalIsOpen={modalIsOpen}
                      openModal={openModal}
                      closeModal={signedUp ? closeModal : closeSignUp}
                    />
                  </Link>
                ) : (
                  <></>
                )}
              </>
            )}
          </ul>

          {isMobileScreen ? (
            <Navbar
              signedInStatus={signedInStatus}
              handleSignIn={handleSignIn}
              setUserProfileData={setUserProfileData}
              handleSignUp={handleSignUp}
              onSignIn={onSignIn}
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
              resetPass={resetPass}
              setResetPass={setResetPass}
            />
          ) : (
            <></>
          )}
        </div>
      </header>
    </>
  );
}
