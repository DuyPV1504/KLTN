require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));


const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "user" }
});
const User = mongoose.model("users", UserSchema);


app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, role });

  await newUser.save();
  res.json({ message: "User registered successfully" });
});


app.post("/login", async (req, res) => {
  console.log("🔵 Login request received:", req.body); 

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ message: "Missing email or password" });
  }

  const user = await User.findOne({ email });
  console.log("🟠 User found in DB:", user); 

  if (!user) {
    console.log("❌ Email không tồn tại trong DB");
    return res.status(400).json({ message: "Invalid email or password" });
  }

  console.log("🔑 Checking password...");
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("🟢 Password match result:", isMatch); // Kiểm tra mật khẩu có đúng không

  if (!isMatch) {
    console.log("❌ Mật khẩu sai!");
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("✅ Login successful!");
  res.json({ token, role: user.role });
});



app.get("/me", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

