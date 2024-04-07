import Button from "../Button";
import { useEffect } from "react";

const LogInForm = ({
  handleSignIn,
  onSignUp,
  resetPass,
  setResetPass,
}: any) => {
  // * ↓ VK: Significant for the backend area. Please exercise caution when making alterations
  const handleLogInSubmit = () => {
    // * VK: Form fields data entered by the user
    const formData = new FormData(
      document.getElementById("login-form") as HTMLFormElement
    );
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;

    // * VK: Pass the data to the onSignIn function

    handleSignIn({
      login,
      password,
    });
  };

  // * ↑ VK: Significant for the backend area. Please exercise caution when making alterations

  function handleResetPass() {
    setResetPass(!resetPass);
  }

  return (
    <>
      <form
        className="form "
        action="/api/signin"
        method="post"
        id="login-form"
      >
        <div className="col-xs-12">
          <div className="form-group">
            <label htmlFor="login">User name or email:</label>
            <input
              type="text"
              className="input-field"
              id="login"
              name="login"
              placeholder="Enter user name"
              defaultValue="editor"
              required
            />
            <br />
          </div>
        </div>
        <div className="col-xs-12">
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="input-field"
              id="password"
              name="password"
              placeholder="Enter password"
              defaultValue="pass"
              required
            />
          </div>
        </div>

        <Button
          children="Reset password?"
          color={"white"}
          onClick={handleResetPass}
          style="resetPass-btn"
        />

        <div className="text-left col-xs-12">
          {/* // * VK: Significant for the backend area. Please exercise caution when making alterations */}
          <div className="btn-container">
            <Button
              children="Submit"
              color="orange"
              onClick={() => {
                handleLogInSubmit();
              }}
              style="modal-btn"
            />
          </div>
        </div>
        <div className="text-left col-xs-12">
          <p>Not registred? Push Sign Up.</p>
        </div>

        <div className="text-left col-xs-12">
          <div className="btn-container">
            <Button
              children="Sign Up"
              color="orange"
              onClick={onSignUp}
              style="modal-btn"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default LogInForm;
