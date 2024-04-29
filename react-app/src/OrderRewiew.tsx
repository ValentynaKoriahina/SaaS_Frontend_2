import { useMediaQuery } from "react-responsive";
import Footer from "./components/footer/footer";
import { ChangeEvent, useState, useEffect } from "react";
import HeaderMenu from "./components/header/header";
import Button from "./components/Button";
import FileChooser from "./components/fileUploader/fileChooser";
import ModalWindow from "./components/modal/modal";
import PayPal from "./components/PayPalGuest";

// * VK: Significant for the backend area. Please exercise caution when making alterations
import { createTempUser } from "./fetchScripts/authRequests";

export default function CalculateCost({
  handleSignIn,
  handleSignUp,
  modalIsOpen,
  setIsOpen,
  onSignIn,
  onSignUp,
  setUserProfileData,
}: any) {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 1160px" });
  const isPhoneScreen = useMediaQuery({ query: "(max-width: 760px" });

  // Utility variables
  const [showModal, setShowModal] = useState(false); // * VK: State to control the visibility of a modal window
  const [checkedEmail, setCheckedEmail] = useState(false); // Используется для отображения остальных полей после подтверждения имейла
  const [totalCostCalculated, setTotalCostCalculated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [costCalculating, setCostCalculating] = useState(false);

  // Client data
  const [inputName, setInputName] = useState("John Boil");
  const [inputEmail, setInputEmail] = useState("sb-yhbsi27086563@personal.example.com");
  const [inputPhone, setInputPhone] = useState("+34312345678");
  const [userId, setUserId] = useState(undefined);

  const [companyName, setCompanyName] = useState("Company 1");
  const [companyAddress, setCompanyAddress] = useState("Company 1 address");
  const [companyIndustry, setCompanyIndustry] = useState("Company 1 Industry");

  // Contract data
  type ContractType = 'type 1' | 'type 2' | 'type 3' | '';
  const [contractType, setContractType] = useState<ContractType>('');
  const [contractDescription, setContractDescription] = useState("Contract Description 1");
  const [contractValue, setContractValue] = useState('10000');

  const [counterpartyName, setCounterpartyName] = useState("Counterparty 1");
  const [counterpartyAddress, setCounterpartyAddress] = useState("Counterparty 1 address");

  // Order data
  type ServiceType = 'review' | 'redlining' | 'negotiation' | '';
  const [serviceType, setServiceType] = useState<ServiceType>('');
  const [deliveryTime, setDeliveryTime] = useState('whenever');
  const [uploadedContracts, setUploadedContracts] = useState<File[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalCostInCerdits, setTotalCostInCerdits] = useState(0);
  const [orderId, setOrderId] = useState(0);

  // Addition order data
  const [uploadedClientGuides, setUploadedClientGuides] = useState<File[]>([]);
  const [addInformation, setAddInformation] = useState("Add information");

  // CLIENT'S 

  async function checkEmail() {

    const addedUser: any = await createTempUser([inputName, inputEmail, inputPhone]);
    if (addedUser.message == 'User with the same name or email already exists') {
      alert('User with the same email already exists. Please log in or choose a different e-mail address.');
      return;
    }

    setCheckedEmail(true); // * VK: Used to display the rest of the fields after the email has been confirmed
    setUserId(addedUser.userId);
  }

  // ORDER'S

  const handleContractsUpload = (files: File[]) => {
    setTotalCostCalculated(false);
    setUploadedContracts(files);
    setTotalPages(0);
  };

  function calculateOrderCost() {
    setCostCalculating(true); // * VK: Changes the value on the Calculate Price button to "In Progress"
    const formData = new FormData();

    uploadedContracts.forEach((file) => {
      formData.append("uploadedContracts", file);
    });

    formData.append("serviceType", serviceType);
    formData.append("deliveryTime", deliveryTime);
    formData.append("contractType", contractType);

    return new Promise((resolve, reject) => {
      fetch("/api/calculateOrderCost", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTotalPages(data.totalPages);
          setTotalCost(data.totalCost);
          setTotalCostInCerdits(data.totalCostInCerdits);
          setTotalCostCalculated(true);
          setCostCalculating(false); // * VK: Returns the initial value on the button
          resolve(data);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          reject(error);
        });
    });

  }

  function handleOrder(
    payPalOrderId: string,
    totalAmount: number,
    sellerTransactionId: string,
    paymentStatus: string,
    paymentCaptureId: string
  ) {

    const formData = new FormData();

    // Add customer information
    formData.append("userEmail", inputEmail);
    formData.append("userId", String(userId));
    formData.append("companyName", companyName);
    formData.append("companyAddress", companyAddress);
    formData.append("companyIndustry", companyIndustry);

    // Adding contract data
    formData.append("contractType", contractType);
    formData.append("contractDescription", contractDescription);
    formData.append("contractValue", String(contractValue));
    formData.append("counterpartyName", counterpartyName);
    formData.append("counterpartyAddress", counterpartyAddress);
    formData.append("serviceType", serviceType);
    formData.append("deliveryTime", deliveryTime);
    formData.append("totalPages", String(totalPages));
    formData.append("totalCost", String(totalCost));
    formData.append("totalCostInCerdits", String(totalCostInCerdits));

    // Adding payment information
    formData.append("payPalOrderId", payPalOrderId);
    formData.append("payPalTotalAmount", String(totalAmount));
    formData.append("payPalSellerTransactionId", sellerTransactionId);
    formData.append("payPalPaymentStatus", paymentStatus);
    formData.append("payPalPaymentCaptureId", paymentCaptureId);

    // Add files
    uploadedContracts.forEach((file) => {
      formData.append("uploadedContracts", file);
    });

    return new Promise((resolve, reject) => {
      fetch("/api/saveOnFlyOrder", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          // TODO VK: Add server response handling
          setPaymentStatus(true);
          setShowModal(!showModal);
          setOrderId(data.orderId)
          resolve(data);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          reject(error);
        });
    });
  }

  const handleClientGuidesUpload = (files: File[]) => {
    setUploadedClientGuides(files);
  };

  function sendOtherInstructions() {
    const formData = new FormData();

    formData.append("orderId", String(orderId));
    formData.append("addInformation", addInformation);

    uploadedClientGuides.forEach((file) => {
      formData.append("uploadedClientGuides", file);
    });

    return new Promise((resolve, reject) => {
      fetch("/api/saveClientGuides", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          // TODO VK: Add server response handling
          setPaymentStatus(true);
          setShowModal(!showModal);
          resolve(data);
          // * VK: Redirects to the temporary client panel
          window.location.href = '/TemporaryDashboard?orderId=' + orderId;
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          reject(error);
        });
    });
  }

  useEffect(() => {
    console.log(totalCost);
  }, [totalCost]);


  // PAYMENT'S

  const handlePayPalError = (error: string) => {
    console.log("An error occurred while making a payment: " + error);
    setPaymentStatus(false);
    setShowModal(!showModal);
  };


  return (
    <>
      <div className="app">
        <HeaderMenu
          kind="short"
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
          setUserProfileData={setUserProfileData}
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
        />
        <section className="main-content container" style={{ flexDirection: "column" }}>
          {paymentStatus ? (
            // * VK: If the payment has been made, it will display this data
            <>
              <h3>Payment completed successfully! Your order has been processed.</h3>

              <p>Details and access to your temporary dashboard have been sent to your email.</p>
              <p>Now you can add additional instructions or <a href={`/TemporaryDashboard?orderId=${orderId}`}>click here</a> to go to the order management dashboard.</p>


              <div className="container mt-5 form-container">
                <div className="row">
                  <div className="col-md-12" id="fullWidthColumn">
                    <form id="orderForm">
                      <div className="frame-container">
                        <h3>Other instructions</h3>
                        <div className="form-group">
                          <label htmlFor="files">
                            Upload your playbook or a model template to use if any. <br />
                            (File extensions allowed: .doc, .docx, .rtf, .pdf, .odt)
                          </label>
                          <FileChooser onFilesSelected={handleClientGuidesUpload} />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="addInformation">
                            Tell us anything else that will help us serve you
                          </label>
                          <textarea
                            className="form-control"
                            name="addInformation"
                            id="addInformation"
                            rows={4}
                            placeholder="Enter text"
                            value={addInformation}
                            onChange={(e) => setAddInformation(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <Button
                            children="Send"
                            color="orange"
                            onClick={sendOtherInstructions}
                            style="modal-btn"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div >
            </>

          ) : (
            // * VK: If the payment has not yet been made, display the form
            <>
              <h2>ORDER A REVIEW</h2>

              <div className="container mt-5 form-container">
                <div className="row">
                  <div className="col-md-12" id="fullWidthColumn">
                    <form id="orderForm">
                      <div className="frame-container">
                        <h3>Tell us about you</h3>
                        <div className="form-group mb-3">
                          <label htmlFor="contactPersonName">
                            Your name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="contactPersonName"
                            id="contactPersonName"
                            value={inputName}
                            required={true}
                            onChange={(e) => setInputName(e.target.value)}
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="email">Your email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            value={inputEmail}
                            required={true}
                            onChange={(e) => setInputEmail(e.target.value)}
                            disabled={checkedEmail}
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="phoneNumber">Your phone number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={inputPhone}
                            required
                            onChange={(e) => setInputPhone(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          {!checkedEmail && (
                            <Button
                              children="Next"
                              color="orange"
                              onClick={checkEmail}
                              style="modal-btn"
                            />
                          )}
                        </div>
                      </div>

                      {checkedEmail && (
                        <div className="frame-container">
                          <h3>Tell us about your business</h3>
                          <div className="form-group mb-3">
                            <label htmlFor="companyName">
                              Your company name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyName"
                              id="companyName"
                              value={companyName}
                              required={true}
                              onChange={(e) => setCompanyName(e.target.value)}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="companyAddress">
                              Your company address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyAddress"
                              id="companyAddress"
                              value={companyAddress}
                              required={true}
                              onChange={(e) => setCompanyAddress(e.target.value)}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="companyIndustry">
                              Your company industry
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyIndustry"
                              id="companyIndustry"
                              value={companyIndustry}
                              required={true}
                              onChange={(e) => setCompanyIndustry(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {checkedEmail && (
                        <div className="frame-container">
                          <h3>Tell us about the contract</h3>
                          <div className="form-group mb-3">
                            <label htmlFor="contractType">Contract type</label>
                            <select
                              className="form-control"
                              name="contractType"
                              id="contractType"
                              value={contractType}
                              required={true}
                              onChange={(e) => setContractType(e.target.value as ContractType)}
                            >
                              <option value="" disabled hidden>Select contract type</option>
                              <option value="Non-Disclosure Agreements (NDAs)">Non-Disclosure Agreements (NDAs)</option>
                              <option value="Master Service Agreements (MSAs)">Master Service Agreements (MSAs)</option>
                              <option value="Data Processing Agreements (DPAs)">Data Processing Agreements (DPAs)</option>
                              <option value="Software as a Service Agreements (SaaS)">Software as a Service Agreements (SaaS)</option>
                              <option value="End-user license agreements (EULAs)">End-user license agreements (EULAs)</option>
                              <option value="Licensing Agreements">Licensing Agreements</option>
                              <option value="Consulting Agreements">Consulting Agreements</option>
                              <option value="Sales agreements">Sales agreements</option>
                              <option value="Supply Agreements">Supply Agreements</option>
                              <option value="Real Estate Agreements">Real Estate Agreements</option>
                              <option value="Construction Agreements">Construction Agreements</option>
                              <option value="Employment contracts">Employment contracts</option>
                              <option value="Partnership Agreements">Partnership Agreements</option>
                              <option value="Statements of Work (SOWs)">Statements of Work (SOWs)</option>
                              <option value="Work Orders (WOs)">Work Orders (WOs)</option>
                              <option value="Amendments">Amendments</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="form-group mb-3">
                            <label htmlFor="contractDescription">
                              Contract description (what is the contract about? what are you buying?
                              Selling? Where is your company located? Where is the other party located?)
                            </label>
                            <textarea
                              className="form-control"
                              name="contractDescription"
                              id="contractDescription"
                              value={contractDescription}
                              required={true}
                              onChange={(e) => setContractDescription(e.target.value)}
                            />
                          </div>


                          <div className="form-group mb-3">
                            <label htmlFor="contractValue">
                              Contract value (how much will you pay or receive for the goods/services)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="contractValue"
                              id="contractValue"
                              value={contractValue}
                              required={true}
                              onChange={(e) => setContractValue(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {checkedEmail && (
                        <div className="frame-container">
                          <h3>Tell us about the other party</h3>
                          <div className="form-group mb-3">
                            <label htmlFor="companyName">
                              Counterparty name (the party you are contracting with)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="counterpartyName"
                              id="counterpartyName"
                              value={counterpartyName}
                              required={true}
                              onChange={(e) => setCounterpartyName(e.target.value)}
                            />
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="counterpartyAddress">
                              Counterparty address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="counterpartyAddress"
                              id="counterpartyAddress"
                              value={counterpartyAddress}
                              required={true}
                              onChange={(e) => setCounterpartyAddress(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {checkedEmail && (
                        <div className="frame-container">
                          <h3>Choose Service</h3>
                          <div className="form-group mb-3">
                            <label htmlFor="serviceType">
                              Type of service you want?
                            </label>
                            <select
                              className="form-control"
                              name="serviceType"
                              id="serviceType"
                              value={serviceType}
                              required={true}
                              onChange={(e) => setServiceType(e.target.value as ServiceType)}
                            >
                              <option value="" disabled hidden>Select service type</option>
                              <option value="review">Review/Check</option>
                              <option value="redlining">First round of redlining</option>
                              <option value="negotiation">Start to finish negotiation</option>
                            </select>
                          </div>
                          <div className="form-group mb-3">
                            <label htmlFor="serviceType">
                              Delivery time
                            </label>
                            <select
                              className="form-control"
                              name="deliveryTime"
                              id="deliveryTime"
                              value={deliveryTime}
                              required={true}
                              onChange={(e) => setDeliveryTime(e.target.value as ServiceType)}
                            >
                              <option value="whenever">whenever</option>
                              <option value="same day">same day</option>
                              <option value="1 day">1 day</option>
                              <option value="3 days">3 days</option>
                              <option value="5 days">5 days</option>
                              <option value="5-10 days">5-10 days</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {checkedEmail && (
                        <div className="frame-container">
                          <div className="form-group">
                            <h3>Upload files</h3>
                            <p>File extensions allowed: .doc, .docx, .rtf, .pdf, .odt</p>
                            {/* VK: Pass the callback function to the FileChooser component */}
                            <FileChooser onFilesSelected={handleContractsUpload} />
                          </div>
                          <div className="form-group">
                            {uploadedContracts.length > 0 && (
                              <Button
                                children={costCalculating ? "Processing..." : "Calculate cost"}
                                color="orange"
                                onClick={calculateOrderCost}
                                style="modal-btn"
                              />
                            )}
                          </div>
                          {/* VK: Display order value data */}
                          {totalCostCalculated && (
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td style={{ width: "20%", textAlign: "center" }}>
                                    Pages</td>
                                  <td style={{ width: "20%", textAlign: "center" }}>
                                    Estimated cost in credits
                                  </td>
                                  <td style={{ width: "20%", textAlign: "center" }}>
                                    Estimated cost in $</td>
                                </tr>
                                <tr>
                                  <td style={{ width: "20%", textAlign: "center" }}>
                                    {totalPages}
                                  </td>
                                  <td style={{ width: "40%", textAlign: "center" }}>
                                    {totalCost}
                                  </td>
                                  <td style={{ width: "40%", textAlign: "center" }}>
                                    {totalCostInCerdits}
                                  </td>

                                </tr>
                              </tbody>
                            </table>
                          )}
                          <div className="form-group">
                            {totalCostCalculated && (
                              <ModalWindow
                                title={"Proceed to pay"}
                                childComp={
                                  <PayPal
                                    amountPay={totalCost}
                                    onSuccess={handleOrder}
                                    onError={handlePayPalError} // * VK: Pass the error handling function
                                  />
                                }
                                modalIsOpen={showModal}
                                openModal={() => setShowModal(true)}
                                closeModal={() => setShowModal(false)}
                                btnModalStyle={"modal-btn"}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div >
            </>
          )}

        </section >

      </div >
      <Footer kind={"short"} />
    </>
  );
}
