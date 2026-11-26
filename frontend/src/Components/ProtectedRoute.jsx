import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

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
        await axios.get("http://localhost:3000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
