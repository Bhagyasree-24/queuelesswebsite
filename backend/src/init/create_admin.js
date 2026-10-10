const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const User = require("../models/User");

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI) {
    throw new Error("Set MONGO_URI in backend/.env before creating an admin.");
  }
  if (!name || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in backend/.env."
    );
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(`Admin account already exists: ${email}`);
        return;
      }

      throw new Error(
        `An account with ${email} already exists as ${existingUser.role}; no changes were made.`
      );
    }

    const admin = new User({ name, email, role: "admin" });
    await User.register(admin, password);
    console.log(`Admin account created: ${email}`);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin().catch((error) => {
  console.error(`Admin account setup failed: ${error.message}`);
  process.exitCode = 1;
});