import Navbar from "./Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { addItem } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addItem(res.data.user));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userData && location.pathname !== "/") {
      fetchUser();
    }
  }, [location.pathname]);

  // Show Navbar only on authenticated pages (not on home/auth page)
  const isAuthPage = location.pathname === "/";

  return (
    <div>
      {!isAuthPage && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Body;
