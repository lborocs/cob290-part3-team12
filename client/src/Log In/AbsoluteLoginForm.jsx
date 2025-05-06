import React from "react";
import InputBox from "./InputBox";
import Button from "./Button";
import "./CSS/AbsoluteLoginForm.css";

const AbsoluteLoginForm = ({  }) => {
    return (
        <div className="logInDivWrapper">
            <h1 className="logInHeader">Welcome Back</h1>
            <h4 className="logInSubHeader">Please Log In</h4>
                <div className="logInForm">
                    <InputBox
                        placeholder= "Please type your email address ... ">
                    </InputBox>
                    <InputBox
                    placeholder= "Please type your password ... ">
                    </InputBox>
                    <Button text="Log In" />

                </div>
                
            

        </div>
    )
}

export default AbsoluteLoginForm;