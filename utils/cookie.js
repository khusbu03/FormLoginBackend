function setCookie(res, tokenName, tokenValue) {
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    secure: true,
    path: "/",
    sameSite: "None"
  };

  res.cookie(tokenName, tokenValue, options);
}

function removeTokenFromCookie(res) {
  const options = {
    expires: new Date(),
    secure: true,
    path: "/",
    sameSite: "None"
  };

  res.cookie("token", "", options);
}

module.exports = {
  setCookie,removeTokenFromCookie
}
