const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = user => {
  return jwt.encode(
    {
      sub: user.id,
      iat: moment().unix()
    },
    process.env.secret
  );
};
