import React, { useEffect } from "react";
import BASE_URL from "../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { getImageUrl } from "../utils/imageHelper";

function Requests() {
  const requests = useSelector((state) => state.requests);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/pending", {
        withCredentials: true,
      });

      console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err.message);
    }
  };

  const handleRequestReview = async (requestId, status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        {
          withCredentials: true,
        },
      );
      // Refresh the requests after action
      fetchRequests();
    } catch (err) {
      console.error(
        "Error reviewing request:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <h1>Loading...</h1>;

  if (requests.length === 0)
    return <h1 className="text-center my-10 text-2xl">No Pending Requests</h1>;

  return (
    <div className="flex justify-center my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const user = request.fromUserId;
          const { _id, firstName, lastName, photoUrl, about, age, gender } =
            user;

          return (
            <div
              key={request._id}
              className="card card-compact w-96 bg-base-100 shadow-xl"
            >
              <figure className="bg-gray-200 h-64 w-full flex items-center justify-center">
                <img
                  src={getImageUrl(photoUrl)}
                  alt={`${firstName} ${lastName}`}
                  className="h-64 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x400?text=No+Photo";
                  }}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  {firstName} {lastName}
                </h2>

                {about && <p>About: {about}</p>}
                {age && <p>Age: {age}</p>}
                {gender && <p>Gender: {gender}</p>}

                <div className="card-actions justify-end mt-3">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRequestReview(request._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleRequestReview(request._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Requests;
