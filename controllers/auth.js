const { requireSignIn, requireAuth } = require("../services/passport");
const getTokenForUser = require("../services/token");

const signIn = (req, res) => {
  console.log(`auth signin`)
  res.send({ token: getTokenForUser(req.user) });
};

module.exports = { signIn, requireSignIn, requireAuth };