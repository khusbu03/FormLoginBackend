function setTokenInHeader(res, token) {
  res.setHeader("Authorization", `Bearer ${token}`);
}

function getTokenFromHeader(req) {
  //it gets the access token
  const authHeader = req.headers["authorization"];
  if(authHeader){
    const token = authHeader.replace("Bearer ", "");
    return token;
  }
  return null;
  
}

module.exports = {
  getTokenFromHeader,
  setTokenInHeader
};
