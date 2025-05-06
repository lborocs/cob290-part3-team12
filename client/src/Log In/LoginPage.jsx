import React from "react";
import LogInform from "./AbsoluteLoginForm";
import styles from "./CSS/LoginPage.css";

const LoginPage = () => {
    return (
        <div className="pageWrapper">
            <div className="pattern-wrapper">
                <div className="pattern"></div>
            </div>
            <div className="hero">
                <h1 className="heroHeader"><span className="speechmarks">"</span>We Make Tomorrow Happen <span className="focus">Today</span><span className="speechmarks">"</span></h1>
                <img src = "../../../assets/scribble.png"/>
                <p>- Make It All</p>
            </div>
            <div className="loginFormWrapper"><LogInform /></div>
        </div>
    );  

}

export default LoginPage;