const bcrypt = require("bcryptjs");
const User = require("../model/UserModel");
const OTP = require("../model/otpModel");
const sendEmail = require("../utils/mailService");

const sendRegisterOtp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const hashedPassword = await bcrypt.hash(password, 10);

        await OTP.deleteMany({ email });

        await OTP.create({
            name,
            email,
            password: hashedPassword,
            otp,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            ),
        });

        await sendEmail(
            email,
            "Registration OTP",
            `Your OTP is ${otp}`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};