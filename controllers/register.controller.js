import Register from "../models/register.model.js";

export const register = async (req, res) => {
  try {
    const admin = await Register.find();

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin email Invalid, please try again" });
    }
    res.status(200).json({message: "Admin login successfully", users:admin});
   
  } catch (error) {
    console.log(error);
  }
};
