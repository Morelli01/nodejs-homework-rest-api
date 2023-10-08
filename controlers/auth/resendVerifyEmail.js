import { ctrlWrapper } from "../../helpers/ctrlWraper.js";
import User from "../../schemas/user.js";
import { HttpError } from "../../helpers/HttpErrors.js"
import { sendEmail } from '../../helpers/sendEmail.js';
const { BASE_URL } = process.env;

const resendEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, 'User not found')
    };
    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed')
    };

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify your email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: 'Verification email is sent',
    });
};

export const resendVerifyEmail = ctrlWrapper(resendEmail);