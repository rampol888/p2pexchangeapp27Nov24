import User from '../models/User.js';
import Wallet from '../models/wallet.js';
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Wallet,
        attributes: ['id', 'currency', 'balance']
      }]
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
