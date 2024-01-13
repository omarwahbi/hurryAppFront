"use client";
import React, { useState, useEffect } from "react";

const UserDataComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data by ID
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://hackathon-fhdh.onrender.com/api/users/${userId}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [userId]);

  return (
    <div>
      {userData ? (
        <div>
          <h2>User Details</h2>
          <p>User ID: {userData.id}</p>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Include other user details as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDataComponent;
