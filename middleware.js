const authServices = require("./auth/services");

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({});
  }

  if (!authServices.validateAccessToken(token)) {
    return res.status(401).json({});
  }

  next();
}

function logging(req, res, next) {
  req.time = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, req.time);
  next();
}

module.exports = {
  auth,
  logging,
};
