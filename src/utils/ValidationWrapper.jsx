import BASE_URL from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const ValidationWrapper = ({ children }) => {
  const [status, setStatus] = useState("pending");

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const handleLogout = async () => {
    localStorage.clear();
  };
  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/panelCheck`);

        if (statusRes.data?.msg !== "success") {
          throw new Error("Panel status check failed");
        }

        const dotenvRes = await axios.get(`${BASE_URL}/api/panel-fetch-dotenv`);
        const dynamicValidationKey = dotenvRes.data?.hashKey;

        if (!dynamicValidationKey) {
          throw new Error("Validation key missing from response");
        }

        const computedHash = validationKey
          ? CryptoJS.MD5(validationKey).toString()
          : "";

        if (!secretKey || computedHash !== dynamicValidationKey) {
          throw new Error("Unauthorized environment file detected");
        }

        setStatus("valid");
        if (location.pathname === "/maintenance") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Validation Error:", error.message);
        if (status != "valid") {
          handleLogout();
        }
        toast({
          title: "Environment Error",
          description: "Environment validation failed. Redirecting...",
          variant: "destructive",
        });

        setStatus("invalid");

        if (location.pathname !== "/maintenance") {
          navigate("/maintenance");
        }
      }
    };

    validateEnvironment();
  }, [navigate, location]);

  return children;
};

export default ValidationWrapper;
