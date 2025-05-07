import React from "react";
import InputBox from "./InputBox";
import Button from "./Button";
import "./CSS/AbsoluteLoginForm.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const AbsoluteLoginForm = ({  }) => {
    function handleLogin(emailValue,paswordValue) {
        // handle login checks here against api. 
        console.log(emailValue, paswordValue);
        navigate("/textchat");
    }

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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