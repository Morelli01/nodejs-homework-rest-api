import bcrypt from "bcryptjs";
import User from "../../schemas/user.js";
import { HttpError } from "../../helpers/HttpErrors.js";
import { ctrlWrapper } from "../../helpers/ctrlWraper.js";
import gravatar from 'gravatar'

const reg = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
        ...req.body, password: hashPassword, avatarURL
    });

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    });
};

export const register = ctrlWrapper(reg);