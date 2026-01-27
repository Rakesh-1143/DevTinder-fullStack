import React, { useEffect } from "react";
import BASE_URL from "../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { getImageUrl } from "../utils/imageHelper";

function Connections() {
  const connections = useSelector((state) => state.connections);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      console.log("Connections:", res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return <h1>Loading...</h1>;

  if (connections.length === 0)
    return <h1 className="text-center mt-10 text-2xl">No Connections Found</h1>;

  return (
    <div className="flex flex-wrap justify-center my-10">
      <h1 className="w-full text-center text-2xl font-bold mb-6">
        Your Connections
      </h1>

      {connections.map((connection) => {
        // Determine which user is the connected person (not the current user)
        const connectedUser =
          connection.fromUserId._id === user?._id
            ? connection.toUserId
            : connection.fromUserId;

        const { firstName, lastName, photoUrl, about, age, gender } =
          connectedUser;

        return (
          <div
            key={connection._id}
            className="card card-compact w-96 bg-base-100 shadow-xl m-5"
          >
            <figure>
              <img
                src={getImageUrl(photoUrl)}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Connections;
