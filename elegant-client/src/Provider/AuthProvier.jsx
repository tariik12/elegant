// AuthProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (data) => {
    if (data === "can-login") {
      setIsAuthenticated(true);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Login Failed",
        text: "Invalid login credentials.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const logout = async (redirect) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/logout`);
      setIsAuthenticated(false);

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        showConfirmButton: false,
        timer: 1500,
      });

      if (redirect === 'home') {
        window.location.href = '/';
      } else {
        window.location.href = '/login@elegant-admin';
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error!",
        text: "An error occurred while trying to log out. Please try again later.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
