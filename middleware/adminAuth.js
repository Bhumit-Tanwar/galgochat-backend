export const adminAuth = (req, res, next) => {
  const { adminEmail } = req.body;

  const allowedAdmins = process.env.ADMIN_EMAILS.split(",");

  if (!allowedAdmins.includes(adminEmail)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  next();
};
