import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// This component is deprecated - use Auth.jsx instead
// Redirects to home page which uses Auth.jsx
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

export default Login;
