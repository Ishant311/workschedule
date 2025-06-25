const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const getAllUsersExceptSelf = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('name email userType createdAt');

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};


const createUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['employee', 'manager'].includes(userType)) {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      },
    });
  } catch (err) {
    console.error('User creation failed:', err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createUser,
  getAllUsersExceptSelf, 
};