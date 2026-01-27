import React, { useEffect } from "react";
import axios from "axios";
import BASE_URL from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "./utils/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data.data));
      //   console.log("Feed users:", res.data.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return feed &&(
    <div>
      <UserCard users={feed[0]}></UserCard>
    </div>
  );
}

export default Feed;
