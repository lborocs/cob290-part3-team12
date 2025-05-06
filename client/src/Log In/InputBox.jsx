import React from "react";
import "./CSS/InputBox.css";

const InputBox = ({ value, onChange, onKeyPress, placeholder}) => {

    return (
        
            <input
            className="inputBox"
                type="text"
                value={value}
                onChange={onChange}
                placeholder= {placeholder}
            />

    
    )

}

export default InputBox;