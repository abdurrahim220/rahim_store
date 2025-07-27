import User from "../models/User.js";

 const superAdmin = async () => {
  const admin = await User.findOne({ email: "admin@example.com" });
  if (!admin) {
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
      image:
        "https://res.cloudinary.com/demo/image/upload/v1588812345/avatar.png",
      cloudinary_id: "avatar",
    });
  }
};
export default superAdmin;
