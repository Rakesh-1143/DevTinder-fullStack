const validate = (body, Allowed_Users) => {
  const keys = Object.keys(body);

  return keys.every((key) => Allowed_Users.includes(key));
};
module.exports = validate;




