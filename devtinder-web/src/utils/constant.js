// const BASE_URL= "http://localhost:3000"
// export default BASE_URL

// devtinder-web/src/utils/constant.js

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://devtinder-backend-d3yp.onrender.com"
    : "http://localhost:3000";

export default BASE_URL;
