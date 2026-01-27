import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import BASE_URL from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { addItem } from "./utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData =useSelector(state=>state.user)
  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addItem(res.data.user));
    } catch (err) {
      if (err.status == 401) {
        navigate("/");
      }

      console.error(err);
    }
  };
  useEffect(() => {
    if(!userData){
      fetchUser();
    }
    
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
