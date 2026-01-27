import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constant";
import UserCard from "./UserCard";

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      setFeed(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleRemoveCard = () => {
    // Remove the first user from the local state
    setFeed((prevFeed) => prevFeed.slice(1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return feed && feed.length > 0 ? (
    <div>
      <UserCard users={feed[0]} onRemoveCard={handleRemoveCard}></UserCard>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-bold">No more users to show</h1>
    </div>
  );
}

export default Feed;
