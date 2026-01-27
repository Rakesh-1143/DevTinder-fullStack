const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized user");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    req.user = decoded;
    console.log(_id);
    next();
  } catch (err) {
    res.status(400).send("error in token");
  }
};
module.exports = Auth;
