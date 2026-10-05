import User from '../models/User.js';

export async function createUser(req, res) {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({ name, email, role });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Database error while creating user',
    });
  }
}

export async function getUsers(_req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Database error while fetching users',
    });
  }
}
