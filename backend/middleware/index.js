const expressJwt = require("express-jwt");

exports.requireSignIn = expressJwt(
  {
    secret: "asdsadsadasdasdsadasdadasdasdasdasdadasdsadasdasdasd",
    algorithms: ["HS256"],
    userProperty: "auth",
  },
  function (req, res) {
    if (!req.user._id)
      return res.sendStatus(401).json({ message: "No auhtorized" });
    res.sendStatus(200);
  }
);
