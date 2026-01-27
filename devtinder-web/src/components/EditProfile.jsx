import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constant";
import { addItem } from "../utils/userSlice";
import { useDispatch } from "react-redux";

// Helper function to get full image URL
const getImageUrl = (photoUrl) => {
  if (!photoUrl) return "https://via.placeholder.com/128";

  // If it's already a full URL (http/https), return as is
  if (photoUrl.startsWith("http")) {
    return photoUrl;
  }

  // If it's a local path (/uploads/...), prepend BASE_URL
  if (photoUrl.startsWith("/uploads")) {
    return BASE_URL + photoUrl;
  }

  // Default fallback
  return photoUrl;
};

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

  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [uploading, setUploading] = useState(false);

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
      // Set preview with proper URL handling
      setPhotoPreview(getImageUrl(user.photoUrl));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only image files (JPEG, PNG, GIF, WebP, AVIF) are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(BASE_URL + "/profile/upload", formData, {
        withCredentials: true,
      });

      // Update the photoUrl in local state
      const photoUrl = res.data.photoUrl || res.data.user.photoUrl;
      setUser((prev) => ({
        ...prev,
        photoUrl: photoUrl,
      }));

      // Show preview with proper URL
      setPhotoPreview(getImageUrl(photoUrl));

      setToastType("success");
      setToastMsg("Photo uploaded successfully!");

      // Update Redux state
      dispatch(addItem(res.data.user));
    } catch (err) {
      console.error("Upload error:", err);
      const msg =
        err.response?.data?.message || err.message || "Photo upload failed";
      setError(msg);
      setToastType("error");
      setToastMsg(msg);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setToastMsg("");
      }, 3000);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", user1, {
        withCredentials: true,
      });

      dispatch(addItem(res.data.user));
      setError("");
      setToastType("success");
      setToastMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Profile update failed";
      setError(msg);
      setToastType("error");
      setToastMsg(msg);
    }

    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  return (
    <>
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

      <div className="flex justify-center items-center min-h-screen">
        <div className="card card-dash bg-base-100 w-96 shadow-lg border border-black/35 bg-gray-300">
          <div className="card-body">
            <h2 className="card-title flex justify-center text-2xl">
              Edit Profile
            </h2>

            {/* Photo Preview */}
            <div className="flex justify-center mb-4">
              <div className="avatar">
                <div className="w-32 rounded-full border-2 border-primary">
                  <img
                    src={photoPreview || "https://via.placeholder.com/128"}
                    alt="Profile preview"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">Upload Photo</legend>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="file-input file-input-bordered w-full"
              />
              {uploading && (
                <div className="flex justify-center mt-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2">Uploading...</span>
                </div>
              )}
            </fieldset>

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
              <select
                name="gender"
                className="input"
                value={user1.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xl">About</legend>
              <textarea
                name="about"
                className="input"
                value={user1.about}
                onChange={handleChange}
                placeholder="Enter about info"
                rows="3"
              />
            </fieldset>

            {error && <p className="text-red-600 text-sm ms-2">{error}</p>}

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
