const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
  };
};

module.exports = { roleMiddleware };