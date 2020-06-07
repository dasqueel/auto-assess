const { requireSignIn, requireAuth } = require("../services/passport");
const getTokenForUser = require("../services/token");

// send everything you want to store in the FE cookie
const signIn = (req, res) => {
  res.json(
    {
      token: getTokenForUser(req.user),
      username: req.body.username
    }
  );
};

module.exports = { signIn, requireSignIn, requireAuth };