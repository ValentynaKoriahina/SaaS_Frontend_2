import "../startScreen/startScreen.scss";
import HeaderMenu from "../header/header";
import StartScreenPic from "../../../public/start_screen_pic3.png";
import { Link } from "react-router-dom";
import Button from "../Button";
import { useMediaQuery } from "react-responsive";
import { useContext, useEffect, useState } from "react";
import { SignedInContext } from "../../App";
import { Parallax } from "react-scroll-parallax";

export default function StartScreen() {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 1160px" });
  const isPhoneScreen = useMediaQuery({ query: "(max-width: 760px" });
  const signedIn = useContext(SignedInContext);

  return (
    <section className="start_screen">
      <div className="wrapper start_screen_content d-flex flex-lm-row flex-md-block">
        <div className="Content">
          <div
            className="only_title"
            style={{
              display: "flex",
              width: "100%",
              fontSize: "55px",
              fontWeight: "bold",
              textAlign: "start",
              lineHeight: "70px",
              fontFamily: "Montserrat",
              marginBottom: "0px",
              color: "#ec720b",
            }}
          >
            <Parallax
              speed={5}
              translateY={["-350px", "350px"]}
              opacity={[7, -2.8]}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "680px",
                }}
              >
                <div
                  style={{
                    height: "60px",
                    minWidth: "380px",
                    textAlign: "start",
                    margin: "145px 0",
                  }}
                >
                  24/7 contract
                  <p
                    className="only_text"
                    style={{
                      textAlign: "start",
                      margin: "20px 20px 0 0",
                      color: "white",
                    }}
                  >
                    Your contracts drafted, reviewed, and negotiated by
                    experienced lawyers when you need it and how you want it.
                  </p>
                </div>

                <Link to="/Services">
                  <Button
                    children="GET STARTED"
                    color=""
                    style={"btn_get_started"}
                    onClick={() => null}
                  />
                </Link>
              </div>
            </Parallax>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: "55px",
                fontWeight: "bold",
                textAlign: "start",
                lineHeight: "60px",
                fontFamily: "Montserrat",
                color: "white",
              }}
            >
              <Parallax
                opacity={[4, -1.0]}
                speed={0}
                translateY={["-100px", "-100px"]}
              >
                <a style={{ letterSpacing: "23px" }}>drafting</a>
              </Parallax>
              <Parallax
                opacity={[2.5, -0.5]}
                speed={0}
                translateY={["-100px", "-100px"]}
              >
                <a style={{ letterSpacing: "6px" }}>negotiation</a>
              </Parallax>
              <Parallax
                opacity={[0.2, 1.0]}
                speed={0}
                translateY={["-100px", "-100px"]}
              >
                <a style={{ letterSpacing: "6px" }}>automation</a>
              </Parallax>
              <Parallax
                opacity={[-0.2, 1.5]}
                speed={0}
                translateY={["-100px", "-100px"]}
              >
                <a>management</a>
              </Parallax>
              <Parallax
                opacity={[-0.3, 1.2]}
                speed={0}
                translateY={["-100px", "-100px"]}
              >
                <a style={{ letterSpacing: "36px" }}>rewiew</a>
              </Parallax>
            </div>

            <Parallax
              speed={5}
              translateY={["-350px", "350px"]}
              opacity={[7, -2.8]}
            >
              <div
                style={{
                  display: "flex",
                  height: "680px",
                }}
              >
                <div
                  style={{
                    height: "60px",
                    minWidth: "350px",
                    textAlign: "start",
                    margin: "145px 0",
                  }}
                >
                  services simplified and delivered on time, and on budget!
                </div>
              </div>
            </Parallax>
          </div>

          <p
            className="only_text"
            style={{
              margin: "0px 0px 30px",
              color: "#ec720b",
            }}
          >
            ChronoLegal helps businesses contract and close more deals, on time
            and on budget! Our attorneys, legal technologists, and consultants
            live and breathe commercial contracts. It’s all we do and think
            about. We won’t attempt to fix all your legal and business issues,
            but we will conquer your contracts!!!
          </p>
        </div>

        {/* {!isPhoneScreen ? (
          <div className="Content">
            <img
              className="start_screen_pet"
              src={StartScreenPic}
              alt="Picture start screen"
            />
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </section>
  );
}
