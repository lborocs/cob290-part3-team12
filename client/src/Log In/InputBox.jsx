import React from "react";
import "./CSS/InputBox.css";

const InputBox = ({ value, onChange, placeholder, id}) => {

    return (
        
            <input
                className="inputBox"
                id={id}
                type="text"
                value={value}
                onChange={onChange}
                placeholder= {placeholder}
            />

    
    )

}

export default InputBox;