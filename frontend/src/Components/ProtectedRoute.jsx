
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../utils/axiosInstance";

const ProtectedRoute = () => {
  // Agar token nahi hai, toh foran 'false' set karein taake loading text na aaye
 const [isAuthenicated, setIsAuthenicated] = useState(() => {
   return localStorage.getItem("token") ? null : false;
 });

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenicated(false);
        return;
      }

      try {
       await API.get("/auth/profile");
        setIsAuthenicated(true);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setIsAuthenicated(false);
      }
    };

    verifyToken();
  }, []);

  // Jab token bilkul na ho, toh foran login par bhej dein
  if (isAuthenicated === false) {
    return <Navigate to="/login" replace />;
  }

  // Jab tak token verify ho raha hai tabhi yeh dikhayein
  if (isAuthenicated === null) {
    return <h2>verifying authentication....</h2>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
