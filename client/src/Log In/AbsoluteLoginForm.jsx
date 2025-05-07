import React from "react";
import InputBox from "./InputBox";
import Button from "./Button";
import "./CSS/AbsoluteLoginForm.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const AbsoluteLoginForm = ({  }) => {
    

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        fetch("http://35.234.158.197:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/textchat");
            } else {
                console.error("Login failed:", data.error);
            }
        })
        .catch(err => console.error("Login error:", err));
    };

    return (
        <div className="logInDivWrapper">
            <h1 className="logInHeader">Welcome Back</h1>
            <h4 className="logInSubHeader">Please Log In</h4>
                <div className="logInForm">
                    <InputBox
                        placeholder="Please type your email address ... "
                        id="emailInputBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="Please type your password ... "
                        id="passwordInputBox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                        text="Log In" 
                        onClick={() => handleLogin(email, password)}
                    />
                </div>
                
            

        </div>
    )
}

export default AbsoluteLoginForm;