import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constant";
import { getImageUrl } from "../utils/imageHelper";
import { sendInterestNotification } from "../utils/emailHelper";

function UserCard({ users, onRemoveCard }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!users) {
    return null;
  }

  const { _id, firstName, lastName, age, gender, about, skills, photoUrl } =
    users;

  const handleSendRequest = async (status) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/send/request/${status}/${_id}`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Request sent successfully:", response.data);

      // Send email notification on frontend if interested (optional double send)
      if (status === "interested") {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const user = JSON.parse(currentUser);
          // Optional: Can send additional email from frontend
          // await sendInterestNotification(user.firstName, users.email);
        }
      }

      // Remove this user from feed on success
      if (onRemoveCard) {
        onRemoveCard();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "An error occurred";

      console.error("Error sending request:", errorMessage);
      alert("Error: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card bg-base-100 w-96 shadow-lg">
        <figure className="bg-gray-200 h-64 w-full flex items-center justify-center">
          <img
            src={getImageUrl(photoUrl)}
            alt={`${firstName} ${lastName}`}
            className="h-64 w-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x400?text=No+Photo";
            }}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-gray-600">
              {age} years, {gender}
            </p>
          )}
          {about && <p className="text-gray-700">{about}</p>}
          {skills && skills.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-sm">Skills:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="card-actions justify-center gap-4 mt-4">
            <button
              className="btn btn-error"
              onClick={() => handleSendRequest("ignored")}
              disabled={isLoading}
            >
              Ignore
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleSendRequest("interested")}
              disabled={isLoading}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
