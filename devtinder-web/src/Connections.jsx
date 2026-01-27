import React, { useEffect } from "react";
import BASE_URL from "./utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./utils/connectionSlice";

function Connections() {
  const connections = useSelector((state) => state.connections);
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
    return <h1 className="text-center mt-10">No Connections Found</h1>;

  return (
    <div className="flex flex-wrap justify-center my-10">
      <h1 className="w-full text-center text-2xl font-bold mb-6">
        Your Connections
      </h1>

      {connections.map((connection) => {
        const { firstName, lastName, photoUrl, about, age, gender } = connection;

        return (
          <div
            key={connection._id}
            className="card card-compact w-96 bg-base-100 shadow-xl m-5"
          >
            <figure>
              <img
                src={photoUrl || "https://via.placeholder.com/300"}
                alt={`${firstName} ${lastName}`}
                className="h-60 w-full object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">
                {firstName} {lastName}
              </h2>

              <p>About: {about || "No bio available"}</p>
              <p>Age: {age || "N/A"}</p>
              <p>Gender: {gender || "N/A"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Connections;