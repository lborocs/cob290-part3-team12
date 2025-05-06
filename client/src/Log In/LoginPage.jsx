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
                <h1 className="heroHeader">Welcome to the Future of Communication</h1>
                <p className="heroSubHeader">Join us in revolutionizing the way we connect and collaborate.</p>
            </div>
            <div className="loginFormWrapper"><LogInform /></div>
        </div>
    );  

}


export default LoginPage;