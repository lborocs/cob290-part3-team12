import React, { useState, useEffect } from "react";
import "./header.css";
import API_URL from "../config";

const Header = () => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("userEmail");
      const jwt = localStorage.getItem("token");

      if (email && jwt) {
        try {
          const response = await fetch(`${API_URL}/api/get-user/${email}`, {
            headers: {
              Authorization: jwt,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFirstName(data.first_name);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="header">
      <h1 className="header-title">Welcome {firstName}</h1>
      <p className="header-subtitle">View analytics for your team</p>
    </div>
  );
};

export default Header;
