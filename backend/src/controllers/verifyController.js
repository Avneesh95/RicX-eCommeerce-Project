const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const OTP = require("../model/otpModel");

const verifyRegisterOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ email });

            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            await OTP.deleteOne({ email });

            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const createdUser = await User.create({
            name: otpRecord.name,
            email: otpRecord.email,
            password: otpRecord.password, // already hashed
        });

        const user = await User.findById(createdUser._id).select("-password");

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        await OTP.deleteOne({ email });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    verifyRegisterOtp,
};