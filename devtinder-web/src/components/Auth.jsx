import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../utils/constant";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleLogin = async () => {
    setError("");

    // Validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addItem(res.data));
      navigate("/feed");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError("");

    // Validation
    if (!firstName) {
      setError("First name is required");
      return;
    }
    if (firstName.length < 4) {
      setError("First name must be at least 4 characters");
      return;
    }
    if (!lastName) {
      setError("Last name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        BASE_URL + "/signup",
        {
          email,
          password,
          firstName,
          lastName,
          gender: "other",
          age: 25,
          about: "Looking to connect",
          photoUrl:
            "https://static.vecteezy.com/system/resources/previews/055/631/158/non_2x/young-woman-wearing-id-card-avatar-icon-for-social-media-profile-picture-vector.jpg",
          skills: [],
        },
        {
          withCredentials: true,
        },
      );
      setError("");
      alert(
        "✅ Account created successfully! Please login with your credentials.",
      );
      setIsSignup(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Signup failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card card-dash bg-base-100 w-full max-w-md shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="card-title flex justify-center text-3xl font-bold text-center mb-6">
            {isSignup ? "Create Account" : "Login"}
          </h2>

          {isSignup && (
            <>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm font-semibold">
                  First Name
                </legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  disabled={loading}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm font-semibold">
                  Last Name
                </legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
              </fieldset>
            </>
          )}

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm font-semibold">
              Email Address
            </legend>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm font-semibold">
              Password
            </legend>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={!password}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {!isSignup && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </fieldset>

          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m6-8l2 2m0 0l2 2m-2-2l-2 2m2-2l2-2"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="card-actions flex flex-col gap-3 mt-4">
            <button
              className="btn btn-primary w-full"
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </button>

            {!isSignup ? (
              <p className="text-center text-sm text-gray-600">
                New user?{" "}
                <button
                  onClick={() => {
                    setIsSignup(true);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <button
                className="btn btn-ghost w-full"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setPassword("");
                  setShowPassword(false);
                }}
                disabled={loading}
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
