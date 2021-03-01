// const asyncHandler = require("../middleWare/async")
const crypto = require("crypto");
const path = require("path");
const Admin = require("../Model/admin");
const User = require("../Model/user");
const sendEmail = require("../utils/sendEmail");

exports.getUsers = async (req, res, next) => {
  const user = await User.find();
  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });
  //If the user is not an admin, they can only add one bootcamp
  if (req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, msg: "You are not An Administrator" });
  }
  // console.log(user)

  return res.status(200).json({ success: true, msg: user });
  next();
};

exports.getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });
  //If the user is not an admin, they can only add one bootcamp
  if (req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, msg: "You are not An Administrator" });
  }
  // console.log(user)

  return res.status(200).json({ success: true, msg: user });
  next();
};

//@desc    Register user
//@route   POST /api/v1/auth/users
//@access  Private/admin
exports.register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user)
    return res
      .status(400)
      .json({ success: false, msg: "User with this email already exist" });
  user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
};

//@desc    Login user
//@route   POST /api/v1/auth/users
//@access  Private/admin
exports.login = async (req, res) => {
  const { password, email } = req.body;
  // Validate email and padssword
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, msg: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (user == null)
    return res
      .status(400)
      .json({ success: false, msg: "No such user Exist in our Database" });
  if (!user)
    return res
      .status(400)
      .json({ success: false, msg: "Incorrect credentials" });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)  
    return res.status(400).json({ success: false, msg: "Incorrect Password" });
  sendTokenResponse(user, 200, res);
};

async function sendTokenResponse(user, statusCode, res) {
  const token = await user.getsignedinToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
}

//@desc    Get currently login user
//@route   Get /api/v1/auth/getme
//@access  Private

exports.getMe = async (req, res, next) => {
  // console.log(req.user)

  let user = await User.findById(req.user._id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });

  res.status(200).json({ success: true, msg: user });
  next();
};

//@desc    Logout user
//@route   Get /api/v1/auth/logout
//@access  Private
exports.logout = async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ success: true, msg: {} });
  next();
};

//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private
exports.updateAccount = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });

  //If the user is not an admin, they can only add one bootcamp
  if (user._id.toString() !== req.params.id) {
    return res.status(400).json({
      success: false,
      msg: "You are not Authorized to perform this action",
    });
  }

  const {
    fullName,
    email,
    occupation,
    number,
    line1,
    line2,
    postal,
    city,
    state,
  } = JSON.parse(req.body.text);
  const updates = {
    fullName,
    email,
    occupation,
    number,
    line1,
    line2,
    postal,
    city,
    state,
    picture: req.body.photo,
  };

  const result = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!result) return res.status(400).json({ msg: "user not found" });
  return res.status(200).json({ success: true, result });
};

//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private
exports.updateUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });

  const result = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) return res.status(400).json({ msg: "user not found" });
  res.status(200).json({ success: true, result });
  next();
};

//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private

exports.updateUserDetails = async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });
  //If the user is not an admin, they can only add one bootcamp
  if (req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, msg: "You are not An Administrator" });
  }
  // console.log(user)
  const result = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!result) return res.status(400).json({ msg: "user not found" });
  res.status(200).json({ success: true, result });
  next();
};

//@desc    Delete a user
//@route   DELETE /api/v1/bootcamp/:id
//@access  Private
exports.deleteUser = async (req, res, next) => {
  
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  user.remove();
  return res.status(200).json({ success: true, msg: {} });
};

//@desc    Reset password
//@route   PUT /api/auth/resetPassword/:resettoken
//@access  Public

exports.resetPassword = async (req, res, next) => {
  let resetPasswordToken = await crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ success: false, msg: "Invalid Token" });

  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //save user new password
  user.save({ validateBeforeSave: false });
  sendTokenResponse(user, 200, res);
};

//@desc    Post forgot password
//@route   POST /api/v1/auth/forgotpassword
//@access  Private
exports.forgotPassword = async (req, res, next) => {
  
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user)
    return res.status(404).json({ success: false, msg: "user not found" });

  // console.log(user)
  //Get reset token
  const getResetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
   
   
  //Create reset url

  const resetUrl = `https://eloquent-kowalevski-7a4ef7.netlify.app/#/reset-password/${getResetToken}`;

  const message = `You are recieving this email because you (or someone else) has requested for a change of password.
    Please click the url to reset your password \n\n ${resetUrl}`;
  // console.log('========',message);

  try {
     sendEmail({
      email: user.email,
      subject: "Password reset token",
      message: message,
      res
    });
    

     res
      .status(200)
      .json({ success: true, data: "Email sent"});
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });

    return res.status(500).json({ success: false, data: "Email could not be sent" });
  }
};
//@desc    Upload bootcamp photo
//@route   PUT /api/auth/user/:id
//@access  Private
exports.uploadUserPhoto = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(401).json({
      success: false,
      msg: `user with id of ${req.params.id} not found`,
    });

  // Make sure the owner of bootcamp id the only person to update bootcamp
  if (user._id.toString() === req.user._id) {
    return res.status(401).json({
      success: false,
      msg: `This user is not authorize to modify this course`,
    });
  }

  if (req.body.photo[0] === "undefined" && req.body.photo[1] === "undefined")
    return res
      .status(400)
      .json({ success: false, msg: `please upload a complete file` });

  const { ID, number, dob } = JSON.parse(req.body.text);

  if (ID == "" || number == "" || dob === undefined) {
    return res
      .status(400)
      .json({ success: false, msg: `Please fill all the rquired fields` });
  }

  // return
  const updates = {
    IdentificationCard: ID,
    IdNumber: number,
    dateIssued: dob,  
    photo: [req.body.photo[0], req.body.photo[1]],
  };

  const uploadedFiles = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({ success: true, msg: uploadedFiles });
};
