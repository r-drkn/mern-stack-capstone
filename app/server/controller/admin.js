const User = require("../models/user");

const findAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users: users });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const findUser = async (username, email) => {
  const user = await User.findOne({
    $and: [{ username }, { email }],
  });

  if (!user) {
    throw new Error("user does not exist.");
  } else {
    return user;
  }
};

const promoteAdmin = async (req, res, next) => {
  console.log(req.body);
  const { username, email } = req.body;
  try {
    const admin = await findUser(username, email);

    if (!admin.roles.includes("admin")) {
      await User.findOneAndUpdate(
        { _id: admin._id },
        { $push: { roles: "admin" } }
      );
    } else {
      throw new Error("user was already an admin.");
    }
    res.status(201).json({ response: "user promoted to admin." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const demoteAdmin = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const admin = await findUser(username, email);
    if (admin.roles.includes("admin")) {
      await User.findOneAndUpdate(
        { _id: admin._id },
        { $pull: { roles: "admin" } }
      );
    } else {
      throw new Error("user was not an admin.");
    }
    res.status(201).json({ response: "admin demoted to user." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const listAdmins = async (req, res, next) => {
  try {
    const rawList = await User.find({ roles: "admin" });
    const adminList = rawList.map((admin) => ({
      username: admin.username,
      email: admin.email,
    }));
    res.status(200).json({ admins: adminList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { promoteAdmin, demoteAdmin, listAdmins, findAllUsers };
