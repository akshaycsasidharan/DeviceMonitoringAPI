import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (req, res) => {
  const user = {
    userId: "user1",
    username: "testuser",
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};
