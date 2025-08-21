const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) return res.redirect("/login");

    if (!allowedRoles.includes(role)) {
      const redirectMap = {
        admin: "/admin/dashboard",
        user: "/user/dashboard",
      };

      return res.redirect(redirectMap[role] || "/login");
    }

    next();
  };
};

module.exports = roleMiddleware;
