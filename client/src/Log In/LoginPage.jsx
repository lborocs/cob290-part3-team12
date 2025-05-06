import React from "react";
import LogInform from "./AbsoluteLoginForm";
import styles from "./CSS/LoginPage.css";
import scribbleImage from "../assets/scribble.png";

const LoginPage = () => {
    return (
        <div className="pageWrapper">
            <div className="pattern-wrapper">
                <div className="pattern"></div>
            </div>
            <div className="hero">
                <h1 className="heroHeader">We Make Tomorrow Happen <span className="focus">Today</span></h1>
                <img src={scribbleImage} alt="Scribble" />
                <p>- Make It All</p>
            </div>
            <div className="loginFormWrapper"><LogInform /></div>
        </div>
    );  

}

export default LoginPage;