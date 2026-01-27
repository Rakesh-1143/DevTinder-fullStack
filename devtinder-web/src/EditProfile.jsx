import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./utils/constant";
import { addItem } from "./utils/userSlice";
import { useDispatch } from "react-redux";

function EditProfile({ user }) {
  const dispatch = useDispatch();

  const [user1, setUser] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    age: "",
    gender: "",
    about: "",
  });

  const [error, setError] = useState("");

  // 🔔 Toast state
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success"); // success | error

  useEffect(() => {
    if (user) {
      setUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoUrl: user.photoUrl || "",
        age: user.age || "",
        gender: user.gender || "",
        about: user.about || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", user1, {
        withCredentials: true,
      });

      dispatch(addItem(res.data));
      setError("");

      // ✅ success toast
      setToastType("success");
      setToastMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);

      const msg = err.response?.data?.message || "Profile update failed";

      setError(msg);

      // ❌ error toast
      setToastType("error");
      setToastMsg(msg);
    }

    // auto-hide toast after 3 sec
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  return (
    <>
      {/* 🔔 DaisyUI Toast */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toastType === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="card card-dash bg-base-100 w-96 shadow-lg border border-black/35 bg-gray-300">
          <div className="card-body">
            <h2 className="card-title flex justify-center text-2xl">
              Edit Profile
            </h2>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">First Name</legend>
              <input
                type="text"
                name="firstName"
                className="input"
                value={user1.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">Last Name</legend>
              <input
                type="text"
                name="lastName"
                className="input"
                value={user1.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">Photo URL</legend>
              <input
                type="text"
                name="photoUrl"
                className="input"
                value={user1.photoUrl}
                onChange={handleChange}
                placeholder="Enter photo URL"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">Age</legend>
              <input
                type="number"
                name="age"
                className="input"
                value={user1.age}
                onChange={handleChange}
                placeholder="Enter age"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">Gender</legend>
              <input
                type="text"
                name="gender"
                className="input"
                value={user1.gender}
                onChange={handleChange}
                placeholder="Enter gender"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">About</legend>
              <input
                type="text"
                name="about"
                className="input"
                value={user1.about}
                onChange={handleChange}
                placeholder="Enter about info"
              />
            </fieldset>

            <div>
              <p className="text-red-600 text-xl ms-2">{error}</p>
            </div>

            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={updateProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
