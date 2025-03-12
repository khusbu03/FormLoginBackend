function setTokenInHeader(res, token) {
  res.setHeader("Authorization", `Bearer ${token}`);
}

function getTokenFromHeader(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.replace("Bearer ", "");
  return token;
}

module.exports = {
  getTokenFromHeader,
  setTokenInHeader
};
