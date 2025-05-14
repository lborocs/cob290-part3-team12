import React, { useState } from "react";
import InputBox from "../Log In/InputBox";
import Button from "../Log In/Button";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import "./createAccount.css";

const CreateAccount = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");

    const setVisibility = (bool) => {
        if(bool){
          const loginFailedP = document.querySelector(".createAccountFailed");
          if (loginFailedP) {
            loginFailedP.style.display = "none";
          }
        }
        else{
        const loginFailedP = document.querySelector(".createAccountFailed");
        if (loginFailedP) {
          loginFailedP.style.display = "block";
        }
    }
}

    const handleCreateAccount = () => {
        const loginFailedP = document.querySelector(".createAccountFailed");
        if (password !== confirmPassword) {
            setVisibility(false)
            setErrorMessage("Passwords do not match.");
            return;
        }
        else if (email !== confirmEmail) {
            setVisibility(false)
            setErrorMessage("Emails do not match.");
            return;
        }


        fetch(`${API_URL}api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, first_name, last_name }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Account created successfully!");
                    navigate("/textchat");
                    setVisibility(true)
                } else {
                    console.error("Registration failed:", data.error);
                    setVisibility(false)
                    setErrorMessage("Connection Failed, try again later.")
                    setErrorMessage(data.error);
                }
            })
            .catch((err) => console.error("Registration error:", err));
    };

    

    return (
        <div className="createAccountPage">
            <div className="logInDivWrapper">
                <h1 className="logInHeader">Create Account</h1>
                <h4 className="logInSubHeader">Sign up below</h4>
                <div className="logInForm">
                <InputBox
                        placeholder="Please enter your Last Name..."
                        id="firstNameInputBox"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
               <InputBox
                        placeholder="Please enter your Last Name..."
                        id="lastNameInputBox"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <InputBox
                        placeholder="Enter your email address..."
                        id="emailInputBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="Please confirm your email address..."
                        id="confirmEmailInputBox"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="Enter your password..."
                        id="passwordInputBox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputBox
                        placeholder="Confirm your password..."
                        id="confirmPasswordInputBox"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <p className="createAccountFailed">{errorMessage}</p>
                    <Button text="Create Account" onClick={handleCreateAccount} />
                    <button className="createAccount" onClick={()=> navigate("/")}>Already have an account? Click Here to Log In</button>
        
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;