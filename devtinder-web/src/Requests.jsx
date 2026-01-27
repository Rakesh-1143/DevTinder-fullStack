import React, { useEffect } from "react";
import BASE_URL from "./utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "./utils/requestSlice";

function Requests() {
  const requests = useSelector((state) => state.requests);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/accepted", {
        withCredentials: true,
      });

      console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  

  if (requests.length === 0)
    return <h1 className="text-center my-10">No Requests Found</h1>;

  return (
    <div className="flex justify-center my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, about, age, gender } =
            request;

          return (
            <div
              key={_id}
              className="card card-compact w-96 bg-base-100 shadow-xl"
            >
              <figure>
                <img
                  src={photoUrl || "https://via.placeholder.com/300"}
                  alt={`${firstName} ${lastName}`}
                  className="h-64 w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  {firstName} {lastName}
                </h2>

                {about && <p>About: {about}</p>}
                {age && <p>Age: {age}</p>}
                {gender && <p>Gender: {gender}</p>}

                {/* Optional Action Buttons */}
                <div className="card-actions justify-end mt-3">
                  <button className="btn btn-success btn-sm">Accept</button>
                  <button className="btn btn-error btn-sm">Reject</button>
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
