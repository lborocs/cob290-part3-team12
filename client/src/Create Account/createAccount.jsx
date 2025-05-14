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

    const handleCreateAccount = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        // change the API URL to your backend URL
        fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/textchat");
                } else {
                    alert("Account creation failed.");
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
                        placeholder="Enter your email address..."
                        id="emailInputBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="Please confirm your email address..."
                        id="confirmEmailInputBox"
                        value={email}
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
                    <Button text="Create Account" onClick={handleCreateAccount} />
                    <button className="createAccountP" onClick={()=> navigate("/")}>Already have an account? Click Here to Log In</button>
        
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;