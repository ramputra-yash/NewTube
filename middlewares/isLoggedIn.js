const isLoggedIn = (req, res, next) => {
    if (req.user || req.cookies.userhandle) {
      return next(); // User is authenticated
    }
    res.redirect("/auth/google"); // Redirect to Google login
  };

module.exports = { isLoggedIn };